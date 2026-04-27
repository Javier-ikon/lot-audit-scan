//  Simplified logging function - logs success or failure events
// 
//  Usage:
//    function.run "heartbeat_log" {
//      input = {
//        level: "success"
//        message: {
//          source: "validate_vin"
//          vin: "1HGBH41JXMN109186"
//          account_id: 123
//          user_id: 456
//          error: null
//        }
//      }
//    }
// 
//  Returns: {success: true, log_id: 789}
function heartbeat_log {
  input {
    // Log level: "success", "error", "info", "warning", "debug", "critical"
    text level?=info filters=trim
  
    // Message data (JSON) - can contain anything you want to log
    // Example: {source: "validate_vin", vin: "ABC123", account_id: 1, error: "Invalid VIN"}
    json message
  }

  stack {
    var $result {
      value = {success: false, log_id: null}
    }
  
    try_catch {
      try {
        // Extract source from message JSON (if it exists)
        var $source {
          value = $input.message.source
        }
      
        // Convert message JSON to readable string
        var $message_text {
          value = $input.message|json_encode
        }
      
        // Insert log entry into heartbeat_log table
        db.add heartbeat_log {
          data = {
            level  : $input.level
            source : $source
            message: $message_text
            context: $input.message
          }
        } as $log_entry
      
        var.update $result {
          value = $result
            |set:"success":true
            |set:"log_id":$log_entry.id
        }
      }
    
      catch {
        // If logging fails, don't crash the calling function
        // Just return failure silently
        var.update $result {
          value = $result
            |set:"success":false
            |set:"error":"Failed to write log entry"
        }
      }
    }
  }

  response = $result
}