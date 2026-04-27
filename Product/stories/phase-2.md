# Epic: Phase 2 — Planet X Integration + Full Audit Flow

**Initiative:** Ikon Lot Scan (Lot Audit)
**Phase:** 2 of 2
**Status:** Blocked — awaiting Planet X API availability
**Created:** 2026-04-24
**Owner:** TBD

---

## Epic Summary

Phase 2 is triggered when Planet X provides their four API endpoints: Login, Dealer Groups, Rooftops, and Device Details by VIN. The Phase 1 local auth and placeholder rooftop are retired and replaced with live Planet X identity and tenant data. The core audit flow (scan, end session, CSV) is unchanged — only the identity layer, tenant selection, and device data display are upgraded.

At the end of Phase 2:
- FSMs log in with their existing Planet X credentials
- They select their real dealer group and rooftop before starting a session
- VIN scans return live device data (Serial, Last Report Date, Company, Group)
- CSV reports have all 30 columns populated with real data
- All Phase 1 session and scan data is backfilled with correct tenant identifiers

---

## Trigger Conditions (all must be true before Phase 2 begins)

- [ ] Planet X has provided a confirmed login API endpoint and contract
- [ ] Planet X has provided a confirmed dealer groups API endpoint
- [ ] Planet X has provided a confirmed rooftops API endpoint
- [ ] All Phase 1 Definition of Done items are checked off
- [ ] Open questions from `planetx-api.md` are resolved (stable IDs vs. names, rate limits)

---

## Scope

### In Scope
- Planet X login passthrough (replace `planetx_login_stub`)
- Dealer group selection from live Planet X API
- Rooftop selection from live Planet X API
- User-authenticated Planet X token used for VIN device lookups
- `ScanResultScreen` displays live device data
- Full 30-column CSV with device data columns populated
- Data backfill: existing Phase 1 sessions and scans updated with real `dealer_group_id` and `rooftop_id`
- Schema enforcement: make `dealer_group_id` required after backfill

### Out of Scope
- Serial number lookup (VIN-only in Phase 2; serial is a future enhancement)
- User management / provisioning via Planet X
- Multi-user session sharing
- Push notifications or background session monitoring

---

## Stories

| # | Title | Layer | Priority |
|---|---|---|---|
| P2-1 | Data backfill — update Phase 1 sessions and scans with real tenant IDs | Backend/DB | P0 — Run before full cutover |
| P2-2 | Planet X login passthrough — retire local auth | Backend + Frontend | P0 |
| P2-3 | Dealer group selection from live Planet X API | Backend + Frontend | P0 |
| P2-4 | Rooftop selection from live Planet X API | Backend + Frontend | P0 |
| P2-5 | VIN scan returns live device data via user Planet X token | Backend + Frontend | P1 |
| P2-6 | Full 30-column CSV with device data populated | Backend | P1 |
| P2-7 | Schema enforcement — make dealer_group_id required | Backend/DB | P2 — After backfill confirmed |

---

# Story P2-1

## Story Header

**Title:** Data backfill — update Phase 1 sessions and scans with real tenant IDs
**Initiative/PRD:** Ikon Lot Scan — Phase 2
**Status:** Blocked — awaiting Planet X APIs
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**Why first:** All Phase 1 sessions were created with `rooftop_id=1` (placeholder) and `dealer_group_id=null`. Before the app can display accurate tenant context and before CSV reports are tenant-filtered correctly, those records need to be updated with real IDs from the Planet X dealer group and rooftop APIs.

**What makes this safe:** Both `audit_session.dealer_group_id` and `scan.dealer_group_id` have `table = ""` — no FK constraint enforced. The `rooftop` table will have real rows populated from Phase 2 API data. The join path is: `scan → audit_session → rooftop → dealer_group`.

**When to run:** After the `dealer_group` and `rooftop` tables are populated from Planet X API data, and before the Planet X login cutover goes live for users.

---

### 2. User Story

As an Ikon operations admin,
I want all Phase 1 audit sessions and scans updated with the correct dealer group and rooftop IDs,
So that historical data is tenant-accurate and reportable when Phase 2 goes live.

---

### 3. Acceptance Criteria

