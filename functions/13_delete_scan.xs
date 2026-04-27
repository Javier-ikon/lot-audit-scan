// Soft-deletes a scan record by setting is_deleted = true
// Allows the same VIN to be re-scanned in the session
function delete_scan {
  input {
    int scan_id
    int user_id
  }

  stack {
    var $result {
      value = {success: false, error: null}
    }

    try_catch {
      try {
        // Fetch the scan record
        db.get scan {
          field_name  = "id"
          field_value = $input.scan_id
        } as $scan

        // Verify scan exists
        conditional {
          if ($scan == null) {
            var.update $result {
              value = $result|set:"error":"Scan not found"
            }

            return {
              value = $result
            }
          }
        }

        // Verify scan belongs to the requesting user
        conditional {
          if ($scan.account_id != $input.user_id) {
            var.update $result {
              value = $result|set:"error":"Unauthorized"
            }

            return {
              value = $result
            }
          }
        }

        // Verify not already deleted
        conditional {
          if ($scan.is_deleted == true) {
            var.update $result {
              value = $result|set:"error":"Scan already deleted"
            }

            return {
              value = $result
            }
          }
        }

        // Soft delete — set is_deleted = true
        db.edit scan {
          field_name  = "id"
          field_value = $input.scan_id
          data = {is_deleted: true}
        } as $deleted_scan

        var.update $result {
          value = $result
            |set:"success":true
            |set:"scan_id":$input.scan_id
        }
      }

      catch {
        var.update $result {
          value = $result|set:"error":"Failed to delete scan"
        }
      }
    }
  }

  response = $result
  guid = "7KlKu3mXeY7Z24Hqf2HxydScgRM"
}
