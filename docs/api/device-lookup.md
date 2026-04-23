# Device Details Lookup API (QA)

This document captures the QA endpoint, request, and response sample for fetching device details by VIN(s).

## Endpoint
- URL: https://myportalqa.ikongps.com/quality-control/devices
- Method: POST
- Content-Type: application/json

## Minimal cURL example
```bash
curl -X POST \
  'https://myportalqa.ikongps.com/quality-control/devices' \
  -H 'Content-Type: application/json' \
  -d '{
    "token": "g%Lz2/#6k9)p",
    "vins": ["2T3W1RFV3NW216717"]
  }'
```

## Request (sample as provided)
```json
{
  "url": "https://myportalqa.ikongps.com/quality-control/devices",
  "method": "POST",
  "headers": [
    "POST /quality-control/devices HTTP/2",
    "Host: myportalqa.ikongps.com",
    "Accept-Encoding: gzip, deflate",
    "Content-Type: application/json",
    "Accept: application/json"
  ],
  "params": {
    "token": "g%Lz2/#6k9)p",
    "vins": [
      "2T3W1RFV3NW216717",
      "JM3KFABMXJ1474621",
      "4T1G11AK5LU341548",
      "5YFEPMAE4NP354474",
      "4T1T11AK3PU081946"
    ]
  }
}
```

## Response (trimmed sample)
```json
{
  "status": 200,
  "headers": ["content-type: application/json", "server: nginx/1.23.1"],
  "result": {
    "meta": {"env": "local", "build": "test"},
    "data": [
      {
        "vin": "JM3KFABMXJ1474621",
        "yearMakeModel": "2018, MAZDA, CX-5",
        "lastReported": "2022-08-21 14:41:57.000",
        "company": {"id": "1102129575", "name": "Francisco Quintano Lopez"},
        "group": {"id": "1102129923", "name": "Francisco Quintano Lopez"},
        "gps_unit": {
          "status": "ACTIVE",
          "imei": "355758640971473",
          "serial": "355758640971473",
          "firstReportDate": "2022-08-18 12:43:35.000"
        },
        "device_status": {"name": "Periodic Reset", "code": "ATLTE10032"},
        "device_detail": {"stockNumber": "474621T", "vehicleMileage": "46899"}
      }
    ]
  }
}
```

## UI field mapping (proposed)
- Serial/IMEI: `result.data[].gps_unit.imei` (fallback: `gps_unit.serial`)
- Activated: `result.data[].gps_unit.firstReportDate`
- LastReport: `result.data[].lastReported`
- Company: `result.data[].company.name`
- Group: `result.data[].group.name`
- Notes: `result.data[].comments` (if present)
- Status: derive from presence of data or `device_status.code`/`name` (or flag missing)

## Notes
- Endpoint accepts a batch of VINs via `vins: string[]`.
- Token shown here is QA-only; do not use in production. Consider moving to env/secret storage.
- Typical usage in prototype: submit VIN from Scanning screen, map fields into Scan Result UI, handle timeouts/errors gracefully.

