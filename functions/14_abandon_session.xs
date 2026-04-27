// Marks an in_progress session as abandoned
// Used when FSM starts a new audit over an existing open session
function abandon_session {
  input {
    int session_id
    int user_id
  }

  stack {
    var $result {
      value = {success: false, error: null}
    }

    try_catch {
      try {
        // Fetch the session
        db.get audit_session {
          field_name  = "id"
          field_value = $input.session_id
        } as $session

        // Verify session exists
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

        // Verify ownership
        conditional {
          if ($session.user_id != $input.user_id) {
            var.update $result {
              value = $result|set:"error":"Unauthorized"
            }

            return {
              value = $result
            }
          }
        }

        // Only abandon in_progress sessions
        conditional {
          if ($session.status != "in_progress") {
            var.update $result {
              value = $result|set:"error":"Session is not in progress"
            }

            return {
              value = $result
            }
          }
        }

        // Mark session as abandoned
        db.edit audit_session {
          field_name  = "id"
          field_value = $input.session_id
          data = {
            status  : "abandoned"
            ended_at: now
          }
        } as $updated_session

        var.update $result {
          value = $result
            |set:"success":true
            |set:"session_id":$input.session_id
        }
      }

      catch {
        var.update $result {
          value = $result|set:"error":"Failed to abandon session"
        }
      }
    }
  }

  response = $result
  guid = "lb29GF_GYzXk7_Jz0TvjwD8EbdM"
}
