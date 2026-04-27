# Epic: Phase 1 — Local Auth + Core Audit Flow

**Initiative:** Ikon Lot Scan (Lot Audit)
**Phase:** 1 of 2
**Status:** Ready for Development
**Created:** 2026-04-24
**Owner:** TBD

---

## Epic Summary

Deliver a working end-to-end audit flow that authorized FSM users can operate today — without any dependency on the Planet X login API, dealership API, or rooftop API. Users log in with a Xano-provisioned email and password, start a session against a placeholder rooftop, scan VINs, end the session, and download a CSV report.

When Planet X APIs become available, Phase 1 is replaced by Phase 2 with no data loss, no structural rework, and no changes to the scan/session/report flow.

---

## Scope

### In Scope
- Local Xano email + password login (manually provisioned FSM accounts)
- App auth context (JWT + session state) wired end-to-end
- Start audit session (placeholder `rooftop_id`, suppressed rooftop/dealer selection screens)
- Scan VIN (existing logic, unchanged)
- End audit session (existing logic, unchanged)
- Download CSV report (existing logic, unchanged)
- Database seeding: one `account` row and one `rooftop` placeholder row

### Out of Scope (Phase 2)
- Planet X login API passthrough
- Dealership / rooftop selection from live API
- Backfill of `dealer_group_id` and `rooftop_id` on existing sessions/scans

---

## Dependencies and DB Setup (prerequisite — not a story)

Before any Phase 1 story can be tested end-to-end, seed the following rows in Xano:

| Table | Action | Values |
|---|---|---|
| `account` | Insert one row | `id=1, name="Ikon Internal", type="internal", status="active"` |
| `rooftop` | Insert one row | `id=1, name="Unassigned", status="active"` |
| `user` | Insert FSM users manually | `email, hashed password, account_id=1, role="fsm"` |

**Why:** `audit_session.rooftop_id` is a hard FK — a real row must exist. `account_id` flows from user → session → scan → CSV security check. Null `account_id` breaks the CSV generation comparison.

---

## Stories

| # | Title | Layer | Priority |
|---|---|---|---|
| P1-1 | Seed database with placeholder account and rooftop | Backend/DB | P0 — Prerequisite |
| P1-2 | Local email + password login with Xano auth token | Backend + Frontend | P0 |
| P1-3 | App auth context wires JWT and session state | Frontend | P0 |
| P1-4 | Suppress dealer/rooftop selection — Start Session screen | Frontend | P0 |
| P1-5 | Start audit session with placeholder rooftop | Backend | P0 |
| P1-6 | Scan VIN within active session | Backend + Frontend | P1 |
| P1-7 | End audit session | Backend + Frontend | P1 |
| P1-8 | Download CSV report | Backend + Frontend | P1 |

---


---

# Story P1-1

## Story Header

**Title:** Seed database with placeholder account and rooftop
**Initiative/PRD:** Ikon Lot Scan — Phase 1
**Status:** Ready
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**Why now:** Every downstream story depends on a valid `account_id` and `rooftop_id` being present in the database. Without them, `start_session` fails on the FK constraint for `rooftop_id`, and the CSV security check (`session.account_id != user.account_id`) breaks when both sides are null.

**Related problem:** Phase 1 has no dealership or rooftop selection APIs. A placeholder row in each table unblocks the entire flow without any code change.

---

### 2. User Story

As a developer setting up the Phase 1 environment,
I want a placeholder `account` row and `rooftop` row seeded in the database,
So that the audit session FK constraint is satisfied and the `account_id` chain does not break.

---

### 3. Acceptance Criteria

- Given the database is empty of tenant data, When the seed is applied, Then an `account` row exists with `id=1, name="Ikon Internal", type="internal", status="active"`.
- Given the seed is applied, When an FSM user is created manually, Then `user.account_id` is set to `1`.
- Given the seed is applied, When `start_session` is called with `rooftop_id=1`, Then the FK constraint on `audit_session.rooftop_id` is satisfied and the session is created successfully.
- Given the seed is applied, When `generate_csv_report` runs its security check (`session.account_id != user.account_id`), Then both values are `1` and the check passes.

