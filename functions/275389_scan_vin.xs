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
      
        // Create scan record
        db.add scan {
          data = {
            account_id      : $session.account_id
            audit_session_id: $input.session_id
            vin             : $input.vin
            scan_method     : $input.scan_method
            scanned_at      : now
            scan_metadata   : $input.scan_metadata
          }
        } as $scan
      
        // Build response
        var $scan_data {
          value = {
            id         : $scan.id
            vin        : $scan.vin
            scan_method: $scan.scan_method
            scanned_at : $scan.scanned_at
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
}