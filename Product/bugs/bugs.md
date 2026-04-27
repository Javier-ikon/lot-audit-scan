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
