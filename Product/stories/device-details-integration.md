# Epic: Device Details Integration — Planet X Live Data in Scan Result

**Initiative:** Ikon Lot Scan (Lot Audit)
**Branch:** `feature/demo-mvp`
**Status:** In Progress — SCAN-01 through SCAN-04 complete, SCAN-05 through SCAN-08 pending
**Created:** 2026-04-26
**Owner:** TBD

---

## Epic Summary

The `GET /api:0A4QTFvS/device-details` endpoint is live in Xano and calls the Planet X QA API (`https://myportalqa.ikongps.com/quality-control/devices`) using the `$env.planetxDevice` token. The `scan_vin` function currently records a VIN scan to the DB but does **not** call this endpoint — meaning `ScanResultScreen` receives no device data.

This epic wires the device-details endpoint into the scan flow so that after a VIN is scanned, the UI displays 6 real data points from Planet X.

---

## 6 Data Points for Demo UI

Sourced from `result.data[0]` in the Planet X response:

| # | UI Label | Planet X Field |
|---|----------|---------------|
| 1 | VIN | `vin` |
| 2 | Serial / IMEI | `gps_unit.imei` (fallback: `gps_unit.serial`) |
| 3 | Company | `company.name` |
| 4 | Group | `group.name` |
| 5 | Last Report | `lastReported` |
| 6 | Device Status | `device_status.name` (e.g. "Periodic Reset") |

---

## Stories

---

### SCAN-01 — Wire `scan_vin` to call `device-details` after recording the scan

**Status:** ✅ Done
**Owner:** TBD

#### Context
`functions/9_scan_vin.xs` records the scan to the DB and returns `{ id, vin, scan_method, scanned_at }`. It needs to call the `ikon/device-details` endpoint after the DB write and include the Planet X response in its return payload.

#### Acceptance Criteria
- After a scan is recorded, `scan_vin` calls `GET /api:0A4QTFvS/device-details?vin=<VIN>` using the authenticated user's token
- If Planet X returns data, the response includes the device details nested under `scan.device`
- If Planet X returns no data or errors, the scan is still recorded and `scan.device` is `null` (non-blocking)

---

### SCAN-02 — Normalize Planet X response into 6 display fields in `scan_vin`

**Status:** ✅ Done
**Owner:** TBD

#### Context
The raw Planet X response is nested (`result.data[0].gps_unit.imei`, etc.). Xano should normalize this into flat fields before returning to the frontend.

#### Acceptance Criteria
- `scan_vin` response includes a normalized `device` object:
```json
{
  "vin": "JM3KFABMXJ1474621",
  "serial": "355758640971473",
  "company": "Francisco Quintano Lopez",
  "group": "Francisco Quintano Lopez",
  "last_report": "2022-08-21 14:41:57.000",
  "device_status": "Periodic Reset"
}
```
- `serial` falls back to `gps_unit.serial` if `gps_unit.imei` is null
- `device_status` falls back to `"Unknown"` if `device_status.name` is null

---

### SCAN-03 — Display 6 data points on `ScanResultScreen`

**Status:** ✅ Done
**Owner:** TBD

#### Context
`ScanResultScreen.tsx` already renders VIN, Serial, Company, and Last Report. It needs Group and Device Status added, and field mapping updated to match the normalized response from SCAN-02.

#### Acceptance Criteria
- Screen displays all 6 fields: VIN, Serial, Company, Group, Last Report, Device Status
- If `scan.device` is null, fields show `"—"` (already default behavior)
- Field mapping uses snake_case keys from normalized response (`serial`, `company`, `group`, `last_report`, `device_status`)

---

### SCAN-04 — Handle "device not found" case gracefully

**Status:** ✅ Done
**Owner:** TBD

#### Context
If a VIN is not in Planet X, the API returns an empty `data: []` array. The UI should communicate this clearly without blocking the scan.

#### Acceptance Criteria
- When Planet X returns empty data, `scan.device` is `null` and `scan.device_found` is `false`
- `ScanResultScreen` shows a "Device not found in Planet X" message below the VIN field
- Scan is still recorded and counts toward session total

---

### SCAN-05 — Persist Planet X device snapshot into the `scan` table row

**Status:** 📋 To Do
**Owner:** TBD

#### Context
`scan_vin.xs` fetches device data from Planet X and returns it to the frontend but never writes it back to the `scan` table. This means:
- The CSV report (`generate_csv_report.xs`) reads from `scan` and gets empty device columns
- Session summary (`audit_summary.xs`) cannot classify exceptions/passes without persisted device data
- Audit integrity is lost — there's no record of what the device looked like at time of scan

The `scan` table already has all the right columns for this data (no schema changes needed).

