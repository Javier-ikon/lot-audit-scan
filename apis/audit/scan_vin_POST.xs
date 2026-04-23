// Record a VIN scan during an audit session
query "audit/scan-vin" verb=POST {
  api_group = "audit"
  auth = "user"

  input {
    int session_id
    text vin filters=trim|upper
    enum scan_method?=barcode {
      values = ["barcode", "qr_code", "manual"]
    }
  
    json scan_metadata?
  }

  stack {
    // Call scan_vin function with auth user ID
    function.run scan_vin {
      input = {
        session_id   : $input.session_id
        vin          : $input.vin
        scan_method  : $input.scan_method
        scan_metadata: $input.scan_metadata
      }
    } as $result
  
    // Check if scan was successful
    conditional {
      if ($result.success == false) {
        throw {
          name = "ScanError"
          value = $result.error
            |first_notnull:"Failed to scan VIN"
        }
      }
    }
  }

  response = $result
}