**Out of scope:** This row is not user-visible. It is a backend placeholder only.

---

### Tech Notes

- `account` table: `type` enum supports `"internal"` — correct for Ikon staff accounts.
- `rooftop` table: `dealer_group_id` is optional (`?`) — leave null for the placeholder row.
- `audit_session.rooftop_id` is a hard FK (`table = "rooftop"`) — row must exist before any session can be created.
- `audit_session.dealer_group_id` has `table = ""` (no FK enforced) — safe to leave null.

---

### QA and Verification

**How to test:** Call `POST audit/start-session` with `rooftop_id=1` and a user with `account_id=1`. Verify session is created. Then call `GET reports/download-csv` and verify CSV is returned without "Unauthorized" error.

**Edge cases:** None — this is a one-time seed operation.

---


# Story P1-2

## Story Header

**Title:** Local email + password login with Xano auth token
**Initiative/PRD:** Ikon Lot Scan — Phase 1
**Status:** Ready
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**Why now:** The Planet X login API is not yet available. FSM users need a secure, controlled way to access the app during Phase 1. Xano's built-in password hashing provides real credential security without Planet X dependency.

**What exists:** `apis/authentication/3573271_auth_login_POST.xs` is a complete, working Xano email + password login endpoint. It looks up the user by email, verifies the hashed password using `security.check_password`, and issues a Xano JWT. The `user` table already has the `password` field with `filters=min:8|minAlpha:1|minDigit:1` enforced.

**Phase 2 handoff:** When Planet X login API is ready, the app is pointed to `apis/auth/login_POST.xs` instead. The login screen UI does not change. User accounts provisioned in Phase 1 can be migrated or retired — no structural rework required.

---

### 2. User Story

As a Field Support Manager (FSM),
I want to log into the Ikon Lot Scan app with my email and password,
So that I can access the audit workflow securely without waiting for Planet X login.

---

### 3. Acceptance Criteria

- Given the FSM is on the login screen, When the FSM enters a valid email and password and taps Sign In, Then the app calls `POST Authentication/auth/login` and receives a Xano `authToken` and `user_id`.
- Given valid credentials are submitted, When the token is returned, Then the app stores the token and `user_id` in `AppContext` and navigates to the Start Session screen.
- Given an incorrect email or password is submitted, When the API returns `accessdenied`, Then the app displays "Invalid credentials" and the user remains on the login screen.
- Given the email field is empty, When the user taps Sign In, Then the app shows a field-level validation error before making any API call.
- Given the password field is empty, When the user taps Sign In, Then the app shows a field-level validation error before making any API call.
- Given a successfully logged-in FSM closes and reopens the app, When the session is within the 24-hour token window, Then the FSM does not need to log in again (token persisted in context for session duration).

**Logging:** Login success and failure events logged via existing `create_event_log` function in the authentication endpoint.

---

### Tech Notes

**Backend endpoint (Phase 1):** `apis/authentication/3573271_auth_login_POST.xs` — `api_group = "Authentication"`
- Input: `email`, `password`
- Output: `{ authToken, user_id }`
- Password check: `security.check_password` (Xano built-in bcrypt)
- Token expiry: 86400 seconds (24 hours)

**Backend endpoint (Phase 2 — do not use yet):** `apis/auth/login_POST.xs` — `api_group = "auth"`
- Output shape differs: `{ success, token, user, planetx }` — app context will need to map `token` instead of `authToken` when switching.

**Frontend — `LoginScreen.tsx`:**
- Add `email` TextInput and `password` TextInput (secureTextEntry)
- On submit: call `POST /auth/login`, on success write `authToken` + `user_id` to `AppContext`, navigate to `StartSession`
- On error: display inline error message

**User provisioning:** FSM accounts created manually in Xano. Password must meet: min 8 chars, at least 1 alpha, at least 1 digit.

