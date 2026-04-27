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

        // DINT-03: Increment total_scans on the session
        db.edit audit_session {
          field_name  = "id"
          field_value = $input.session_id
          data = {
            total_scans: $session.total_scans|first_notnull:0|add:1
          }
        } as $_

        // DINT-04: Initialize classification variables (defaults — overwritten below after PX fetch)
        var $classified_status {
          value = "installed"
        }

        var $is_exception {
          value = false
        }
      
        // Call Planet X directly (avoids internal auth issues)
        api.request {
          url = "https://myportalqa.ikongps.com/quality-control/devices"
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
        // Rules evaluated in order; first match wins. Default: installed / pass.
        // No device found in Planet X → missing_device (exception)
        conditional {
          if ($px_data == null) {
            var.update $classified_status {
              value = "missing_device"
            }

            var.update $is_exception {
              value = true
            }
          }
        }

        // Rules evaluated only when device exists in Planet X
        conditional {
          if ($px_data != null) {
            var $px_classified {
              value = false
            }

            // Rule 1: Not Reporting — last report > 24 h ago or null
            var $cutoff_24h {
              value = now|add_secs_to_timestamp:-86400
            }

            conditional {
              if ($px_classified == false && ($px_data.lastReported == null || $px_data.lastReported < $cutoff_24h)) {
                var.update $classified_status { value = "not_reporting" }
                var.update $is_exception { value = true }
                var.update $px_classified { value = true }
              }
            }

            // Rule 4: Not Installed — company and group both end with " non-registration"
            conditional {
              if ($px_classified == false && $px_data.company.name|contains:" non-registration" && $px_data.group.name|contains:" non-registration") {
                var.update $classified_status { value = "not_installed" }
                var.update $is_exception { value = true }
                var.update $px_classified { value = true }
              }
            }

            // Rule 5: Missing Device — dedicated API flag from Planet X
            conditional {
              if ($px_classified == false && $px_data.device_status.name|to_lower|contains:"missing") {
                var.update $classified_status { value = "missing_device" }
                var.update $is_exception { value = true }
                var.update $px_classified { value = true }
              }
            }

            // Rule 6: Installed (default — already set; $px_classified stays false if no rule matched)
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
              }
            } as $_
          }
        }

        // DINT-04: Increment total_exceptions or total_passes on the session
        conditional {
          if ($is_exception == true) {
            db.edit audit_session {
              field_name  = "id"
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
              field_name  = "id"
              field_value = $input.session_id
              data = {
                total_passes: $session.total_passes|first_notnull:0|add:1
              }
            } as $_
          }
        }
        // Build response
        var $scan_data {
          value = {
            id          : $scan.id
            vin         : $scan.vin
            scan_method : $scan.scan_method
            scanned_at  : $scan.scanned_at
            device_found: ($px_data != null)
            device      : $device
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