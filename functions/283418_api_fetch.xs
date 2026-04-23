// Return only the requested fields
function apiFetch {
  input {
    // Array of VIN strings to look up
    json vins
  }

  stack {
    api.request {
      url = "https://myportalqa.ikongps.com/quality-control/devices"
      method = "POST"
      params = {}
        |set:"token":"g%Lz2/#6k9)p"
        |set:"vins":($input.vins|first_notnull:[])
      headers = []
        |push:"Content-Type: application/json"
    } as $api1
  
    // Build a trimmed result: only lastReported, vin, latitude, longitude, location
    var $rows {
      value = []
    }
  
    // Safely handle when the external API returns no data
    var $data {
      value = $api1.response.result.data|first_notnull:[]
    }
  
    foreach ($data) {
      each as $d {
        var.update $rows {
          value = $rows
            |push:({}
              |set:"vin":$d.vin
              |set:"lastReported":$d.lastReported
              |set:"latitude":$d.latitude
              |set:"longitude":$d.longitude
              |set:"location":$d.location
            )
        }
      }
    }
  }

  response = {rows: $rows}
}