---

### QA and Verification

**How to test:**
- Login with valid credentials → reaches Start Session screen
- Login with wrong password → "Invalid credentials" shown, stays on login
- Login with unknown email → "Invalid credentials" shown
- Empty email → field error shown, no API call made
- Empty password → field error shown, no API call made

**Edge cases:**
- User with no `account_id` set — session starts but CSV may break (mitigated by P1-1 seed requirement)
- Token expiry mid-session — out of scope for Phase 1; handle in Phase 2

---


# Story P1-3

## Story Header

**Title:** App auth context wires JWT and session state end-to-end
**Initiative/PRD:** Ikon Lot Scan — Phase 1
**Status:** Ready
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**Why now:** The app currently has zero state management. `rooftopId` is the only value passed around, and it bounces through navigation params screen to screen. There is no `authToken`, no `userId`, and no `sessionId` stored anywhere. Every API call from `StartSession` through `DownloadCSV` needs the JWT in the `Authorization` header. Without a central context, this token has no home.

**What does not exist yet:** No `AppContext`, no provider in `App.tsx`. This story creates the single shared state layer that all Phase 1 stories depend on.

---

### 2. User Story

As the app,
I want a central context that holds the auth token, user ID, session ID, and placeholder rooftop ID,
So that every screen can make authenticated API calls without passing state through navigation params.

---

### 3. Acceptance Criteria

- Given login succeeds (P1-2), When `AppContext` is initialized, Then it holds `authToken`, `userId`, `sessionId` (null until session starts), `rooftopId` (default `1`), and `dealerGroupId` (null).
- Given `AppContext` is in place, When any audit API is called (`start-session`, `scan-vin`, `end-session`, `download-csv`), Then the Xano JWT from context is sent in the `Authorization: Bearer <token>` header.
- Given a session is created (P1-5), When `sessionId` is written to context, Then `ScanningScreen`, `EndAuditConfirmScreen`, and `SessionCompleteScreen` all read `sessionId` from context — not from navigation params.
- Given context is populated, When navigation params for `rooftopId` are no longer needed per screen, Then `Scanning`, `ScanResult`, `EndAuditConfirm`, and `SessionComplete` do not require `rooftopId` as a nav param (it is read from context).
- Given the user taps "Finish" or "New Audit" on `SessionCompleteScreen`, When the flow resets, Then `sessionId` in context is cleared and the user is routed back to `StartSession`.

---

### Tech Notes

**New file:** `prototype/src/context/AppContext.tsx`

```typescript
// Shape of context for Phase 1
{
  authToken: string | null
  userId: number | null
  sessionId: number | null
  rooftopId: number           // hardcoded 1 in Phase 1
  dealerGroupId: number | null // null in Phase 1
  setAuthToken: (token: string) => void
  setUserId: (id: number) => void
  setSessionId: (id: number | null) => void
}
```

**`App.tsx` change:** Wrap `<RootNavigator />` in `<AppProvider>`.

**`navigation/types.ts` change:** Remove `rooftopId` from `Scanning`, `ScanResult`, `EndAuditConfirm`, `SessionComplete` param types — those screens read from context instead.

**Phase 2 note:** When Planet X login returns `dealer_group_id` and real `rooftop_id`, those values are written into context at login time. No screen changes required.

---

### QA and Verification

**How to test:**
- Login → verify context holds `authToken` and `userId`
- Start session → verify `sessionId` is set in context
- Navigate to Scanning → verify `sessionId` accessible without nav param
- End session → verify `sessionId` clears from context on "Finish"

**Edge cases:**
- Context reset on app close — in-memory only for Phase 1; user must re-login (acceptable)

---


# Story P1-4

## Story Header

**Title:** Suppress dealer/rooftop selection — introduce Start Session screen
**Initiative/PRD:** Ikon Lot Scan — Phase 1
**Status:** Ready
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**Why now:** The current navigation routes the user through `DealerGroupSelection` and `RooftopSelection` after login. Both screens use mock data and cannot be connected to live APIs because those APIs do not exist yet. Routing through these screens would force the user to interact with fake data before starting a real session.

