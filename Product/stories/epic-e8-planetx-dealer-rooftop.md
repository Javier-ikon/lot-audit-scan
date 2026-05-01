## Epic E8 — Dealer Group & Rooftop: Planet X Integration (Long-Term)

### Context

- **Why this epic exists:** Epic E7 seeds `dealer_group` and `rooftop` data manually in the Xano DB as a short-term unblocking measure. This epic replaces the DB-query implementation inside the two Xano API endpoints with real Planet X API calls — without touching the frontend or the API contract.
- **Key architectural principle:** The frontend and the Xano API surface (`GET /dealer-groups`, `GET /rooftops`) are **not changed**. Only the internal implementation of those endpoints changes — from a `db.query` against local tables to an `http.get` against Planet X. This is a pure backend swap.
- **Prerequisite:** Planet X API credentials, base URL, and endpoint documentation must be obtained before E8 stories can be executed. See `product/discovery-integration-data-retrieval.md` for the open questions tracker.
- **Sequencing:** E8 depends on E7 being fully merged and deployed. E8-01 must complete before any other E8 story.

---

## Pre-conditions (must be true before execution)

- [ ] Planet X API base URL and auth mechanism are confirmed (API key, OAuth, etc.)
- [ ] Planet X dealer group list endpoint spec is available (path, query params, response shape)
- [ ] Planet X rooftop/location list endpoint spec is available
- [ ] Test credentials or sandbox access is available for development
- [ ] E7 is fully deployed to Xano production

---

## Backend Stories

---

### E8-01 — Replace Planet X Login Stub with Real Auth

**Goal:** Replace `functions/12_planetx_login_stub.xs` with a real HTTP call to the Planet X authentication endpoint so all downstream functions can obtain a valid token.

**Current state:** `functions/12_planetx_login_stub.xs` returns a hardcoded `"px_stub_token"` — no real HTTP call is made.

**Required change (Xano Function Writer):**
- Replace the stub body with an `http.post` to the Planet X auth endpoint.
- Store credentials (client ID, secret, or API key) in Xano environment variables — never hardcode.
- Return `{ success, planetx_token, expires_in, error }` — same response shape as the stub so callers need no changes.
- Handle auth failure: return `success: false` with the error message.

**Acceptance Criteria:**
- Function makes a real HTTP call to the Planet X auth endpoint.
- Credentials are stored in Xano environment variables (not hardcoded in the file).
- On success: `planetx_token` is a real, usable bearer token.
- On failure: returns `success: false` with a descriptive `error` string.
- Response shape is identical to the stub — no callers need updating.

---

### E8-02 — Build `get_dealer_groups_from_planetx` Function

**Goal:** Create a reusable Xano function that calls the Planet X dealer group list API and returns a normalized list matching our internal shape `{ id, name }`.

**Required change (Xano Function Writer):**
- Create `functions/get_dealer_groups_from_planetx.xs`.
- Call `function.run planetx_login_stub` (now real) to obtain a token.
- Make an `http.get` to the Planet X dealer groups endpoint, passing the token as a Bearer header.
- Map the Planet X response fields to `{ id, name }` — store the Planet X native ID in `external_group_id` if caching is needed.
- Return `{ success, dealer_groups: [...], error }`.

**Acceptance Criteria:**
- Function returns a list of `{ id, name }` objects normalized from Planet X response.
- Auth token is obtained via `planetx_login_stub` — not hardcoded.
- HTTP errors (4xx, 5xx) return `success: false` with the error.
- Response shape is identical to what the DB-backed implementation returns — `GET /dealer-groups` endpoint needs zero changes.

---

### E8-03 — Build `get_rooftops_from_planetx` Function

**Goal:** Create a reusable Xano function that calls the Planet X rooftop/location API filtered by dealer group and returns a normalized list matching our internal shape `{ id, name, dealer_group_id }`.

**Required change (Xano Function Writer):**
- Create `functions/get_rooftops_from_planetx.xs`.
- Input: `int dealer_group_id` (required).
- Call Planet X auth → `http.get` to the Planet X locations endpoint with `dealer_group_id` (or equivalent filter param) in the request.
- Map Planet X response to `{ id, name, dealer_group_id }`.
- Return `{ success, rooftops: [...], error }`.

