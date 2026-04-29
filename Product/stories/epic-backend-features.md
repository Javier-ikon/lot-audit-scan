## Epic E6 — Backend Features for Full UX Parity

Context
- Epics E1–E5 define the UX experience approved in the mockup suite (prototype/mockup/).
- Epic E6 captures the backend work required to make the production app match that experience end-to-end.
- These stories are pre-requisites before the production screens can show real data instead of placeholder/zeroed values.

---

### E6-01 — VIN Decode: Make / Model / Year

**Goal:** Return vehicle Make, Model, and Year in the scan-vin API response so the Session Complete screen can display a human-readable vehicle row instead of a bare VIN.

**Current state:** `POST /audit/scan-vin` returns telemetry status fields but no vehicle descriptor data.

**Required change (Xano):**
- Call a VIN decode service (e.g., NHTSA vPIC or equivalent) during or after the scan-vin flow.
- Append `make`, `model`, `year` fields to the scan record in the `audit_scans` table.
- Return those fields in the scan-vin API response body.

Acceptance Criteria:
- `POST /audit/scan-vin` response includes `make` (string), `model` (string), `year` (integer or string).
- Fields are persisted to the scan record.
- If decode fails, fields are `null` — the app must handle gracefully (fallback to VIN only).
- Response latency does not increase by more than 500 ms at p95.

---

### E6-02 — Session Summary Stats Endpoint

**Goal:** Provide a summary of a completed session (total scanned, pass count, exception count) so the End Audit Confirm and Session Complete screens can display real stats.

**Current state:** No endpoint exists that returns aggregate counts for a session.

**Required change (Xano):**
- Create or extend `GET /audit/session-summary?session_id={id}` to return:
  - `total_scanned` (int)
  - `pass_count` (int)
  - `exception_count` (int)
  - `rooftop_name` (string, resolved from Planet X rooftop ID)
  - `started_at` (ISO timestamp)

Acceptance Criteria:
- Returns correct counts that match the individual scan records for the session.
- `rooftop_name` is a human-readable string, not a raw ID.
- Endpoint is auth-protected (Bearer token required).
- End Audit Confirm screen uses this to populate the 3-stat summary card with real data.

---

### E6-03 — Session Scan List Endpoint

**Goal:** Provide the ordered list of scans in a completed session so the Session Complete screen can render the filterable vehicle list.

**Current state:** No endpoint returns the scan list for a completed session.

**Required change (Xano):**
- Create `GET /audit/session-scans?session_id={id}` returning an array of scan records:
  - `vin` (string)
  - `status` (`pass` | `exception`)
  - `exception_type` (string | null)
  - `make`, `model`, `year` (strings — see E6-01)
  - `scanned_at` (ISO timestamp)

Acceptance Criteria:
- Returns all scans for the specified session ordered by `scanned_at` ascending.
- `status` values are normalized to `pass` or `exception` (never raw Planet X codes).
- `exception_type` is a human-readable label (e.g., "Not Reporting", "Wrong Dealer").
- Empty array returned (not an error) when session has no scans.
- Endpoint is auth-protected.

---

### E6-04 — Resume Session: Include Exception Count in Open-Session Response

**Goal:** Return exception_count in the open-session detection response so the Resume Session screen can display the full pass/exception breakdown, not just a total scan count.

**Current state:** The open-session check returns `scan_count` only.

**Required change (Xano):**
- Extend the open-session detection response to include `exception_count` (int).
- `pass_count` can be derived client-side as `scan_count - exception_count`.

Acceptance Criteria:
- Open-session API response includes `exception_count`.
- `exception_count` is accurate (matches persisted scan records).
- Resume Session screen uses this to display the 3-stat breakdown (Scanned / Pass / Exceptions).

---

### E6-05 — Rooftop Name Resolution

**Goal:** Return rooftop display name alongside rooftop_id so all screens can show "Friendly Chevrolet – Dallas" instead of a raw numeric ID.

**Current state:** Rooftop ID is stored but its name is not returned in any session API response.

**Required change (Xano):**
- Add `rooftop_name` to all session-related API responses (session create, open-session check, session summary, session scans).
- Resolve the name via Planet X rooftop data at session creation time and persist it to the session record.

Acceptance Criteria:
- `rooftop_name` is present in: session create response, open-session response, session-summary response.
- If resolution fails at session creation, persist the raw ID and log a warning.
- Resume Session, End Audit Confirm, and Session Complete screens all display the resolved name.