**Decision:** Suppress both screens from the active nav flow for Phase 1. The screens are kept in the codebase unchanged — they are simply not routed to. When dealer/rooftop APIs arrive in Phase 2, they are wired back in with zero rework.

**New screen:** A minimal `StartSessionScreen` is added between `Login` and `Scanning`. It shows a "Start Audit" button and (optionally) a read-only location label. Tapping it calls `POST audit/start-session` using `rooftopId=1` from context.

---

### 2. User Story

As a Field Support Manager (FSM),
I want to see a "Start Audit" screen immediately after login,
So that I can begin scanning without being asked to select a dealer group or rooftop that aren't real yet.

---

### 3. Acceptance Criteria

- Given the FSM successfully logs in, When the JWT is stored in context, Then the FSM is navigated to `StartSession` — not `DealerGroupSelection`.
- Given the FSM is on `StartSession`, When the FSM taps "Start Audit", Then the app calls `POST audit/start-session` with `rooftopId=1` from context and the JWT in the Authorization header.
- Given `DealerGroupSelectionScreen` and `RooftopSelectionScreen` exist in the codebase, When the user flows through Phase 1, Then neither screen is displayed — they are dormant nav routes only.
- Given the FSM is on `SessionCompleteScreen` and taps "New Audit", When the navigation resets, Then the FSM is routed back to `StartSession` (not `RooftopSelection`).
- Given the FSM taps "Finish" on `SessionCompleteScreen`, When the navigation resets, Then the FSM is routed back to `Login`.

---

### Tech Notes

**`RootNavigator.tsx` changes:**
- Remove `DealerGroupSelection` and `RooftopSelection` from `initialRouteName` routing
- Add `StartSession` screen between `Login` and `Scanning`
- `DealerGroupSelection` and `RooftopSelection` stack entries remain registered (dormant)

**New file:** `prototype/src/screens/StartSessionScreen.tsx`
- Single "Start Audit" button
- Reads `rooftopId` from `AppContext` (value: `1`)
- Calls `POST audit/start-session` on tap
- On success: writes `sessionId` to context, navigates to `Scanning`
- On error: displays inline error, stays on screen

**`SessionCompleteScreen.tsx` change:**
- "New Audit" → `navigation.replace('StartSession')` instead of `'RooftopSelection'`

**`navigation/types.ts` change:**
- Add `StartSession: undefined` to `RootStackParamList`

---

### QA and Verification

**How to test:**
- Login → confirm next screen is `StartSession`, not `DealerGroupSelection`
- Tap "Start Audit" → confirm session is created (check Xano DB), confirm nav to `Scanning`
- Complete full flow → tap "New Audit" on `SessionComplete` → confirm routes to `StartSession`
- Tap "Finish" on `SessionComplete` → confirm routes to `Login`

**Edge cases:**
- `POST audit/start-session` fails (network error) → error shown, user stays on `StartSession`
- `DealerGroupSelection` navigated to directly (e.g. deep link) → acceptable to show but will display mock data; not tested in Phase 1

---

# Story P1-5

## Story Header

**Title:** Start audit session with placeholder rooftop via authenticated API
**Initiative/PRD:** Ikon Lot Scan — Phase 1
**Status:** Ready
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**Why now:** The `start_session` backend function and `POST audit/start-session` endpoint are already fully built and require no changes. The only requirement is that the call is made with a valid JWT (from P1-2/P1-3) and a valid `rooftop_id` (from the placeholder row seeded in P1-1).

**What exists — no backend changes needed:**
- `apis/audit/start_session_POST.xs` — accepts `rooftop_id`, uses `$auth.id` from JWT, calls `get_user_context`, creates `audit_session` row.
- `functions/275387_start_session.xs` — creates the session record, logs success/failure via `heartbeat_log`.

---

### 2. User Story

