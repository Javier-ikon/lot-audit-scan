// Stubbed Login endpoint that proxies to Planet X (stub) and creates a Xano auth token
query "auth/login" verb=POST {
  api_group = "auth"

  input {
    email? email filters=trim|lower
    text? username filters=trim|lower
    text? password
  }

  stack {
    var $result {
      value = { success: false, token: null, user: null, planetx: null, error: null }
    }

    // Require an identifier
    var $login_id {
      value = $input.email |first_notnull:$input.username
    }

    precondition ($login_id != null) {
      error_type = "accessdenied"
      error = "Email or username is required."
    }

    // Call Planet X login stub (replace with real adapter later)
    function.run planetx_login_stub {
      input = {
        email   : $login_id
        username: $login_id
        password: $input.password
      }
    } as $px

    conditional {
      if ($px.success == false) {
        throw {
          name = "AuthError"
          value = $px.error |first_notnull:"Invalid credentials"
        }
      }
    }

    // Find or create a local user by email/username for token issuance
    db.get user {
      field_name = "email"
      field_value = $login_id
      output = ["id", "email", "name", "account_id"]
    } as $existing

    // Ensure a user exists to bind the auth token
    conditional {
      if ($existing == null) {
        db.add user {
          data = {
            email: $login_id
            name : $login_id
            role : "fsm"
          }
        } as $new_user

        var $user { value = $new_user }
      }
    }

    // If user existed, bind it; else use the newly created one
    conditional {
      if (typeof($user) == "undefined") {
        var $user { value = $existing }
      }
    }

    // Create a Xano auth token for the user
    security.create_auth_token {
      table      = "user"
      id         = $user.id
      expiration = 86400
    } as $authToken

    var.update $result {
      value = $result
        |set:"success":true
        |set:"token":$authToken
        |set:"user":{id:$user.id, email:$user.email, name:$user.name}
        |set:"planetx":{ token:$px.planetx_token, expires_in:$px.expires_in }
    }
  }

  response = $result
}
