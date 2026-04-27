// Marks an in_progress session as abandoned
// Called when FSM chooses to start fresh over an existing open session
query "audit/abandon-session" verb=POST {
  api_group = "audit"
  auth = "user"

  input {
    int session_id
  }

  stack {
    function.run abandon_session {
      input = {
        session_id: $input.session_id
        user_id   : $auth.id
      }
    } as $result

    conditional {
      if ($result.success == false) {
        throw {
          name  = "AbandonSessionError"
          value = $result.error|first_notnull:"Failed to abandon session"
        }
      }
    }
  }

  response = $result
  guid = "IAV_lq_cXlmEMtFPvtWZK2G1b9A"
}