- Given Phase 2 dealer group and rooftop rows exist in Xano, When the backfill runs, Then every `audit_session` previously holding `rooftop_id=1` is updated to a confirmed real `rooftop_id` matching the FSM who ran the session.
- Given `audit_session.dealer_group_id` is null for all Phase 1 records, When the backfill runs, Then `dealer_group_id` is set on each session by joining to the session's `rooftop.dealer_group_id`.
- Given `scan.dealer_group_id` is null for all Phase 1 records, When the backfill runs, Then each scan's `dealer_group_id` is set by inheriting from its parent `audit_session`.
- Given the backfill is complete, When a CSV is generated for a Phase 1 session, Then it carries the correct dealer group context in its metadata.
- Given the backfill is complete, When queried, Then no `audit_session` or `scan` rows exist with `rooftop_id=1` (placeholder retired).

**Verification gate:** Run a count query before and after to confirm all null `dealer_group_id` values have been resolved.

---

### Tech Notes

**Backfill query logic (Xano function):**
```
Step 1: For each audit_session where rooftop_id = 1
        → Identify correct rooftop_id by FSM user (confirm with ops team)
        → Update audit_session.rooftop_id and audit_session.dealer_group_id

Step 2: For each scan where dealer_group_id is null
        → Join scan.audit_session_id → audit_session.dealer_group_id
        → Update scan.dealer_group_id = audit_session.dealer_group_id
```

**Tables affected:**
- `audit_session` — update `rooftop_id`, `dealer_group_id`
- `scan` — update `dealer_group_id`

**Tables read-only (no changes):**
- `rooftop` — source of truth for `dealer_group_id`
- `dealer_group` — source of truth for tenant identity

**Risk:** Phase 1 sessions all used `rooftop_id=1`. The correct real rooftop for each session must be confirmed with the FSM or ops team before running — this is an operational step, not automated.

---

### QA and Verification

**How to test:**
- Count `audit_session` rows where `dealer_group_id IS NULL` → should be 0 after backfill
- Count `scan` rows where `dealer_group_id IS NULL` → should be 0 after backfill
- Spot-check 3 sessions: verify `rooftop_id` and `dealer_group_id` match the expected FSM's location
- Generate CSV for a backfilled session → verify dealer group context is present

**Edge cases:**
- FSM ran sessions at multiple rooftops during Phase 1 — requires manual mapping per session; document before running backfill
- Scan rows with no parent session — should not exist if Phase 1 integrity is maintained; flag as data anomaly if found

---

# Story P2-2

## Story Header

**Title:** Planet X login passthrough — retire local Xano auth
**Initiative/PRD:** Ikon Lot Scan — Phase 2
**Status:** Blocked — awaiting Planet X login API
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**What changes:** The `planetx_login_stub` in `apis/auth/login_POST.xs` is replaced with a real `api.request` call to the Planet X login endpoint. Xano validates credentials against Planet X, receives a Planet X token, stores it server-side, and issues a Xano JWT to the app. The app login screen UI does not change.

**What stays the same:** The Xano JWT issuance, the find-or-create user logic, and the `AppContext` token storage are all unchanged from Phase 1. The only code change is one function swap on the backend.

**Phase 1 user accounts:** FSM accounts manually created in Phase 1 will have matching Planet X identities. On first Planet X login, the `find-or-create user` logic in `auth/login_POST.xs` will match on email and bind the existing Xano user row to the Planet X identity — no duplicate accounts created.

---

### 2. User Story

As a Field Support Manager (FSM),
I want to log in with my existing Planet X credentials,
So that I don't need a separately managed Ikon Lot Scan password.

---

### 3. Acceptance Criteria

- Given the FSM enters their Planet X username and password, When `POST auth/login` is called, Then Xano forwards credentials to the Planet X login endpoint and receives a Planet X token on success.
- Given Planet X returns success, When Xano processes the response, Then a Xano JWT is issued to the app and the Planet X token is stored server-side (not exposed to the client).
- Given the Planet X token is stored, When a VIN scan is triggered (P2-5), Then Xano uses the stored Planet X token for the device lookup — not the legacy hardcoded token.
- Given the FSM enters invalid Planet X credentials, When Planet X returns 401, Then the app receives "Invalid credentials" — no upstream error details exposed.
- Given a Phase 1 FSM email exists in the Xano `user` table, When that FSM logs in via Planet X for the first time, Then the existing user row is matched and no duplicate is created.
- Given Planet X returns dealer group context at login (if available in the login response), When the response is processed, Then `dealer_group_id` is written to the user's Xano session context.

