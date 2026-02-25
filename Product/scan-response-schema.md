# Scan Response Schema

Technical specification for the scan API response. Referenced by PRD Section 15 (Data & Privacy).  
See [data-mapping.md](./data-mapping.md) for full field definitions.  
For the CSV report column spec (all 30 fields), see [csv-report-schema.md](./csv-report-schema.md).  
For status classification logic (how to derive status from response data), see [status-classification-rules.md](./status-classification-rules.md).

---

## Endpoint

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/scan` | Look up device/vehicle by VIN or serial; return scan result |

---

## Request

```json
{
  "vin": "KL79MMSP2TB120806"
}
```

Or by serial:

```json
{
  "serial": "016723002393428"
}
```

---

## Response (Required Fields Only)

```json
{
  "Serial": "016723002393428",
  "Activated": "2025-12-29 13:21:13.000",
  "Last Report Date": "2026-02-24 16:10:21.000",
  "Company": "Friendly Chevrolet",
  "Group": "Friendly Chevrolet",
  "Notes": ""
}
```

---

## Field Mapping (Required Fields)

| Label | Data Type | JSON Format | Web UI Format | Sample Value | Source Path |
|-------|-----------|-------------|---------------|--------------|-------------|
| Serial | string | `"016723002393428"` | Plain text | 016723002393428 | `tObjectData.cache_device_data.deviceID` or `device_id` |
| Activated | string (datetime) | `"2025-12-29T13:21:13.000Z"` or `"2025-12-29 13:21:13.000"` | M/D/YYYY HH:mm | 12/29/2025 13:21 | Device metadata API (not in telemetry) |
| Last Report Date | string (datetime) | `"2026-02-24T16:10:21.000Z"` or `"2026-02-24 16:10:21.000"` | M/D/YYYY HH:mm | 2026-02-24 16:10:21.000 | `data.gpsTime` |
| Company | string | `"Friendly Chevrolet"` | Plain text | Friendly Chevrolet | `data.location` (first segment) or `companyID` lookup |
| Group | string | `"Friendly Chevrolet"` | Plain text | Friendly Chevrolet | `tObjectData.cache_device_data.subfleetID` lookup |
| Notes | string | `""` or `"free text"` | Plain text / textarea | *(empty)* | Device metadata API (not in telemetry) |

---

## Source Payload Structure

Data is derived from the PlanetX/web UI payload. Key paths:

| Source Path | Description |
|-------------|-------------|
| `data.gpsTime` | Local time of last report |
| `data.location` | Last known address string |
| `data.BatteryVoltage` | Vehicle battery (append " VDC") |
| `data.IPPort` | IP port |
| `data.lat`, `data.long` | GPS coordinates |
| `data.odometer` | Odometer value |
| `tObjectData` (parsed) | JSON string; contains `cache_device_data`, `device_id`, `vin`, `gps_signal`, `subfleetID`, etc. |

---

## Notes

- **Date/time:** JSON may use ISO 8601 or `YYYY-MM-DD HH:mm:ss.fff`; Web UI displays as M/D/YYYY HH:mm.
- **Activated, Notes:** Not in telemetry payload; require device/vehicle metadata API.
- **Company, Group:** May be parsed from `location` or resolved via `companyID` / `subfleetID` lookup.

---

**Last updated:** 2026-02-25
