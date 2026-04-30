# Bug Log — Demo MVP Integration

**Branch:** `feature/demo-mvp`
**PR:** None yet (changes on `feature/demo-mvp`, not yet merged to `main`)

---

## BUG-001 — Missing `api_group.xs` blocked Xano CLI push

**File:** `apis/auth/api_group.xs`
**Status:** ✅ Fixed

### What happened
`xano workspace push` failed with:
> `Push failed (400): Missing valid API Group on query: auth/login`

### Root cause
The `apis/auth/` directory had `login_POST.xs` but no `api_group.xs` to register the group with Xano.

### Fix
Created `apis/auth/api_group.xs` with canonical `oGWteBqN`.

---

## BUG-002 — `XANO_API_BASE` pointed to placeholder URL

**File:** `prototype/src/constants.ts`
**Status:** ✅ Fixed

### What happened
All API calls failed with "Unable to connect" — `XANO_API_BASE` was still set to `https://YOUR_XANO_INSTANCE.xano.io/api`. Also, the app used group names in the URL but Xano requires canonical IDs.

### Fix
Replaced single `XANO_API_BASE` with three group-specific constants:
```ts
export const XANO_AUTH_BASE    = 'https://xbag-0eaz-gnpd.n7e.xano.io/api:oGWteBqN';
export const XANO_AUDIT_BASE   = 'https://xbag-0eaz-gnpd.n7e.xano.io/api:JoIhxJtJ';
export const XANO_REPORTS_BASE = 'https://xbag-0eaz-gnpd.n7e.xano.io/api:bexh7j9u';
```

---

## BUG-003 — `Missing param: username` on login (400)

**File:** `prototype/src/screens/LoginScreen.tsx`
**Status:** ✅ Fixed

### What happened
Login returned `400 Bad Request`:
> `{ "code": "ERROR_CODE_INPUT_ERROR", "message": "Missing param: username" }`

### Root cause
App only sent `email` + `password`. Xano requires `username` to be present in the payload even when marked optional, because `first_notnull` references it.

### Fix
```ts
body: JSON.stringify({ email, username: email, password })
```

---

## BUG-004 — `Bearer undefined` — auth token not stored after login

**File:** `prototype/src/screens/LoginScreen.tsx`
**Status:** ✅ Fixed

### What happened
After login, all authenticated requests sent `Authorization: Bearer undefined`.

### Root cause
App expected `data.authToken` and `data.user_id` but the API returns `data.token` and `data.user.id`.

### Fix
```ts
// Before
setAuth(data.authToken, data.user_id);
// After
setAuth(data.token, data.user?.id);
```

---

## BUG-005 — 404 on all audit endpoints — missing path prefix

**Files:** `StartSessionScreen.tsx`, `ScanningScreen.tsx`, `EndAuditConfirmScreen.tsx`
**Status:** ✅ Fixed

### What happened
All audit calls returned `404 Not Found` — request hit `/api:JoIhxJtJ/start-session`.

### Root cause
Xano registers endpoints with the full path including the group name (e.g. `audit/start-session`). The app was calling without the `audit/` prefix.

### Fix
```ts
// Before
fetch(`${XANO_AUDIT_BASE}/start-session`, ...)
// After
fetch(`${XANO_AUDIT_BASE}/audit/start-session`, ...)
```

---

## BUG-006 — Merge conflict in `scan_vin` caused double-increment of session counters

**File:** `functions/9_scan_vin.xs`
**Status:** ✅ Fixed

### What happened
A git merge conflict in `functions/9_scan_vin.xs` was not properly resolved. Both sides of the conflict were retained, leaving:
- Three `<<<<<<<` / `=======` / `>>>>>>>` marker zones that made the file syntactically invalid (Xano would reject it on push).
- A **duplicate block** containing two identical `db.edit audit_session` calls to increment `total_scans` and two identical `var $classified_status` / `var $is_exception` declarations.

Any scan processed against this file would have incremented `total_scans` twice per scan, corrupting session totals visible on `ResumeSessionScreen` and `SessionCompleteScreen`.

### Root cause
A `git merge` between `HEAD` (a style-only refactor with explicit boolean parens and consistent field alignment) and an incoming branch (feature logic additions) was left in a partially-resolved state. The merge tool accepted both halves of the DINT-03/DINT-04 block without de-duplicating them.

### Risk assessment at time of discovery
| Area | Risk |
|---|---|
| Conflict marker zones (style only) | 🟢 Low — no logic difference |
| Duplicate `db.edit total_scans` block | 🔴 High — every scan double-increments the counter |
| NHTSA `api.request` without `try_catch` | 🔴 High — any NHTSA outage would fail all scans |

### Fix

**1. Conflict markers** — Removed all three `<<<<<<<` / `=======` / `>>>>>>>` zones. Kept the incoming-side formatting (explicit boolean parens, consistent indentation) as it is safer and more readable.

**2. Duplicate block** — Deleted the HEAD-side copy of lines 175–198 (the first `db.edit total_scans` + first `var $classified_status` / `var $is_exception`). The incoming-side copy at lines 193–207 was retained as the single authoritative version.

**3. NHTSA call (E6-01)** — Wrapped the new `api.request` to `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/` in a `try_catch` block. On failure, `$vehicle_make`, `$vehicle_model`, and `$vehicle_year` remain `null` and a warning is logged via `heartbeat_log`. The scan proceeds and succeeds regardless of NHTSA availability.

### Action items
- [x] Remove all conflict markers from `functions/9_scan_vin.xs`
- [x] Delete duplicate DINT-03/DINT-04 block (second copy of `db.edit total_scans` + variable initializers)
- [x] Wrap NHTSA `api.request` in `try_catch` with `heartbeat_log` warning on catch
- [x] Add `make?`, `model?`, `year?` optional fields to `tables/7_scan.xs`
- [x] Persist decoded vehicle descriptor to scan row via `db.edit` after Planet X classification
- [x] Extend `$scan_data` response object with `make`, `model`, `year` fields
- [ ] Run a data repair on existing `audit_session` rows where `total_scans` was inflated — compare against `COUNT(scan WHERE audit_session_id = id)` and correct discrepancies

### Data repair query (pending)
The double-increment affected all sessions created while the broken file was active. A corrective `db.edit` pass should be run against `audit_session` rows, recomputing `total_scans` as a raw count of child `scan` records:
```
SELECT id, COUNT(scan rows) as real_count FROM audit_session → db.edit total_scans = real_count
```
Coordinate with backend lead before running in production.
