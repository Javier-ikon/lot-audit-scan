// Validates VIN (Vehicle Identification Number) format
// VIN must be exactly 17 characters and cannot contain I, O, or Q
// 
// Usage:
//   function.run "utils/validate_vin" {
//     input = {vin: "VIN17CHARS"}
//   }
// 
// Returns:
//   {valid: true, vin: "VIN17CHARS"} OR
//   {valid: false, error: "VIN must be exactly 17 characters"}
// Return validation result
// Input parameters
// Function logic
function validate_vin {
  input {
    // VIN to validate (will be trimmed and uppercased)
    text vin filters=trim|upper
  
    // Account ID for logging purposes
    int account_id?
  
    // User ID for logging purposes
    int user_id?
  
    // Request ID for tracing
    text request_id? filters=trim
  }

  stack {
    // Initialize result
    var $result {
      value = {valid: false, vin: $input.vin, error: null}
    }
  
    var $vin {
      value = $input.vin
    }
  
    try_catch {
      try {
        // Validation Rule 1: VIN must be exactly 17 characters
        conditional {
          if (($input.vin|strlen) != 17) {
            var.update $result {
              value = $result
                |set:"error":"VIN must be exactly 17 characters"
            }
          
            return {
              value = $result
            }
          }
        
          else {
            debug.log {
              value = "coco butter"
            }
          }
        }
      
        // Validation Rule 2: VIN cannot contain I, O, or Q (per ISO 3779 standard)
        var $invalid_chars {
          value = ["I", "O", "Q"]
        }
      
        var $has_invalid_char {
          value = false
        }
      
        var $found_char {
          value = null
        }
      
        var $vin_text {
          value = $vin
        }
      
        foreach ($invalid_chars) {
          each as $char {
            text.contains $vin_text {
              value = $char
            } as $contains_char
          
            conditional {
              if ($contains_char) {
                var.update $has_invalid_char {
                  value = true
                }
              
                var.update $found_char {
                  value = $char
                }
              
                break
              }
            }
          }
        }
      
        conditional {
          if ($has_invalid_char) {
            var $error_message {
              value = "VIN cannot contain the letters I, O, or Q"
            }
          
            var.update $result {
              value = $result|set:"error":$error_message
            }
          
            return {
              value = $result
            }
          }
        }
      
        // All validations passed - update result to success
        var.update $result {
          value = $result
            |set:"valid":true
            |set:"error":null
        }
      }
    
      catch {
        // Catch any unexpected errors
        var.update $result {
          value = $result
            |set:"valid":false
            |set:"error":"Unexpected error during VIN validation"
        }
      }
    }
  }

  response = $result
}