---

### Tech Notes

**Backend change — `apis/auth/login_POST.xs`:**
```
// REMOVE:
function.run planetx_login_stub { ... }

// REPLACE WITH:
api.request {
  url    = "<Planet X login endpoint — TBD>"
  method = "POST"
  params = { username: $login_id, password: $input.password }
} as $px_response
```

**Planet X token storage:** Store in a Xano variable attached to the user session or in the `user` table as `planetx_token` / `planetx_token_expires_at`. Must not be returned to the client in the response body.

**`AppContext` change:** Map `token` from the Phase 2 response (instead of `authToken` from Phase 1 local auth). Response shape is already `{ success, token, user, planetx }` in `auth/login_POST.xs` — `AppContext.setAuthToken` just reads `token` instead of `authToken`.

**Frontend change:** `LoginScreen.tsx` — update the response mapping if field name changes from `authToken` to `token`. Login form UI: no changes.

**Open question:** Does the Planet X login response include dealer group membership? If yes, that data should be written to context at login time, reducing an extra API call in P2-3.

---

### QA and Verification

**How to test:**
- Login with valid Planet X credentials → Xano JWT returned, user navigated to dealer group selection
- Login with invalid credentials → "Invalid credentials" shown, no JWT issued
- Login with a Phase 1 email → confirm no duplicate `user` row created in Xano DB
- Verify Planet X token is NOT present in the API response body (server-side only)
- After login, trigger a VIN scan → confirm it uses the user's Planet X token, not the hardcoded one

**Edge cases:**
- Planet X API timeout → return user-safe 503; do not expose upstream error
- Planet X returns success but with no token — treat as auth failure, log the anomaly

---


# Story P2-3

## Story Header

**Title:** Dealer group selection from live Planet X API
**Initiative/PRD:** Ikon Lot Scan — Phase 2
**Status:** Blocked — awaiting Planet X dealer groups API
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**What exists:** `DealerGroupSelectionScreen.tsx` is fully built in the frontend and uses `MOCK_DEALER_GROUPS` constant data. The screen, its layout, and its navigation wiring to `RooftopSelection` are all intact. It was kept dormant in Phase 1 specifically so it could be reactivated here with zero rework.

**What's needed:** A new Xano endpoint `GET /dealer-groups` that proxies the Planet X dealer groups API and returns a normalized list. The frontend screen swaps `MOCK_DEALER_GROUPS` for the live API response.

---

### 2. User Story

As a Field Support Manager (FSM),
I want to select my dealer group from a live list after logging in,
So that my audit session is correctly associated with the right tenant from the start.

---

### 3. Acceptance Criteria

- Given the FSM logs in successfully, When navigated to `DealerGroupSelectionScreen`, Then the screen calls `GET /dealer-groups` with the Xano JWT and displays the FSM's available dealer groups.
- Given the dealer groups list loads, When the FSM taps a group, Then `dealer_group_id` and `dealer_group_name` are written to `AppContext` and the FSM is navigated to `RooftopSelectionScreen`.
- Given the FSM does not have access to any dealer groups, When the list loads empty, Then the screen shows a "No dealer groups available" message and the FSM cannot proceed.
- Given the Planet X API returns an error, When the Xano proxy receives it, Then the error is mapped to a stable Xano response (no upstream details exposed) and the screen shows a retry option.
- Given `dealer_group_id` is stored in `AppContext`, When `start_session` is called (after rooftop selection), Then `audit_session.dealer_group_id` is populated with the real value — not null.

---

### Tech Notes

**New Xano endpoint:** `GET /dealer-groups`
- Auth: `auth = "user"` (requires Xano JWT)
- Calls Planet X dealer groups API using the stored Planet X token for the authenticated user
- Response shape (normalized):
```json
[{ "id": "dg_123", "name": "Friendly Auto Group" }]
```
- Errors from Planet X mapped to `401` or `503` — no raw upstream response forwarded