#### Flow
```
1. db.add scan { vin, session_id, ... }         ← create scan row
2. api.request → device-details (Planet X)      ← fetch device data
3. db.edit scan { id: $scan.id,                 ← update same row with device snapshot
     imei, serial, company, group,
     last_report_date, activated_at,
     device_data (raw JSON),
     device_status (classified enum) }
4. Return enriched scan to frontend
```

#### Acceptance Criteria
- After a successful Planet X fetch, `scan_vin` calls `db.edit scan` to update the scan row with:
  - `imei` ← `gps_unit.imei`
  - `serial` ← `gps_unit.serial`
  - `company` ← `company.name`
  - `group` ← `group.name`
  - `last_report_date` ← `lastReported`
  - `activated_at` ← `gps_unit.firstReportDate`
  - `device_data` ← full raw Planet X JSON snapshot
- If Planet X returns no data, the scan row is left with null device fields (non-blocking)
- Querying the `scan` table directly shows device fields populated after a successful scan

#### Files to update
- `functions/9_scan_vin.xs` — add `db.edit scan` step after Planet X fetch

---

---

### SCAN-06 — Add `is_deleted` soft-delete flag to the `scan` table

**Status:** 📋 To Do
**Owner:** TBD

#### Context
The `scan` table has no way to mark a record as deleted without destroying it. To support the delete + rescan flow and maintain a full audit trail, a soft-delete field is needed. Physically deleting rows would lose the audit history and break the duplicate VIN check logic.

#### Acceptance Criteria
- `is_deleted` boolean field (default `false`) added to `tables/7_scan.xs`
- A `btree` index added on `is_deleted` for query performance
- Existing rows are unaffected (default `false`)
- The CSV report and session summary exclude rows where `is_deleted = true`

#### Files to update
- `tables/7_scan.xs` — add `is_deleted` field and index

---

### SCAN-07 — Block duplicate VIN scans within a session (active scans only)

**Status:** 📋 To Do
**Owner:** TBD

#### Context
Currently `scan_vin` has no duplicate check — an FSM can scan the same VIN multiple times in a session, inflating counts and corrupting the CSV report. The check must only consider **active** (non-deleted) scans so that re-scanning after a delete is still allowed.

#### Acceptance Criteria
- After session validation and before `db.add scan`, `scan_vin` checks for an existing active scan with the same `audit_session_id` + `vin` + `is_deleted = false`
- If a duplicate is found, the function returns early with `{ success: false, error: "VIN already scanned in this session" }` — no Planet X call, no DB write
- If no duplicate is found, the scan proceeds normally
- A soft-deleted scan for the same VIN does **not** trigger the duplicate error (re-scan is allowed)

#### Flow
```
1. Validate VIN format
2. Validate session exists + is active
3. db.has scan WHERE audit_session_id = session_id
                 AND vin = vin
                 AND is_deleted = false       ← NEW CHECK
4. If exists → return error, stop
5. db.add scan → Planet X → db.edit scan → return
```

#### Files to update
- `functions/9_scan_vin.xs` — add duplicate check step

---

### SCAN-08 — Wire delete scan button to soft-delete API

**Status:** 📋 To Do
**Owner:** TBD

#### Context
The `ScanResultScreen` already has a "Delete scan" button but it only removes the scan from the local count — nothing is written to Xano. After this story, the delete button calls a real API that soft-deletes the scan row (`is_deleted = true`), enabling the FSM to re-scan the same VIN within the session.

#### Acceptance Criteria
- A new `DELETE /audit/delete-scan` endpoint (or `POST` with `scan_id`) sets `is_deleted = true` on the scan row
- The delete button in `ScanResultScreen` calls this endpoint before navigating back to `ScanningScreen`
- If the API call fails, an error alert is shown and navigation is blocked
- After deletion, the FSM can scan the same VIN again and it records successfully
- Soft-deleted rows are excluded from `total_scans` in the session summary

#### UI behaviour
- Delete button shows a loading state while the API call is in flight
- On success → navigate to `ScanningScreen` with `scanCount - 1`
- On failure → show alert "Failed to delete scan. Please try again."

#### Files to update
- `apis/audit/` — new `delete_scan_POST.xs` endpoint
- `functions/` — new `delete_scan.xs` function (sets `is_deleted = true`)
- `prototype/src/screens/ScanResultScreen.tsx` — wire delete button to API

---

## Dependencies

- `apis/ikon/27_device_details_GET.xs` — live ✅
- `$env.planetxDevice` token set in Xano environment — confirm before testing
- `functions/9_scan_vin.xs` — SCAN-01, SCAN-02 ✅ — SCAN-05, SCAN-07 pending
- `prototype/src/screens/ScanResultScreen.tsx` — SCAN-03 ✅ — SCAN-08 pending
- `tables/7_scan.xs` — SCAN-06 pending

## Out of Scope (defer to Phase 2)

- Per-user Planet X token (currently uses shared env token)
- Telemetry history or trend data
- Device status enum classification (installed, not_reporting, etc.)