**Acceptance Criteria:**
- Function accepts `dealer_group_id` and returns only rooftops for that group.
- Auth token is obtained via `planetx_login_stub`.
- HTTP errors return `success: false` with the error.
- Response shape is identical to what the DB-backed implementation returns — `GET /rooftops` endpoint needs zero changes.

---

### E8-04 — Swap `GET /dealer-groups` to Use Planet X Function

**Goal:** Replace the `db.query` inside `GET /dealer-groups` with a call to `get_dealer_groups_from_planetx`. The API contract (path, auth, response shape) does not change.

**Current state (after E7-03):** `GET /dealer-groups` queries the `dealer_group` table directly.

**Required change (Xano API Query Writer):**
- Remove the `db.query` on `dealer_group`.
- Replace with `function.run get_dealer_groups_from_planetx`.
- If the function returns `success: false`, throw an appropriate API error.
- Response shape remains `[{ id, name }]`.

**Acceptance Criteria:**
- Endpoint returns dealer groups sourced from Planet X, not the local DB.
- API path, auth requirement, and response shape are unchanged — frontend needs zero changes.
- Error from Planet X propagates as a 502 or appropriate HTTP error to the caller.

---

### E8-05 — Swap `GET /rooftops` to Use Planet X Function

**Goal:** Replace the `db.query` inside `GET /rooftops` with a call to `get_rooftops_from_planetx`. The API contract does not change.

**Current state (after E7-04):** `GET /rooftops` queries the `rooftop` table filtered by `dealer_group_id`.

**Required change (Xano API Query Writer):**
- Remove the `db.query` on `rooftop`.
- Replace with `function.run get_rooftops_from_planetx { input = { dealer_group_id: $input.dealer_group_id } }`.
- If the function returns `success: false`, throw an appropriate API error.
- Response shape remains `[{ id, name, dealer_group_id }]`.

**Acceptance Criteria:**
- Endpoint returns rooftops sourced from Planet X, not the local DB.
- API path, auth requirement, and response shape are unchanged — frontend needs zero changes.
- Error from Planet X propagates as a 502 or appropriate HTTP error.

---

### E8-06 — Migrate Seeded Records to Planet X IDs

**Goal:** Update existing `dealer_group` and `rooftop` records in the local DB (seeded in E7-02) to carry their Planet X native IDs in `external_group_id` / `external_uid`. This preserves audit history referential integrity for sessions created during the E7 (short-term) window.

**Required change (Manual + Xano DB):**
- For each seeded `dealer_group` record: populate `external_source = "planetx"`, `external_group_id = <px_id>`, `external_uid = "planetx:<px_id>"`.
- For each seeded `rooftop` record: populate matching external identifiers.
- Verify that `audit_session` records created during E7 still resolve correctly via `dealer_group_id` FK.

**Acceptance Criteria:**
- All `dealer_group` and `rooftop` records have `external_uid` populated.
- Existing `audit_session` records are unaffected.
- No data is deleted — local DB records are retained for audit trail.

---

## Sequencing

```
[E7 fully deployed]
        ↓
E8-01  Real Planet X auth function            ← unblocks E8-02, E8-03
E8-02  get_dealer_groups_from_planetx         ← unblocks E8-04
E8-03  get_rooftops_from_planetx              ← unblocks E8-05
E8-04  Swap GET /dealer-groups implementation
E8-05  Swap GET /rooftops implementation
E8-06  Migrate seeded records to Planet X IDs (can run in parallel with E8-04/E8-05)
```

**Agents to use:**
- E8-01, E8-02, E8-03: Xano Function Writer
- E8-04, E8-05: Xano API Query Writer
- E8-06: Manual Xano DB update

---

## What Does NOT Change in E8

| Layer | Status |
|---|---|
| React Native UI (`DealerGroupSelectionScreen`, `RooftopSelectionScreen`) | ✅ No changes needed |
| `AppContext` state management | ✅ No changes needed |
| `GET /dealer-groups` API path, auth, response shape | ✅ No changes needed |
| `GET /rooftops` API path, auth, response shape | ✅ No changes needed |
| `POST /audit/start-session` | ✅ No changes needed |
| `audit_session` and `scan` table schemas | ✅ No changes needed |

The frontend and API surface are fully insulated from the data source swap. This is the payoff of the abstraction layer established in E7.
