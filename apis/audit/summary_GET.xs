// Get summary for an audit session
query "audit/summary" verb=GET {
  api_group = "audit"
  auth = "user"

  input {
    int session_id
    int include_scans?=1
  }

  stack {
    // Call audit_summary function with auth user ID
    function.run audit_summary {
      input = {
        session_id   : $input.session_id
        user_id      : $auth.id
        include_scans: $input.include_scans
      }
    } as $result
  
    // Check if summary retrieval was successful
    conditional {
      if ($result.success == false) {
        throw {
          name = "SummaryError"
          value = $result.error
            |first_notnull:"Failed to get summary"
        }
      }
    }
  }

  response = $result
}