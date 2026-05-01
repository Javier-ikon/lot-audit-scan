// Records a VIN scan during an audit session
// 
// Usage:
//   function.run "scan_vin" {
//     input = {
//       session_id: 1
//       vin: "<VIN>"
//       scan_method: "barcode"
//     }
//   }
// 
// Returns:
//   {
//     success: true,
//     scan: {id: 123, vin: "<VIN>", device_status: "installed"}
//   }
function scan_vin {
  input {
    // Active audit session ID
    int session_id
  
    // VIN to scan (trimmed and uppercased for consistency)
    text vin filters=trim|upper
  
    // How the VIN was captured
    enum scan_method?=barcode {
      values = ["barcode", "qr_code", "manual"]
    }
  
    // Optional scan metadata (GPS, photo URLs, etc.)
    json scan_metadata?
  }

  stack {
    var $result {
      value = {success: false, scan: null, error: null}
    }
  
    try_catch {
      try {
        // Validate VIN format
        function.run validate_vin {
          input = {vin: $input.vin}
        } as $vin_validation
      
        // Check if VIN is valid
        conditional {
          if ($vin_validation.valid == false) {
            // Get error message from validation, with fallback
            var $error_msg {
              value = $vin_validation.error
            }
          
            // Defensive check: if validation failed but no error message provided
            conditional {
              if ($error_msg == null) {
                var.update $error_msg {
                  value = "VIN validation failed"
                }
              }
            }
          
            var.update $result {
              value = $result|set:"error":$error_msg
            }
          
            function.run heartbeat_log {
              input = {
                level  : "error"
                message: {
                source    : "scan_vin"
                session_id: $input.session_id
                vin       : $input.vin
                error     : $error_msg
              }
              }
            } as $log
          
            return {
              value = $result
            }
          }
        }
      
        // Fetch session to get account_id
        db.get audit_session {
          field_name = "id"
          field_value = $input.session_id
        } as $session
      
        // Check if session exists
        conditional {
          if ($session == null) {
            var.update $result {
              value = $result|set:"error":"Session not found"
            }
          
            function.run heartbeat_log {
              input = {
                level  : "error"
                message: {
                source    : "scan_vin"
                session_id: $input.session_id
                vin       : $input.vin
                error     : "Session not found"
              }
              }
            } as $log
          
            return {
              value = $result
            }
          }
        }
      
        // Check if session is still active
        conditional {
          if ($session.status != "in_progress") {
            var.update $result {
              value = $result
                |set:"error":"Session is not active"
            }
          
            function.run heartbeat_log {
              input = {
                level  : "error"
                message: {
                source        : "scan_vin"
                session_id    : $input.session_id
                vin           : $input.vin
                session_status: $session.status
                error         : "Cannot scan VIN - session is not active"
              }
              }
            } as $log
          
            return {
              value = $result
            }
          }
        }
      
        // Check for duplicate active VIN in this session
        db.query scan {
          description = "Check for duplicate active VIN in session"
          where = $db.scan.audit_session_id == $input.session_id && $db.scan.vin == $input.vin && $db.scan.is_deleted == false
          return = {type: "exists"}
        } as $duplicate_exists

        conditional {
          if ($duplicate_exists == true) {
            var.update $result {
              value = $result|set:"error":"VIN already scanned in this session"
            }

            return {
              value = $result
            }
          }
        }

        // Create scan record
        db.add scan {
          data = {
            account_id      : $session.account_id
            dealer_group_id : $session.dealer_group_id
            audit_session_id: $input.session_id
            vin             : $input.vin
            scan_method     : $input.scan_method
            scanned_at      : now
            scan_metadata   : $input.scan_metadata
          }
        } as $scan

        // E6-01: Decode VIN via NHTSA vPIC — non-blocking, failure must not fail the scan
        var $vehicle_make  { value = null }
        var $vehicle_model { value = null }
        var $vehicle_year  { value = null }

        try_catch {
          try {
            api.request {
              url    = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/"|append:$input.vin|append:"?format=json"
              method = "GET"
              headers = []
                |push:"Accept: application/json"
            } as $nhtsaResponse

            var $nhtsa_result {
              value = $nhtsaResponse.response.Results|first
            }

            conditional {
              if ($nhtsa_result != null) {
                var.update $vehicle_make  { value = $nhtsa_result.Make|first_notnull:null }
                var.update $vehicle_model { value = $nhtsa_result.Model|first_notnull:null }
                var.update $vehicle_year  { value = $nhtsa_result.ModelYear|first_notnull:null }
              }
            }
          }

          catch {
            // NHTSA decode failed — vehicle fields remain null; scan proceeds normally
            function.run heartbeat_log {
              input = {
                level  : "warning"
                message: {
                  source: "scan_vin"
                  step  : "nhtsa_decode"
                  vin   : $input.vin
                  error : "NHTSA vPIC decode failed — vehicle descriptor will be null"
                }
              }
            } as $_
          }
        }

        // DINT-03: Increment total_scans on the session
        db.edit audit_session {
          field_name = "id"
          field_value = $input.session_id
          data = {total_scans: $session.total_scans|first_notnull:0|add:1}
        } as $_

        // E9-03: Fetch rooftop for wrong rooftop comparison — non-blocking, failure must not fail the scan
        var $rooftop {
          value = null
        }

        try_catch {
          try {
            db.get rooftop {
              field_name  = "id"
              field_value = $session.rooftop_id
            } as $rooftop_record

            var.update $rooftop {
              value = $rooftop_record
            }
          }

          catch {
            function.run heartbeat_log {
              input = {
                level  : "warning"
                message: {
                  source    : "scan_vin"
                  step      : "rooftop_fetch"
                  session_id: $input.session_id
                  error     : "Rooftop fetch failed — wrong_rooftop rule will be skipped"
                }
              }
            } as $_
          }
        }

        // DINT-04: Initialize classification variables (defaults — overwritten below after PX fetch)
        var $classified_status {
          value = "installed"
        }

        var $is_exception {
          value = false
        }

        // E9: Required action message (set per classification rule, persisted to scan record)
        var $required_action {
          value = null
        }

        // E10-02: All exception types that fired for this scan (multi-exception support)
        var $exceptions {
          value = []
        }

        // Call Planet X directly (avoids internal auth issues)
        api.request {
          url = "https://myportal.ikongps.com/quality-control/devices"
          method = "POST"
          params = {}
            |set:"token":$env.planetxDevice
            |set:"vins":([]|push:$input.vin)
          headers = []
            |push:"Content-Type: application/json"
        } as $deviceResponse

        // Extract first result from Planet X data array
        var $px_data {
          value = $deviceResponse.response.result.data|first
        }
      
        // Normalize into 6 flat display fields
        var $device {
          value = null
        }
      
        conditional {
          if ($px_data != null) {
            var.update $device {
              value = {
                vin          : $px_data.vin
                serial       : $px_data.gps_unit.imei|first_notnull:$px_data.gps_unit.serial
                company      : $px_data.company.name
                group        : $px_data.group.name
                last_report  : $px_data.lastReported
                device_status: $px_data.device_status.name|first_notnull:"Unknown"
              }
            }
          }
        }
      
        // DINT-04: Classify device status per status-classification-rules.md
        // E9-02: No device record in Planet X → VIN has no associated device (revenue opportunity)
        // E10-02: Also sets $exceptions array for consistency with multi-exception model
        conditional {
          if ($px_data == null) {
            var.update $classified_status {
              value = "no_device"
            }

            var.update $is_exception {
              value = true
            }

            var.update $required_action {
              value = "Install device — revenue opportunity"
            }

            var.update $exceptions {
              value = $exceptions|push:"no_device"
            }
          }
        }

        // E10-02: Rules evaluated independently — all matching rules collect into $exceptions array
        // No short-circuit; a vehicle can trigger multiple concurrent exceptions
        // Default classified_status remains "installed" if no rules fire
        conditional {
          if ($px_data != null) {
            var $cutoff_24h {
              value = now|add_secs_to_timestamp:-86400
            }

            // Rule 1: Not Reporting — last report > 24 h ago or null
            conditional {
              if ($px_data.lastReported == null || $px_data.lastReported < $cutoff_24h) {
                var.update $exceptions { value = $exceptions|push:"not_reporting" }
                var.update $is_exception { value = true }
              }
            }

            // Rule 2: Wrong Rooftop — VIN's Planet X group does not match session rooftop
            // Skipped if rooftop fetch failed ($rooftop == null) to avoid false positives
            conditional {
              if ($rooftop != null && $px_data.group.name != $rooftop.name) {
                var.update $exceptions { value = $exceptions|push:"wrong_rooftop" }
                var.update $is_exception { value = true }
              }
            }

            // Rule 3: Customer Registered — device is assigned to a customer account, not the dealer
            conditional {
              if ($px_data.device_detail.CustomerName != null || $px_data.device_detail.FirstName != null || $px_data.device_detail.DateSold != null) {
                var.update $exceptions { value = $exceptions|push:"customer_registered" }
                var.update $is_exception { value = true }
              }
            }

            // Rule 4: Not Installed — company OR group name contains "Non Registrations" (case-insensitive)
            conditional {
              if ($px_data.company.name|to_lower|contains:"non registrations" || $px_data.group.name|to_lower|contains:"non registrations") {
                var.update $exceptions { value = $exceptions|push:"not_installed" }
                var.update $is_exception { value = true }
              }
            }

            // Rule 5: Missing Device — dedicated API flag from Planet X
            conditional {
              if ($px_data.device_status.name|to_lower|contains:"missing") {
                var.update $exceptions { value = $exceptions|push:"missing_device" }
                var.update $is_exception { value = true }
              }
            }
          }
        }

        // E10-02: Resolve primary classified_status from $exceptions by severity priority
        // array.find_index must be at top-level stack scope (not inside a conditional block)
        // Priority: missing_device > not_installed > wrong_rooftop > customer_registered > not_reporting
        // Returns -1 when exception not in array; >= 0 means it fired
        // All priority conditionals are no-ops when $px_data == null ($classified_status is already "no_device")
        array.find_index ($exceptions) if (`$this == "missing_device"`) as $idx_missing_device
        array.find_index ($exceptions) if (`$this == "not_installed"`) as $idx_not_installed
        array.find_index ($exceptions) if (`$this == "wrong_rooftop"`) as $idx_wrong_rooftop
        array.find_index ($exceptions) if (`$this == "customer_registered"`) as $idx_customer_registered
        array.find_index ($exceptions) if (`$this == "not_reporting"`) as $idx_not_reporting

        conditional {
          if ($idx_missing_device >= 0) {
            var.update $classified_status { value = "missing_device" }
            var.update $required_action { value = "Device hardware is missing or removed — log for recovery or replacement" }
          }
        }

        conditional {
          if ($classified_status == "installed" && $idx_not_installed >= 0) {
            var.update $classified_status { value = "not_installed" }
            var.update $required_action { value = "Vehicle in Non Registrations account — install device" }
          }
        }

        conditional {
          if ($classified_status == "installed" && $idx_wrong_rooftop >= 0) {
            var.update $classified_status { value = "wrong_rooftop" }
            var.update $required_action { value = "Vehicle registered to a different rooftop" }
          }
        }

        conditional {
          if ($classified_status == "installed" && $idx_customer_registered >= 0) {
            var.update $classified_status { value = "customer_registered" }
            var.update $required_action { value = "Vehicle sold to customer — verify ownership transfer" }
          }
        }

        conditional {
          if ($classified_status == "installed" && $idx_not_reporting >= 0) {
            var.update $classified_status { value = "not_reporting" }
            var.update $required_action { value = "Device has not reported in over 24 hours — flag for service inspection" }
          }
        }

        // Persist Planet X snapshot + classification into the scan row (non-blocking)
        conditional {
          if ($px_data != null) {
            // DINT-05: imei uses first_notnull fallback so DB matches UI display value
            db.edit scan {
              field_name  = "id"
              field_value = $scan.id
              data = {
                imei            : $px_data.gps_unit.imei|first_notnull:$px_data.gps_unit.serial
                serial          : $px_data.gps_unit.serial
                company         : $px_data.company.name
                group           : $px_data.group.name
                last_report_date: $px_data.lastReported
                activated_at    : $px_data.gps_unit.firstReportDate
                device_data     : $px_data
                device_status   : $classified_status
                is_exception    : $is_exception
                required_action : $required_action
                exceptions      : $exceptions
              }
            } as $_
          }
        }

        // E9-02 / E10-02: Persist classification for no_device case (no PX record — revenue opportunity)
        conditional {
          if ($px_data == null) {
            db.edit scan {
              field_name  = "id"
              field_value = $scan.id
              data = {
                device_status  : $classified_status
                is_exception   : $is_exception
                required_action: $required_action
                exceptions     : $exceptions
              }
            } as $_
          }
        }

        // DINT-04: Increment total_exceptions or total_passes on the session
        conditional {
          if ($is_exception) {
            db.edit audit_session {
              field_name = "id"
              field_value = $input.session_id
              data = {
                total_exceptions: $session.total_exceptions|first_notnull:0|add:1
              }
            } as $_
          }
        }

        conditional {
          if ($is_exception == false) {
            db.edit audit_session {
              field_name = "id"
              field_value = $input.session_id
              data = {total_passes: $session.total_passes|first_notnull:0|add:1}
            } as $_
          }
        }

        // E6-01: Persist NHTSA vehicle descriptor — unconditional, independent of Planet X result
        conditional {
          if ($vehicle_make != null || $vehicle_model != null || $vehicle_year != null) {
            db.edit scan {
              field_name  = "id"
              field_value = $scan.id
              data = {
                make : $vehicle_make
                model: $vehicle_model
                year : $vehicle_year
              }
            } as $_
          }
        }

        // Build response
        var $scan_data {
          value = {
            id             : $scan.id
            vin            : $scan.vin
            scan_method    : $scan.scan_method
            scanned_at     : $scan.scanned_at
            device_found   : ($px_data != null)
            device         : $device
            make           : $vehicle_make
            model          : $vehicle_model
            year           : $vehicle_year
            device_status  : $classified_status
            is_exception   : $is_exception
            required_action: $required_action
            exceptions     : $exceptions
          }
        }
      
        var.update $result {
          value = $result
            |set:"success":true
            |set:"scan":$scan_data
        }
      
        // Log success
        function.run heartbeat_log {
          input = {
            level  : "success"
            message: {
            source    : "scan_vin"
            session_id: $input.session_id
            scan_id   : $scan.id
            vin       : $input.vin
            account_id: $session.account_id
          }
          }
        } as $log
      }
    
      catch {
        var.update $result {
          value = $result
            |set:"error":"Failed to record scan"
        }
      
        function.run heartbeat_log {
          input = {
            level  : "error"
            message: {
            source    : "scan_vin"
            session_id: $input.session_id
            vin       : $input.vin
            error     : "Failed to record scan"
          }
          }
        } as $log
      }
    }
  }

  response = $result
  guid = "GFe7mSa_8Fd2hi9L879E7Me3Gcs"
}