As a Field Support Manager (FSM),
I want the app to start an audit session when I tap "Start Audit",
So that all subsequent VIN scans are tied to a session record in the database.

---

### 3. Acceptance Criteria

- Given the FSM taps "Start Audit" on `StartSessionScreen`, When `POST audit/start-session` is called with `rooftop_id=1` and a valid JWT, Then the backend creates an `audit_session` row with `status="in_progress"`, `user_id` from the JWT, `account_id=1`, and `rooftop_id=1`.
- Given the session is created, When the API responds, Then `session.id` is written to `AppContext.sessionId` and the FSM is navigated to `ScanningScreen`.
- Given the session is created, When `get_user_context` is called internally, Then `user_context.success` is `true` and `account_id` is `1` (not null).
- Given a network error occurs during session creation, When the API call fails, Then the FSM sees an error message on `StartSessionScreen` and the session is not partially created.

**Logging:** `heartbeat_log` already fires on success and error inside `start_session` function — no changes needed.

---

### Tech Notes

**Backend:** No changes. `apis/audit/start_session_POST.xs` and `functions/275387_start_session.xs` are used as-is.

**API call from frontend:**
```
POST /audit/start-session
Authorization: Bearer <authToken from AppContext>
Body: { rooftop_id: 1 }
```

**Response shape:**
```json
{ "success": true, "session": { "id": 42, "rooftop_id": 1, "status": "in_progress", "started_at": "..." } }
```

`session.id` → stored in `AppContext.sessionId`.

**`dealer_group_id`:** Left null on `audit_session`. Field is optional with no FK constraint (`table = ""`). No issue.

---

### QA and Verification

**How to test:**
- Tap "Start Audit" → verify `audit_session` row in Xano DB with correct `user_id`, `account_id=1`, `rooftop_id=1`, `status="in_progress"`
- Verify `heartbeat_log` entry for success
- Simulate API failure → verify error shown on `StartSessionScreen`

**Edge cases:**
- User has no `account_id` — blocked by P1-1 prerequisite; do not test without seed data in place
- Calling `start-session` twice without ending the first — two `in_progress` sessions created; acceptable for Phase 1

---


# Story P1-6

## Story Header

**Title:** Scan VIN within active session
**Initiative/PRD:** Ikon Lot Scan — Phase 1
**Status:** Ready
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**What exists — minimal frontend changes needed:** `apis/audit/scan_vin_POST.xs` and `functions/275389_scan_vin.xs` are fully built. `ScanningScreen.tsx` has VIN input, validation, and navigation. The only changes needed are: (1) remove the mock `groupName`/`rooftopName` header lookup that reads from `MOCK_ROOFTOPS`, and (2) wire the "Look up" button to call the real `POST audit/scan-vin` API using `sessionId` from `AppContext`.

---

### 2. User Story

As a Field Support Manager (FSM),
I want to enter or scan a VIN and have it recorded against my active session,
So that each vehicle I process is captured in the database.

---

### 3. Acceptance Criteria

- Given the FSM is on `ScanningScreen` with an active `sessionId` in context, When the FSM enters a valid 17-character VIN and taps "Look up", Then the app calls `POST audit/scan-vin` with `session_id` from context and the VIN.
- Given the API call succeeds, When the scan is recorded, Then the app navigates to `ScanResultScreen` and the scan counter increments by 1.
- Given the FSM enters an invalid VIN (not 17 chars, or contains I/O/Q), When the FSM taps "Look up", Then the app shows "Invalid VIN" and does not call the API.
- Given the `ScanningScreen` header, When the screen loads, Then it does not display mock dealer group or rooftop names — it shows a generic label or is left blank for Phase 1.
- Given the API call fails (network error or session not found), When the error is returned, Then the FSM sees an error message and can retry.

---

### Tech Notes

**Backend:** No changes. `apis/audit/scan_vin_POST.xs` used as-is.

**API call from frontend:**
```
POST /audit/scan-vin
Authorization: Bearer <authToken from AppContext>
Body: { session_id: <sessionId from AppContext>, vin: "...", scan_method: "manual" }
```

