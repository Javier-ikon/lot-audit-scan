// retrieves device telemetry details from vin parameter 
query "device-details" verb=GET {
  api_group = "ikon"
  auth = "user"

  input {
    text vin? filters=trim
  }

  stack {
    api.request {
      url = "https://myportalqa.ikongps.com/quality-control/devices"
      method = "POST"
      params = {}
        |set:"token":$env.planetxDevice
        |set:"vins":([]|push:$input.vin)
      headers = []
        |push:"Content-Type: application/json"
    } as $deviceDetails
  }

  response = $deviceDetails
}