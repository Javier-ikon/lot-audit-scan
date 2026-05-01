// Start a new audit session for the authenticated user
query "audit/start-session" verb=POST {
  api_group = "audit"
  auth = "user"

  input {
    int rooftop_id
    int dealer_group_id?
    json session_metadata?
  }

  stack {
    // Call start_session function with auth user ID
    function.run start_session {
      input = {
        user_id         : $auth.id
        rooftop_id      : $input.rooftop_id
        dealer_group_id : $input.dealer_group_id
        session_metadata: $input.session_metadata
      }
    } as $result
  
    // Check if session creation was successful
    conditional {
      if ($result.success == false) {
        throw {
          name = "SessionError"
          value = $result.error
            |first_notnull:"Failed to start session"
        }
      }
    }
  }

  response = $result
  guid = "K2oWc_yT4VL81r4c8kUiyTJVH9c"
}