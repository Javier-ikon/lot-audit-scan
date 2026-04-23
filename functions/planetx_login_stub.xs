// Stub: Planet X login adapter
// Simulates a successful Planet X authentication and returns a fake token.
// Replace with a real HTTP call when Planet X credentials and endpoint are available.
function planetx_login_stub {
  input {
    email? email
    text? username
    text? password
  }

  stack {
    // For stub purposes, treat any non-empty password as valid
    var $success {
      value = ($input.password != null && $input.password != "")
    }

    conditional {
      if ($success == false) {
        return {
          value = { success: false, error: "Invalid Planet X credentials" }
        }
      }
    }

    // Return a deterministic stub token
    var $px_token {
      value = "px_stub_token"
    }

    response = {
      success      : true,
      planetx_token: $px_token,
      expires_in   : 3600,
      user         : {
        username: $input.username |first_notnull:$input.email
      }
    }
  }
}
