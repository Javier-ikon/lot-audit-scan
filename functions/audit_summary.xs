// Returns summary for an audit session
function audit_summary {
  input {
    int session_id
    int user_id
    int include_scans?=1
  }

  stack {
    var $result {
      value = {success: false, summary: null, error: null}
    }
  
    try_catch {
      try {
        // Get user context for multi-tenant security
        function.run get_user_context {
          input = {user_id: $input.user_id}
        } as $user_context
      
        // Check if user exists
        conditional {
          if ($user_context.success == false) {
            var.update $result {
              value = $result|set:"error":"User not found"
            }
          
            return {
              value = $result
            }
          }
        }
      
        // Fetch the session
        db.get audit_session {
          field_name = "id"
          field_value = $input.session_id
        } as $session
      
        conditional {
          if ($session == null) {
            var.update $result {
              value = $result|set:"error":"Session not found"
            }
          
            return {
              value = $result
            }
          }
        }
      
        // Verify session belongs to user's account (multi-tenant security)
        conditional {
          if ($session.account_id != $user_context.user.account_id) {
            var.update $result {
              value = $result
                |set:"error":"Unauthorized: Session belongs to another account"
            }
          
            return {
              value = $result
            }
          }
        }
      
        // Get rooftop information
        db.get rooftop {
          field_name = "id"
          field_value = $session.rooftop_id
        } as $rooftop
      
        // Count total scans for this session
        db.query scan {
          where = $db.scan.audit_session_id == $input.session_id && $db.scan.account_id == $user_context.user.account_id
          return = {type: "count"}
        } as $total_scans
      
        // Count exceptions for this session
        db.query scan {
          where = $db.scan.audit_session_id == $input.session_id && $db.scan.account_id == $user_context.user.account_id && $db.scan.is_exception == true
          return = {type: "count"}
        } as $total_exceptions
      
        // Calculate passes
        var $total_passes {
          value = ($total_scans - $total_exceptions)
        }
      
        // Build summary object
        var $summary {
          value = {
            session_id      : $session.id
            account_id      : $session.account_id
            rooftop_id      : $session.rooftop_id
            rooftop_name    : $rooftop.name
            status          : $session.status
            started_at      : $session.started_at
            ended_at        : $session.ended_at
            total_scans     : $total_scans
            total_exceptions: $total_exceptions
            total_passes    : $total_passes
            scans           : []
          }
        }
      
        // Optionally fetch scan list
        conditional {
          if ($input.include_scans == 1) {
            db.query scan {
              where = $db.scan.audit_session_id == $input.session_id && $db.scan.account_id == $user_context.user.account_id
              return = {type: "list"}
            } as $scan_list
          
            var.update $summary {
              value = $summary|set:"scans":$scan_list
            }
          }
        }
      
        var.update $result {
          value = $result
            |set:"success":true
            |set:"summary":$summary
        }
      }
    
      catch {
        var.update $result {
          value = $result
            |set:"error":"An unexpected error occurred"
        }
      
        function.run heartbeat_log {
          input = {
            level  : "error"
            message: {
            source    : "audit_summary"
            session_id: $input.session_id
            user_id   : $input.user_id
            error     : "Unexpected error in audit_summary"
          }
          }
        } as $log
      }
    }
  }

  response = $result
}