**`dealer_group` table:** Populate rows from the Planet X API response using `external_uid` as the idempotent key (`external_source:external_group_id`). Use `db.add` with upsert on `external_uid`.

**`DealerGroupSelectionScreen.tsx` change:**
- Replace `MOCK_DEALER_GROUPS` with `GET /dealer-groups` API call on mount
- On selection: write `{ dealerGroupId, dealerGroupName }` to `AppContext`
- Navigate to `RooftopSelectionScreen` (already wired — reactivated from dormant state)

**`AppContext` addition:**
- Add `dealerGroupId: string | null` and `dealerGroupName: string | null` setters
- Phase 1 had these as null placeholders — now populated with real values

**`start_session` backend update:**
- Pass `dealer_group_id` from `AppContext` in the request body
- Update `apis/audit/start_session_POST.xs` input to accept `dealer_group_id?` and write it to the `audit_session` record

---

### QA and Verification

**How to test:**
- Login → dealer group screen loads with real Planet X groups for the FSM
- Select a group → `AppContext.dealerGroupId` set, navigate to rooftop selection
- FSM with no groups → "No dealer groups available" displayed
- Planet X API down → retry prompt shown, no crash
- Start session after selection → `audit_session.dealer_group_id` is real, not null

**Edge cases:**
- FSM belongs to 1 dealer group — auto-select and skip screen (future enhancement; not in Phase 2 scope)
- Planet X rate limit hit — return 429 to client with retry-after guidance

---

# Story P2-4

## Story Header

**Title:** Rooftop selection from live Planet X API
**Initiative/PRD:** Ikon Lot Scan — Phase 2
**Status:** Blocked — awaiting Planet X rooftops API
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**What exists:** `RooftopSelectionScreen.tsx` is fully built and uses `MOCK_ROOFTOPS` constant data. Like `DealerGroupSelectionScreen`, it was kept dormant in Phase 1 and reactivates here with minimal changes.

**What's needed:** A new Xano endpoint `GET /rooftops?dealer_group_id=` that proxies the Planet X rooftops API. The frontend screen swaps `MOCK_ROOFTOPS` for the live API response filtered by the dealer group selected in P2-3.

---

### 2. User Story

As a Field Support Manager (FSM),
I want to select the specific rooftop I'm auditing from a live list,
So that all scans in the session are tied to the correct physical location.

---

### 3. Acceptance Criteria

- Given the FSM has selected a dealer group (P2-3), When navigated to `RooftopSelectionScreen`, Then the screen calls `GET /rooftops?dealer_group_id=<id>` and displays the rooftops for that group.
- Given the rooftop list loads, When the FSM selects a rooftop, Then `rooftopId` and `rooftopName` are written to `AppContext` and the FSM is navigated to `StartSessionScreen`.
- Given the FSM selects a rooftop, When `StartSessionScreen` calls `POST audit/start-session`, Then `rooftop_id` in the request is the real Planet X rooftop ID — not the placeholder `1`.
- Given the FSM does not have access to any rooftops in the selected dealer group, When the list loads empty, Then the screen shows "No rooftops available for this dealer group."
- Given the Planet X API returns 403 for an unauthorized group, When Xano proxies the response, Then the app shows "Access denied" and the FSM is returned to dealer group selection.

---

### Tech Notes

**New Xano endpoint:** `GET /rooftops?dealer_group_id=`
- Auth: `auth = "user"`
- Calls Planet X rooftops API with `dealer_group_id` filter and user's Planet X token
- Response shape (normalized):
```json
[{ "id": "rt_456", "name": "Friendly Chevrolet - Downtown", "dealer_group_id": "dg_123" }]
```
- 403 if caller is not a member of the requested dealer group

**`rooftop` table:** Upsert rows from Planet X response using `dealer_code` or `external_uid` as idempotent key. `dealer_group_id` FK now populated with real local `dealer_group.id`.

**`RooftopSelectionScreen.tsx` change:**
- Replace `MOCK_ROOFTOPS` with `GET /rooftops?dealer_group_id=<AppContext.dealerGroupId>` call on mount
- On selection: write `{ rooftopId, rooftopName }` to `AppContext` (overwrites the Phase 1 placeholder `1`)
- Navigate to `StartSessionScreen`

