// End an active audit session
query "audit/end-session" verb=POST {
  api_group = "audit"
  auth = "user"

  input {
    int session_id
    text notes? filters=trim
  }

  stack {
    // Call end_session function with auth user ID
    function.run end_session {
      input = {
        session_id: $input.session_id
        user_id   : $auth.id
        notes     : $input.notes
      }
    } as $result
  
    // Check if ending session was successful
    conditional {
      if ($result.success == false) {
        throw {
          name = "SessionError"
          value = $result.error
            |first_notnull:"Failed to end session"
        }
      }
    }
  }

  response = $result
}