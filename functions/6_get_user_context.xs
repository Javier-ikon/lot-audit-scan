// Gets user context including account_id and role for multi-tenant operations
// 
// Usage:
//   function.run "get_user_context" {
//     input = {user_id: 123}
//   }
// 
// Returns:
//   {
//     success: true,
//     user: {id: 123, name: "John Doe", email: "john@example.com", account_id: 1, role: "fsm"}
//   }
function get_user_context {
  input {
    // User ID to fetch context for
    int user_id
  }

  stack {
    var $result {
      value = {success: false, user: null, error: null}
    }
  
    try_catch {
      try {
        // Fetch user from database
        db.get user {
          field_name = "id"
          field_value = $input.user_id
        } as $user
      
        // Check if user exists
        conditional {
          if ($user == null) {
            var.update $result {
              value = $result|set:"error":"User not found"
            }
          
            // Log error
            function.run heartbeat_log {
              input = {
                level  : "error"
                message: {
                source : "get_user_context"
                user_id: $input.user_id
                error  : "User not found"
              }
              }
            } as $log
          
            return {
              value = $result
            }
          }
        }
      
        // Build user context object
        var $user_context {
          value = {
            id        : $user.id
            name      : $user.name
            email     : $user.email
            account_id: $user.account_id
            role      : $user.role
          }
        }
      
        var.update $result {
          value = $result
            |set:"success":true
            |set:"user":$user_context
        }
      
        // Log success
        function.run heartbeat_log {
          input = {
            level  : "debug"
            message: {
            source    : "get_user_context"
            user_id   : $user.id
            account_id: $user.account_id
            role      : $user.role
          }
          }
        } as $log
      }
    
      catch {
        var.update $result {
          value = $result
            |set:"error":"Failed to fetch user context"
        }
      
        // Log error
        function.run heartbeat_log {
          input = {
            level  : "error"
            message: {
            source : "get_user_context"
            user_id: $input.user_id
            error  : "Failed to fetch user context"
          }
          }
        } as $log
      }
    }
  }

  response = $result
}