**`AppContext` update:**
- `rooftopId` changes from hardcoded `1` to the value set from rooftop selection
- `rooftopName` added for display in `ScanningScreen` header

**`ScanningScreen.tsx` update:**
- Header can now display `AppContext.rooftopName` — the mock lookup removed in P1-6 is replaced with real context value

---

### QA and Verification

**How to test:**
- Select dealer group → rooftop screen loads with real rooftops filtered by that group
- Select rooftop → `AppContext.rooftopId` set to real ID, navigate to start session
- Start session → `audit_session.rooftop_id` is real Planet X rooftop ID (not `1`)
- Unauthorized dealer group → 403 handled, FSM returned to dealer group selection
- Scanning screen header shows real rooftop name

**Edge cases:**
- FSM navigates back from `StartSession` to `RooftopSelection` — list should reload correctly
- Rooftop list changes between login and selection (Planet X data updated) — acceptable to show stale data until next login

---


# Story P2-5

## Story Header

**Title:** VIN scan returns live device data via user Planet X token
**Initiative/PRD:** Ikon Lot Scan — Phase 2
**Status:** Blocked — awaiting Planet X login API (token needed)
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**What exists:** `functions/283418_api_fetch.xs` already calls the Planet X device lookup endpoint (`https://myportalqa.ikongps.com/quality-control/devices`) using a hardcoded shared token. The VIN lookup works today — but with a single shared credential rather than per-user authentication.

**What changes:** The hardcoded token is replaced with the authenticated user's Planet X token (stored server-side after P2-2 login). The `ScanResultScreen` is updated to display the live device data fields returned by the scan — Serial, Last Report Date, Company, Group — which were empty placeholders in Phase 1.

**What stays the same:** The scan API endpoint, the `scan_vin` function, the `ScanningScreen` VIN input — all unchanged.

---

### 2. User Story

As a Field Support Manager (FSM),
I want to see real device information after scanning a VIN,
So that I can verify the device is correctly installed and associated at the rooftop.

---

### 3. Acceptance Criteria

- Given the FSM scans a valid VIN in an active session, When `POST audit/scan-vin` is called, Then Xano uses the FSM's Planet X token (not the hardcoded shared token) to call the Planet X device lookup.
- Given Planet X returns device data, When the scan result is stored, Then the `scan` row in Xano contains `serial`, `last_report_date`, `company`, `group`, `activated`, and `notes` fields populated.
- Given the scan is recorded, When the FSM is navigated to `ScanResultScreen`, Then the screen displays: VIN, Serial, Last Report Date, Company, Group, and status classification.
- Given the VIN is not found in Planet X, When the lookup returns 404, Then the scan is still recorded with `device_not_found=true` and the FSM sees "Device not found for this VIN."
- Given Planet X returns data but `Company` does not match the selected rooftop's dealer group, When the status is classified, Then the scan is flagged with the appropriate status per `status-classification-rules.md`.
- Given the Planet X token has expired mid-session, When the device lookup fails with 401, Then the FSM is prompted to log in again and the current session is preserved.

---

### Tech Notes

**`functions/283418_api_fetch.xs` change:**
```
// REMOVE:
|set:"token":"g%Lz2/#6k9)p"   // hardcoded shared token

// REPLACE WITH:
|set:"token":$input.planetx_token   // user's token passed in from scan_vin function
```

**`functions/275389_scan_vin.xs` change:**
- Retrieve user's Planet X token from `user` table (stored server-side in P2-2)
- Pass `planetx_token` as input to `api_fetch`

**`ScanResultScreen.tsx` changes:**
- Replace `MOCK_RESULT` with the real scan response from the API
- Display fields: VIN, Serial, Last Report Date, Company, Group, Activated, Notes, Status badge
- Status badge logic per `status-classification-rules.md`

**Open question (from `planetx-api.md`):** Do Planet X responses include stable IDs for Company/Group in addition to names? If yes, use IDs for status comparison; if no, compare name strings. This affects the classification logic implementation.

---

### QA and Verification

