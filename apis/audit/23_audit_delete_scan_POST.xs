// Soft-delete a scan record — sets is_deleted = true, allowing the same VIN to be re-scanned
query "audit/delete-scan" verb=POST {
  api_group = "audit"
  auth = "user"

  input {
    int scan_id
  }

  stack {
    function.run delete_scan {
      input = {
        scan_id: $input.scan_id
        user_id: $auth.id
      }
    } as $result

    conditional {
      if ($result.success == false) {
        throw {
          name  = "DeleteScanError"
          value = $result.error|first_notnull:"Failed to delete scan"
        }
      }
    }
  }

  response = $result
  guid = "1frEjcePLllClNvFNQy_1yykO4I"
}
