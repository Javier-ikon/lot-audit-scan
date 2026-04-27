// Stub: Planet X login adapter
// Replace with a real HTTP call when Planet X credentials and endpoint are available.
function planetx_login_stub {
  input {
    email? email
    text? username
    text? password
  }

  stack {
    var $result {
      value = {
        success      : true
        planetx_token: "px_stub_token"
        expires_in   : 3600
        user         : null
        error        : null
      }
    }
  }

  response = $result
}