**How to test:**
- Scan a known VIN → `ScanResultScreen` shows real Serial, Company, Group, Last Report Date
- Scan a VIN not in Planet X → "Device not found" shown, scan row has `device_not_found=true`
- Verify `scan` DB row has all device data fields populated
- Verify shared hardcoded token is no longer used in any API call (search `api_fetch` call sites)
- Company mismatch → verify correct status flag applied

**Edge cases:**
- Planet X token expired (401 mid-session) → re-auth prompt, session preserved
- Planet X returns partial data (some fields missing) → display available fields, leave others blank; do not crash

---

# Story P2-6

## Story Header

**Title:** Full 30-column CSV with device data populated
**Initiative/PRD:** Ikon Lot Scan — Phase 2
**Status:** Blocked — awaiting P2-5 (device data in scans)
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**What exists:** `functions/generate_csv_report.xs` already builds a 30-column CSV. In Phase 1, device data columns (Serial, Last Report Date, Company, Group, etc.) were empty because scan rows had no device data. Once P2-5 populates device data on scan rows, the CSV function requires no changes — the data is already mapped to the correct columns.

**What this story validates:** End-to-end CSV generation with all 30 columns populated, including device data, tenant context, and status classification. This is primarily a QA and verification story.

---

### 2. User Story

As a Field Support Manager (FSM),
I want my downloaded CSV to contain complete device and location data for every VIN I scanned,
So that the audit report is usable for Ikon operations without manual data entry.

---

### 3. Acceptance Criteria

- Given the FSM completes a Phase 2 session, When `GET reports/download-csv` is called, Then the CSV contains all 30 columns as defined in `csv-report-schema.md`.
- Given device data was returned for a scan, When the CSV is generated, Then Serial, Last Report Date, Company, Group, Activated, and Notes columns are populated for that row.
- Given the selected rooftop and dealer group are real, When the CSV is generated, Then the rooftop name, dealer group name, and location context are present in the report header or per-row as defined in the schema.
- Given a VIN was not found in Planet X during scanning, When the CSV is generated, Then that row has VIN populated, device columns blank, and a status of "Device Not Found."
- Given the FSM shares the CSV with an Ikon ops team member, When they open it, Then the file is correctly formatted, parseable, and matches the column spec in `csv-report-schema.md`.

---

### Tech Notes

**Backend:** `generate_csv_report.xs` — no changes needed. Device data flows automatically from populated `scan` rows.

**What to verify per `csv-report-schema.md`:**
- Column count: 30
- VIN column: populated for all rows
- Device data columns: populated for found devices, blank for `device_not_found` rows
- Status column: correct classification per `status-classification-rules.md`
- Dealer group / rooftop context: present as defined in schema

**`SessionCompleteScreen.tsx`:** No changes — CSV download flow from Phase 1 (P1-8) unchanged.

---

### QA and Verification

**How to test:**
- Complete a full Phase 2 session (login → dealer group → rooftop → scan 5 VINs → end → download)
- Open CSV: verify 30 columns, all device fields populated for found VINs
- Include 1 VIN that is not in Planet X: verify that row has "Device Not Found" status and blank device columns
- Verify CSV column order matches `csv-report-schema.md` exactly
- Open in Excel and Google Sheets: verify no encoding or formatting issues

**Edge cases:**
- Session with 0 scans → CSV has header row only; download still works
- Very long VIN list (50+ scans) → CSV generates without timeout

---

# Story P2-7

## Story Header

**Title:** Schema enforcement — make dealer_group_id required after backfill
**Initiative/PRD:** Ikon Lot Scan — Phase 2
**Status:** Blocked — must run after P2-1 backfill is confirmed complete
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**Why:** During Phase 1 and early Phase 2, `dealer_group_id` was intentionally optional (`?`) on `audit_session` and `scan` tables to allow migration without FK failures. Once the backfill (P2-1) is confirmed complete and real dealer group selection (P2-3) is live, the field should be enforced.

**Risk if skipped:** Sessions or scans without a `dealer_group_id` become unfiltered in multi-tenant queries, creating data isolation risks as more FSMs onboard.

---

### 2. User Story

As an Ikon platform engineer,
I want `dealer_group_id` to be a required field on session and scan records,
So that no audit data can be created without proper tenant attribution.

---

