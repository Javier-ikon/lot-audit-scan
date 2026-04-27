// Starts a new audit session for a rooftop
// 
// Usage:
//   function.run "start_session" {
//     input = {
//       user_id: 123
//       rooftop_id: 456
//     }
//   }
// 
// Returns:
//   {
//     success: true,
//     session: {id: 789, rooftop_id: 456, status: "in_progress", started_at: "2026-03-10T10:30:00Z"}
//   }
function start_session {
  input {
    // User ID of the FSM starting the session
    int user_id
  
    // Rooftop ID being audited
    int rooftop_id
  
    // Optional session metadata (device info, etc.)
    json session_metadata?
  }

  stack {
    var $result {
      value = {success: false, session: null, error: null}
    }
  
    try_catch {
      try {
        // Get user context (account_id, role)
        function.run get_user_context {
          input = {user_id: $input.user_id}
        } as $user_context
      
        // Check if user exists
        conditional {
          if ($user_context.success == false) {
            var.update $result {
              value = $result|set:"error":"User not found"
            }
          
            function.run heartbeat_log {
              input = {
                level  : "error"
                message: {
                source : "start_session"
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
      
        // Create new audit session
        db.add audit_session {
          data = {
            account_id      : $user_context.user.account_id
            rooftop_id      : $input.rooftop_id
            user_id         : $input.user_id
            started_at      : now
            status          : "in_progress"
            session_metadata: $input.session_metadata
          }
        } as $session
      
        // Build session response
        var $session_data {
          value = {
            id        : $session.id
            rooftop_id: $session.rooftop_id
            user_id   : $session.user_id
            account_id: $session.account_id
            status    : $session.status
            started_at: $session.started_at
          }
        }
      
        var.update $result {
          value = $result
            |set:"success":true
            |set:"session":$session_data
        }
      
        // Log success
        function.run heartbeat_log {
          input = {
            level  : "success"
            message: {
            source    : "start_session"
            session_id: $session.id
            rooftop_id: $input.rooftop_id
            user_id   : $input.user_id
            account_id: $user_context.user.account_id
          }
          }
        } as $log
      }
    
      catch {
        var.update $result {
          value = $result
            |set:"error":"Failed to start session"
        }
      
        function.run heartbeat_log {
          input = {
            level  : "error"
            message: {
            source    : "start_session"
            user_id   : $input.user_id
            rooftop_id: $input.rooftop_id
            error     : "Failed to start session"
          }
          }
        } as $log
      }
    }
  }

  response = $result
}