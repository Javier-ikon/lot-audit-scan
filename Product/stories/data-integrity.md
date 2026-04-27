# Epic: Data Integrity — Scan & Session Field Accuracy

**Initiative:** Ikon Lot Scan (Lot Audit)
**Branch:** `feature/demo-mvp`
**Status:** 📋 To Do
**Created:** 2026-04-27
**Owner:** TBD

---

## Epic Summary

A review of the `scan` and `audit_session` tables against the current `scan_vin`, `end_session`, and `abandon_session` functions revealed several fields that are defined in the schema but never written to at runtime. This means real session and scan records in Xano have `null` in fields that drive reporting, multi-tenant filtering, and exception classification.

There are also two unresolved git merge conflicts — in `functions/9_scan_vin.xs` and `tables/7_scan.xs` — that are blocking all future pushes until resolved.

This epic covers:
1. **Conflict resolution** — unblock the CLI push pipeline
2. **Session counters** — write `total_scans`, `total_exceptions`, `total_passes` on each scan
3. **Multi-tenant isolation** — populate `dealer_group_id` on scan and session rows
4. **Device classification** — write `device_status` enum and `is_exception` flag from Planet X data
5. **IMEI/serial consistency** — align the DB snapshot with the normalized frontend display value
6. **Schema housekeeping** — remove dead enum values, document deprecation path

---

## Stories

---

### DINT-01 — Resolve merge conflicts in `scan_vin.xs` and `scan.xs`

**Status:** 📋 To Do
**Owner:** TBD
**Priority:** 🚨 Blocker — must be done before any other story

#### Context
Two files contain unresolved git conflict markers (`<<<<<<<` / `=======` / `>>>>>>>`), which causes `xano workspace push` to fail with a parse error. No other story in this epic can be pushed until these are resolved.

- `functions/9_scan_vin.xs` lines 143–184: duplicate VIN check duplicated on both sides — keep the `<<<<<<<` (current) version which includes the `description` field and explicit `== true` comparison.
- `tables/7_scan.xs` lines 101–111: `is_deleted` field — keep `bool is_deleted?=false` (current version with default). The incoming `bool is_deleted?` has no default, which causes existing rows to have `null` instead of `false`, breaking the duplicate VIN check.

#### Acceptance Criteria
- Both files parse cleanly with no conflict markers
- `xano workspace push` completes successfully
- `is_deleted` defaults to `false` on all new and existing scan rows

#### Files to update
- `functions/9_scan_vin.xs` — remove conflict markers, keep current version
- `tables/7_scan.xs` — remove conflict markers, keep `bool is_deleted?=false`

---

### DINT-02 — Populate `dealer_group_id` on new scan rows

**Status:** 📋 To Do
**Owner:** TBD
**Priority:** 🔴 Critical

#### Context
`scan_vin` fetches the parent `audit_session` before creating a scan record but only writes `account_id` to the new row. `dealer_group_id` — marked as CRITICAL for multi-tenant isolation in the schema — is never populated. Every scan row in the DB currently has `dealer_group_id = null`.

#### Acceptance Criteria
- `scan_vin` passes `dealer_group_id: $session.dealer_group_id` in the `db.add scan` data block
- New scan rows have `dealer_group_id` matching their parent session's value
- Rows where the session has no `dealer_group_id` (legacy) remain `null` — no backfill required for MVP

#### Files to update
- `functions/9_scan_vin.xs` — add `dealer_group_id` to `db.add scan` data block

---

### DINT-03 — Increment `total_scans` on `audit_session` after each scan

**Status:** 📋 To Do
**Owner:** TBD
**Priority:** 🔴 Critical

#### Context
`audit_session` has `total_scans`, `total_exceptions`, and `total_passes` counter fields that are never written. Session summary, CSV report, and the `SessionCompleteScreen` all rely on these values. Every session in the DB currently has `null` here.

`total_scans` should be incremented after every successful `db.add scan`. `total_exceptions` and `total_passes` will be updated in DINT-04 once `is_exception` is being set.

#### Acceptance Criteria
- After a successful `db.add scan`, `scan_vin` calls `db.edit audit_session` to increment `total_scans` by 1
- Increment is applied only on success — not inside the catch block
- Soft-deleted scans are not counted (deletion flow must decrement — tracked separately)
- `total_scans` on the session row reflects the real number of active scans after each successful scan

#### Files to update
- `functions/9_scan_vin.xs` — add `db.edit audit_session` increment after `db.add scan`

---

### DINT-04 — Classify `device_status` enum and `is_exception` flag from Planet X data

**Status:** 📋 To Do
**Owner:** TBD
**Priority:** 🟡 Medium

#### Context
`scan_vin` receives the Planet X device status as a raw text string (e.g., `"Periodic Reset"`) and stores it only in the normalized `$device` object returned to the frontend. The `scan.device_status` enum and `scan.is_exception` boolean — which drive exception reporting and CSV classification — are never written to the DB.

The `scan.device_status` enum has 7 values: `installed`, `not_installed`, `wrong_dealer`, `not_reporting`, `customer_linked`, `customer_registered`, `missing_device`. The mapping from Planet X's raw text to these enum values needs to be defined (see `product/stories/device-details-integration.md` for classification rules reference).