### 3. Acceptance Criteria

- Given the P2-1 backfill is complete and verified (zero null `dealer_group_id` rows), When the schema is updated, Then `dealer_group_id` is non-nullable on `audit_session`.
- Given the schema is updated, When `dealer_group_id` is non-nullable on `scan`, Then any attempt to create a scan without `dealer_group_id` returns a database error.
- Given the Phase 2 app flow is live (P2-3 dealer group selection), When `start_session` is called, Then `dealer_group_id` is always present in the request — the API never writes null.
- Given the `rooftop` table still has `dealer_group_id?` optional, When schema enforcement is applied, Then `rooftop.dealer_group_id` is also made required (all rooftops populated from Planet X will have this set).

---

### Tech Notes

**Schema changes:**
- `tables/764656_audit_session.xs`: change `int dealer_group_id?` → `int dealer_group_id` with `table = "dealer_group"`
- `tables/764657_scan.xs`: change `int dealer_group_id?` → `int dealer_group_id` with `table = "dealer_group"` (currently `table = ""`)
- `tables/764658_rooftop.xs`: change `int dealer_group_id?` → `int dealer_group_id` with `table = "dealer_group"`

**Pre-condition:** Run count verification queries before applying:
```sql
SELECT COUNT(*) FROM audit_session WHERE dealer_group_id IS NULL  -- must be 0
SELECT COUNT(*) FROM scan WHERE dealer_group_id IS NULL           -- must be 0
SELECT COUNT(*) FROM rooftop WHERE dealer_group_id IS NULL        -- must be 0 (excluding placeholder row 1)
```

**Placeholder row cleanup:** Delete or archive `rooftop` row `id=1` and `account` row `id=1` seeded in Phase 1 (P1-1). These are no longer needed.

---

### QA and Verification

**How to test:**
- Run pre-condition count queries → all return 0 before schema change
- Apply schema changes in Xano
- Attempt to call `start_session` without `dealer_group_id` → expect DB error or API validation error
- Attempt to create a scan without `dealer_group_id` → expect DB error
- Verify all existing P2 sessions and scans are unaffected (data already has correct values)

**Edge cases:**
- Any Xano function that does a `db.add audit_session` without `dealer_group_id` — audit all call sites before enforcing
- Placeholder account/rooftop rows — confirm deleted before enforcement

---

## Phase 2 — Definition of Done

- [ ] P2-1: All Phase 1 sessions and scans backfilled with real `rooftop_id` and `dealer_group_id`; zero null rows remain
- [ ] P2-2: FSMs log in with Planet X credentials; Planet X token stored server-side; no hardcoded token used
- [ ] P2-3: Dealer group selection screen loads real groups from Planet X; `audit_session.dealer_group_id` is real
- [ ] P2-4: Rooftop selection screen loads real rooftops by dealer group; `audit_session.rooftop_id` is real
- [ ] P2-5: VIN scan uses FSM's Planet X token; `ScanResultScreen` displays live device data
- [ ] P2-6: CSV report has all 30 columns populated; device data and tenant context present
- [ ] P2-7: `dealer_group_id` enforced as required on `audit_session`, `scan`, and `rooftop`; placeholder rows retired
- [ ] Full end-to-end tested: Planet X Login → Dealer Group → Rooftop → Start → Scan × N → End → Download CSV (all 30 columns)
- [ ] Open questions from `planetx-api.md` resolved (stable IDs vs. names, rate limits)

---

## Phase 2 — Open Questions (Must Resolve Before Stories Begin)

| # | Question | Impact |
|---|---|---|
| 1 | Does the Planet X login response include dealer group membership? | If yes, skip extra API call in P2-3; if no, always call `/dealer-groups` after login |
| 2 | Do Planet X responses include stable IDs for Company/Group, or name strings only? | Affects status classification comparison logic in `scan_vin` and CSV |
| 3 | Are there rate limits on Planet X endpoints? | Affects retry strategy and error handling design |
| 4 | Is VIN the only supported lookup, or will serial number lookup be added? | Out of scope for Phase 2; confirm for Phase 3 backlog |

---

*Phase 2 complete. The Ikon Lot Scan app is fully integrated with Planet X for identity, tenant data, and device lookups.*