**`ScanningScreen.tsx` changes:**
- Remove lines 24–31 (mock `groupName`/`rooftopName` lookup from `MOCK_ROOFTOPS`/`MOCK_DEALER_GROUPS`)
- Replace `navigation.replace('ScanResult', { rooftopId, vin, scanCount })` with API call; on success navigate to `ScanResult`
- Read `sessionId` from `AppContext` instead of route params

**`ScanResultScreen.tsx`:** Currently shows `MOCK_RESULT`. In Phase 1, the scan API does not yet return device data (Planet X lookup not wired). Show the recorded VIN and a "Recorded" confirmation. Device data fields remain empty/placeholder until Phase 2.

---

### QA and Verification

**How to test:**
- Enter valid VIN → verify `scan` row created in Xano DB with correct `audit_session_id`, `account_id=1`, `vin`
- Enter VIN with wrong length → verify validation error, no DB row
- Enter VIN with I, O, or Q → verify validation error
- Scan same VIN twice → two rows created (acceptable for Phase 1)

**Edge cases:**
- `session_id` is null in context (session not started) — should not occur if P1-4/P1-5 are implemented; treat as fatal error
- Network drops mid-scan — error shown, FSM can retry

---

# Story P1-7

## Story Header

**Title:** End audit session
**Initiative/PRD:** Ikon Lot Scan — Phase 1
**Status:** Ready
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**What exists — no backend changes needed:** `apis/audit/end_session_POST.xs` and `functions/275388_end_session.xs` are fully built. `EndAuditConfirmScreen.tsx` exists with a confirmation UI. The only frontend change is wiring the "Yes, end audit" button to call the real API using `sessionId` from `AppContext`.

---

### 2. User Story

As a Field Support Manager (FSM),
I want to confirm ending my audit and have the session closed in the system,
So that no further scans can be added and the report can be generated.

---

### 3. Acceptance Criteria

- Given the FSM taps "End audit" from `ScanningScreen` or `ScanResultScreen`, When the FSM lands on `EndAuditConfirmScreen`, Then a confirmation prompt is shown before any API call is made.
- Given the FSM taps "Yes, end audit", When `POST audit/end-session` is called with `session_id` from context and the JWT, Then the backend updates `audit_session.status` to `"completed"` and sets `ended_at`.
- Given the session ends successfully, When the API responds, Then `AppContext.sessionId` is cleared and the FSM is navigated to `SessionCompleteScreen`.
- Given the FSM taps "Cancel" on `EndAuditConfirmScreen`, When cancelled, Then no API call is made and the FSM is returned to the previous screen.
- Given a network error during end session, When the API fails, Then the FSM sees an error and the session remains `in_progress` in the database.

---

### Tech Notes

**Backend:** No changes. `apis/audit/end_session_POST.xs` used as-is.

**API call from frontend:**
```
POST /audit/end-session
Authorization: Bearer <authToken from AppContext>
Body: { session_id: <sessionId from AppContext> }
```

**`EndAuditConfirmScreen.tsx` changes:**
- Replace `navigation.replace('SessionComplete', { rooftopId })` with API call
- On success: clear `sessionId` from context, navigate to `SessionComplete`
- On cancel: `navigation.goBack()` (unchanged)

---

### QA and Verification

**How to test:**
- Tap "End audit" → confirm screen → tap "Yes, end audit" → verify `audit_session.status = "completed"` and `ended_at` set in Xano DB
- Tap "Cancel" → verify no DB change, returns to previous screen
- Simulate API failure → verify session stays `in_progress`, error shown

---

# Story P1-8

## Story Header

**Title:** Download CSV report at session completion
**Initiative/PRD:** Ikon Lot Scan — Phase 1
**Status:** Ready
**Owner:** TBD
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

### 1. Context and Background