#### Acceptance Criteria
- After the Planet X fetch, `scan_vin` maps the raw `device_status.name` to the closest enum value
- `device_status` is written to the scan row in the existing `db.edit scan` block
- `is_exception` is set to `true` when `device_status` is `not_installed`, `not_reporting`, `missing_device`, or `wrong_dealer`; `false` otherwise
- If Planet X returns no data (`$px_data == null`), both fields remain `null`
- `total_exceptions` and `total_passes` on the session are incremented correctly after `is_exception` is set

#### Files to update
- `functions/9_scan_vin.xs` — add status mapping logic and write `device_status` + `is_exception` in `db.edit scan`
- `functions/9_scan_vin.xs` — add `db.edit audit_session` to increment `total_exceptions` or `total_passes`

---

### DINT-05 — Align IMEI/serial DB snapshot with normalized frontend display value

**Status:** 📋 To Do
**Owner:** TBD
**Priority:** 🟡 Medium

#### Context
`scan_vin` currently writes the raw Planet X values to the DB (`imei: $px_data.gps_unit.imei`, `serial: $px_data.gps_unit.serial`) but the normalized `$device` object returned to the frontend applies a fallback: `serial: $px_data.gps_unit.imei|first_notnull:$px_data.gps_unit.serial`.

This means when `gps_unit.imei` is null, the frontend shows `serial` correctly (falling back to `gps_unit.serial`), but the DB row has `imei = null` and `serial = raw_serial`. The DB snapshot and the displayed value disagree — breaking any future report that reads directly from the `scan` table.

#### Acceptance Criteria
- `scan.imei` in the DB matches what is displayed as "Serial / IMEI" in the UI
- The fallback logic (`imei|first_notnull:serial`) is applied before writing to the DB, not only on the frontend
- `scan.serial` stores the raw `gps_unit.serial` value (backup reference)
- No change to the frontend display logic — only the DB write is updated

#### Files to update
- `functions/9_scan_vin.xs` — update `imei` field in `db.edit scan` to use `$px_data.gps_unit.imei|first_notnull:$px_data.gps_unit.serial`

---

### DINT-06 — Remove dead enum values from `audit_session.status`

**Status:** 📋 To Do
**Owner:** TBD
**Priority:** 🟢 Low

#### Context
The `audit_session.status` enum contains five values: `["in_progress", "completed", "cancelled", "error", "abandoned"]`. Of these, `cancelled` and `error` are never written by any function or API endpoint. Dead enum values create confusion for any developer or report querying by status and falsely imply those states are reachable.

#### Acceptance Criteria
- If `cancelled` and `error` have no rows in the DB, remove them from the enum
- If rows exist with those values (legacy data), retain the values and document that they are legacy-only with no write path
- No change to any function or API — read-only schema cleanup

#### Files to update
- `tables/6_audit_session.xs` — remove or annotate `cancelled` and `error` enum values

---

### DINT-07 — Document `account_id` deprecation timeline

**Status:** 📋 To Do
**Owner:** TBD
**Priority:** 🟢 Low

#### Context
Both `audit_session` and `scan` tables carry a `TODO: deprecate once APIs fully migrate to dealer_group_id` comment on `account_id`. With no timeline or Jira reference, this has drifted without action. As `dealer_group_id` becomes the primary multi-tenant key (DINT-02), a clear deprecation plan is needed to prevent dual-field confusion in queries and reports.

#### Acceptance Criteria
- A deprecation note is added to both tables specifying the target milestone for removal
- A Jira ticket is created to track the actual deprecation and backfill work
- No code changes required for this story — documentation and ticket only

#### Files to update
- `tables/6_audit_session.xs` — update `account_id` comment with milestone reference
- `tables/7_scan.xs` — update `account_id` comment with milestone reference

---

## Dependencies

- DINT-01 must be completed before any other story can be pushed
- DINT-02 and DINT-03 are independent of each other but both touch `scan_vin.xs` — implement in the same PR to reduce conflict risk
- DINT-04 depends on DINT-03 (`total_exceptions` / `total_passes` increment requires `is_exception` to be set first)
- DINT-05 is independent — touches only the `db.edit scan` block in `scan_vin.xs`
- DINT-06 and DINT-07 are housekeeping — can be done at any time

## Recommended Execution Order

1. **DINT-01** — resolve conflicts (unblocks push pipeline)
2. **DINT-02 + DINT-03** — dealer_group_id + total_scans (same file, same PR)
3. **DINT-05** — IMEI/serial alignment (small, low-risk)
4. **DINT-04** — device classification + exception counters (most complex)
5. **DINT-06 + DINT-07** — housekeeping (anytime)

## Out of Scope (defer to Phase 2)

- Backfilling `dealer_group_id` on existing historical rows
- Backfilling `total_scans` / `total_exceptions` / `total_passes` from existing scan records
- Decrementing `total_scans` when a scan is soft-deleted (tracked in SCAN-08)
- Full device status classification rules documentation

