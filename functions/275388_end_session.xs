// Ends an active audit session
// 
// Usage:
//   function.run "end_session" {
//     input = {
//       session_id: 789
//       user_id: 123
//     }
//   }
// 
// Returns:
//   {
//     success: true,
//     session: {id: 789, status: "completed", ended_at: "2026-03-10T11:30:00Z"}
//   }
function end_session {
  input {
    // Session ID to end
    int session_id
  
    // User ID of the FSM ending the session
    int user_id
  
    // Optional notes from the FSM
    text notes? filters=trim
  }

  stack {
    var $result {
      value = {success: false, session: null, error: null}
    }
  
    try_catch {
      try {
        // Get user context (account_id for security)
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
                source    : "end_session"
                session_id: $input.session_id
                user_id   : $input.user_id
                error     : "User not found"
              }
              }
            } as $log
          
            return {
              value = $result
            }
          }
        }
      
        // Fetch the session to verify ownership
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
                source    : "end_session"
                session_id: $input.session_id
                user_id   : $input.user_id
                error     : "Session not found"
              }
              }
            } as $log
          
            return {
              value = $result
            }
          }
        }
      
        // Verify user owns this session (multi-tenant security)
        conditional {
          if ($session.user_id != $input.user_id) {
            var.update $result {
              value = $result
                |set:"error":"Unauthorized: Session belongs to another user"
            }
          
            function.run heartbeat_log {
              input = {
                level  : "error"
                message: {
                source       : "end_session"
                session_id   : $input.session_id
                user_id      : $input.user_id
                session_owner: $session.user_id
                error        : "Unauthorized access attempt"
              }
              }
            } as $log
          
            return {
              value = $result
            }
          }
        }
      
        // Update session to completed
        db.edit audit_session {
          field_name = "id"
          field_value = $input.session_id
          data = {
            status  : "completed"
            ended_at: now
            notes   : $input.notes
          }
        } as $updated_session
      
        // Build response
        var $session_data {
          value = {
            id         : $updated_session.id
            status     : $updated_session.status
            started_at : $updated_session.started_at
            ended_at   : $updated_session.ended_at
            total_scans: $updated_session.total_scans
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
            source    : "end_session"
            session_id: $input.session_id
            user_id   : $input.user_id
            account_id: $session.account_id
          }
          }
        } as $log
      }
    
      catch {
        var.update $result {
          value = $result
            |set:"error":"Failed to end session"
        }
      
        function.run heartbeat_log {
          input = {
            level  : "error"
            message: {
            source    : "end_session"
            session_id: $input.session_id
            user_id   : $input.user_id
            error     : "Failed to end session"
          }
          }
        } as $log
      }
    }
  }

  response = $result
}