**What exists — no backend changes needed:** `apis/reports/download_csv_GET.xs` and `functions/generate_csv_report.xs` are fully built. The CSV generator fetches all scans for the session, runs the `account_id` security check, builds 30 columns, and returns the CSV string. Fields dependent on Planet X device data will be empty in Phase 1 — this is expected and documented in the CSV function comments.

`SessionCompleteScreen.tsx` already has a "Download CSV" button that calls `Linking.openURL(reportUrl)`. The change needed is to trigger the API call and pass the CSV back to the screen.

---

### 2. User Story

As a Field Support Manager (FSM),
I want to download a CSV report after ending my audit,
So that I have a record of all VINs scanned during the session.

---

### 3. Acceptance Criteria

- Given the FSM reaches `SessionCompleteScreen`, When the screen loads, Then the app automatically calls `GET reports/download-csv?session_id=<sessionId>` with the JWT.
- Given the CSV is generated successfully, When the response is received, Then the "Download CSV" button is enabled and triggers a file download or share sheet.
- Given the CSV content is returned, When the FSM opens it, Then it contains one header row and one data row per scanned VIN with the VIN populated; device data columns are empty (Planet X not wired yet) — acceptable for Phase 1.
- Given the `account_id` security check in `generate_csv_report`, When the session's `account_id` matches the user's `account_id` (both `1`), Then the check passes and the CSV is returned.
- Given the session has zero scans, When the CSV is generated, Then the CSV contains only the header row and the download is still offered.
- Given a network error during CSV generation, When the API fails, Then the "Download CSV" button is disabled and an error message is shown.

---

### Tech Notes

**Backend:** No changes. `apis/reports/download_csv_GET.xs` and `functions/generate_csv_report.xs` used as-is.

**API call from frontend:**
```
GET /reports/download-csv?session_id=<sessionId>
Authorization: Bearer <authToken from AppContext>
```

Response: `text/csv` string with `Content-Disposition: attachment; filename="audit-report.csv"`

**`SessionCompleteScreen.tsx` changes:**
- On mount: call `GET reports/download-csv` using `sessionId` from context (not route params)
- Store CSV string or download URL in local state
- "Download CSV" button: use `Linking.openURL` or `Share.share` with the CSV content

**Phase 1 CSV note:** `device_data` fields on scan rows will be empty (no Planet X lookup yet). The 30-column header is still written; data rows have VIN populated and all device columns blank. This is explicitly documented in `generate_csv_report.xs` comments.

---

### QA and Verification

**How to test:**
- Complete a session with 3+ scans → reach `SessionCompleteScreen` → verify CSV downloads with correct VINs
- Verify CSV has 30-column header matching `csv-report-schema.md`
- Verify device data columns are empty (expected in Phase 1)
- Complete a session with 0 scans → verify CSV downloads with header row only
- Simulate CSV generation failure → verify error shown, button disabled

**Edge cases:**
- `account_id` mismatch (user and session on different accounts) — blocked by P1-1 and P1-5 if seeded correctly
- Very large session (100+ scans) — performance acceptable for Phase 1 field use

---

## Phase 1 — Definition of Done

- [ ] P1-1: `account` and `rooftop` placeholder rows seeded in Xano
- [ ] P1-2: FSM can log in with email + password; JWT returned and stored in context
- [ ] P1-3: `AppContext` wraps the app; all screens read token and session state from context
- [ ] P1-4: Login routes to `StartSession`; dealer/rooftop screens dormant; `SessionComplete` routes back to `StartSession`
- [ ] P1-5: "Start Audit" creates a real `audit_session` row in Xano with `rooftop_id=1`, `account_id=1`
- [ ] P1-6: VIN entry validated and recorded as a `scan` row linked to the active session
- [ ] P1-7: "End audit" closes the session (`status="completed"`, `ended_at` set)
- [ ] P1-8: CSV downloads with all scanned VINs; device columns empty pending Phase 2
- [ ] Full end-to-end tested: Login → Start → Scan × N → End → Download CSV

---

*Phase 1 complete. Phase 2 begins when Planet X login API and dealership/rooftop APIs are available.*
