## Epic E7 — Dealer Group & Rooftop Selection (DB-Backed)

### Context

- **Why now:** Planet X dealer group and rooftop endpoints are not yet available. This epic unblocks the full FSM flow — Login → Pick Dealer Group → Pick Rooftop → Start Audit — by sourcing data from the Xano DB instead of Planet X.
- **Strategy:** Seed `dealer_group` and `rooftop` tables with hardcoded records. Build two lightweight DB-query endpoints. Activate and restyle the two selection screens already in the codebase (currently dormant, using mock data).
- **Not in scope:** Planet X integration, user-scoped group membership (`dealer_group_user` table removal is included), or admin CRUD for managing groups/rooftops.
- **Design system:** All UI work must use tokens from `prototype/src/theme.ts` (NXTG design system). No raw hex values allowed.
- **Sequencing:** Backend stories (E7-01 → E7-05) must complete before frontend stories (E7-06 → E7-10).

---

## Backend Stories

---

### E7-01 — Remove `dealer_group_user` Table

**Goal:** Delete the unused `dealer_group_user` join table. It was designed for user-scoped membership filtering but is not referenced anywhere in APIs, functions, or the frontend. Removing it reduces schema noise before Planet X integration is properly designed.

**Current state:** `tables/10_dealer_group_user.xs` exists with no downstream consumers.

**Required change (Xano Table Designer):**
- Delete `tables/10_dealer_group_user.xs`.
- Confirm no API, function, or addon references `dealer_group_user` before deletion.

**Acceptance Criteria:**
- File `tables/10_dealer_group_user.xs` is removed from the repo.
- All other tables, APIs, and functions are unaffected.
- Xano push completes without errors.

---

### E7-02 — Seed `dealer_group` and `rooftop` Tables

**Goal:** Insert hardcoded test records so the selection screens have real data to display. This replaces the `MOCK_DEALER_GROUPS` and `MOCK_ROOFTOPS` arrays in `prototype/src/constants.ts`.

**Current state:** Both tables exist in the schema but contain no records.

**Required change (Xano — manual data entry or seed script):**

Seed at minimum the following records:

`dealer_group`:
- `{ id: 1, name: "Friendly Auto Group", status: "active" }`
- `{ id: 2, name: "Metro Automotive Group", status: "active" }`

`rooftop`:
- `{ id: 1, dealer_group_id: 1, name: "Friendly Chevrolet – Downtown", status: "active" }`
- `{ id: 2, dealer_group_id: 1, name: "Valley Motors – East", status: "active" }`
- `{ id: 3, dealer_group_id: 2, name: "Metro Auto Group – North", status: "active" }`

**Acceptance Criteria:**
- Records are visible in Xano database browser.
- IDs match the values used in `MOCK_DEALER_GROUPS` / `MOCK_ROOFTOPS` constants (allows parallel frontend dev before API cutover).
- All seeded rooftops have `dealer_group_id` set correctly.

---

### E7-03 — `GET /dealer-groups` Endpoint

**Goal:** Return all active dealer groups from the DB so the Dealer Group Selection screen can render a real list.

**Required change (Xano API Query Writer):**
- Create `GET /dealer-groups` in the `audit` API group.
- Auth-protected (`auth = "user"`).
- Query `dealer_group` table where `status = "active"`, sorted by `name` ascending.
- Return: array of `{ id, name }` objects.

**Response example:**
```json
[
  { "id": 1, "name": "Friendly Auto Group" },
  { "id": 2, "name": "Metro Automotive Group" }
]
```

**Acceptance Criteria:**
- Returns 200 with an array (empty array when no active groups — not an error).
- Requires valid Bearer token; returns 401 without one.
- Only `active` status groups are returned; `inactive` / `suspended` are excluded.
- Response shape: `id` is an integer, `name` is a string.

---

### E7-04 — `GET /rooftops` Endpoint

**Goal:** Return rooftops for a selected dealer group so the Rooftop Selection screen can render a filtered list.

**Required change (Xano API Query Writer):**
- Create `GET /rooftops?dealer_group_id={id}` in the `audit` API group.
- Auth-protected (`auth = "user"`).
- Input: `int dealer_group_id` (required).
- Query `rooftop` table where `dealer_group_id = input` and `status = "active"`, sorted by `name` ascending.
- Return: array of `{ id, name, dealer_group_id }` objects.

**Response example:**
```json
[
  { "id": 1, "name": "Friendly Chevrolet – Downtown", "dealer_group_id": 1 },
  { "id": 2, "name": "Valley Motors – East", "dealer_group_id": 1 }
]
```

**Acceptance Criteria:**
- Returns 200 with array; empty array when no rooftops exist for that group.
- `dealer_group_id` is required; missing input returns 400.
- Requires valid Bearer token; returns 401 without one.
- Only `active` rooftops returned.
- Response `id` is an integer (not a string) — frontend types depend on this.

---

### E7-05 — Update `POST /audit/start-session` to Accept `dealer_group_id`

**Goal:** Persist the selected dealer group alongside the rooftop when a session starts, so scans are properly attributed to both.

**Current state:** `apis/audit/19_audit_start_session_POST.xs` accepts `rooftop_id` only. `dealer_group_id` on `audit_session` is never populated.

**Required change (Xano API Query Writer):**
- Add optional `int dealer_group_id?` to the endpoint input.
- Pass `dealer_group_id` into the `start_session` function call.
- Update `functions/start_session` to write `dealer_group_id` to the `audit_session` record.

**Acceptance Criteria:**
- `POST /audit/start-session` accepts `{ rooftop_id, dealer_group_id }`.
- `dealer_group_id` is stored on the created `audit_session` record.
- Field is optional — existing callers without `dealer_group_id` continue to work (backwards compatible).
- Existing tests for `start-session` remain passing.

---

## Frontend Stories

---

### E7-06 — Upgrade `AppContext` for Dynamic Dealer Group & Rooftop

**Goal:** Replace the hardcoded `rooftopId = 1` and `dealerGroupId = null` placeholders in `AppContext` with stateful setters so the selection screens can populate them at runtime.

**Current state:** `prototype/src/context/AppContext.tsx` has `const rooftopId = 1` and `const dealerGroupId = null` — both are fixed constants, not state.

**Required change (Frontend):**
- Convert `rooftopId` and `dealerGroupId` to `useState` with `null` as the initial value.
- Add `setRooftopId(id: number | null)` and `setDealerGroupId(id: number | null)` to the context interface and provider.
- Export both setters so `RooftopSelectionScreen` can call them after selection.
- Update `AppContextValue` interface to reflect the new types.
- `clearAuth` should also reset `rooftopId` and `dealerGroupId` to `null`.

**Acceptance Criteria:**
- `AppContext` exposes `rooftopId: number | null`, `dealerGroupId: number | null`, `setRooftopId`, `setDealerGroupId`.
- `StartSessionScreen` continues to read `rooftopId` from context — no changes needed there.
- `clearAuth` resets all four session/tenant values to `null`.
- No TypeScript errors.

---

### E7-07 — Dealer Group Selection Screen: NXTG Styles + Live API

**Goal:** Replace mock data and ad-hoc styles in `DealerGroupSelectionScreen` with a live API call to `GET /dealer-groups` and NXTG design tokens.

**Current state:** `prototype/src/screens/DealerGroupSelectionScreen.tsx` imports `MOCK_DEALER_GROUPS` from constants and uses raw hex/ad-hoc styles.

**Required change (Frontend):**
- On mount, fetch `GET /dealer-groups` using `authToken` from `AppContext`.
- Show a loading state (spinner) while fetching.
- Show an error state with a "Retry" button if the fetch fails.
- Render dealer group list using NXTG tokens (see design spec below).
- On tap, navigate to `RooftopSelection` passing `dealerGroupId` as a `number`.

**Design spec (NXTG tokens):**

| Element | Token |
|---|---|
| Screen background | `colors.neutral0` |
| Page title | `typography.display`, `fontColor.primary` |
| Subtitle | `typography.bodyLg`, `fontColor.secondary` |
| List item card | `backgroundColor: colors.white`, `borderColor: colors.neutral1`, `borderRadius: radius.sm`, `padding: spacing.md` |
| List item text | `typography.headingSm`, `fontColor.primary` |
| Chevron / arrow glyph | `fontColor.tertiary` |
| Empty state title | `typography.headingMd`, `fontColor.primary` |
| Empty state body | `typography.bodyMd`, `fontColor.secondary` |
| Error message | `typography.bodyMd`, `colors.error` |
| Retry button | secondary button style: `borderColor: colors.primary1000`, `colors.primary1000` text, `radius.sm`, height 52 |
| Gutter | `spacing.gutter` (24px) |

**Acceptance Criteria:**
- Screen fetches from `GET /dealer-groups`; no reference to `MOCK_DEALER_GROUPS`.
- Loading spinner shown during fetch.
- Empty state renders when API returns `[]`.
- Error state with Retry renders when fetch fails.
- All styles use `theme.ts` tokens — no raw hex values.
- Tapping a group navigates to `RooftopSelection` with the correct numeric `dealerGroupId`.

---

### E7-08 — Rooftop Selection Screen: NXTG Styles + Live API

**Goal:** Replace mock data and ad-hoc styles in `RooftopSelectionScreen` with a live API call to `GET /rooftops?dealer_group_id={id}` and NXTG design tokens. On selection, store the chosen rooftop and dealer group in `AppContext` before navigating to `StartSession`.

**Current state:** `prototype/src/screens/RooftopSelectionScreen.tsx` filters `MOCK_ROOFTOPS` client-side, uses ad-hoc styles, and navigates directly to `Scanning` (bypassing `StartSession`).

**Required change (Frontend):**
- On mount, fetch `GET /rooftops?dealer_group_id={dealerGroupId}` using `authToken`.
- Show loading state while fetching; error state with Retry on failure.
- Render rooftop list in a scrollable `FlatList` — each item selectable, selected item highlighted.
- On "Start Audit" press: call `setDealerGroupId(dealerGroupId)` and `setRooftopId(selectedId)` from `AppContext`, then `navigation.replace('StartSession')`.
- "Start Audit" button disabled until a rooftop is selected and not in a loading state.

**Design spec (NXTG tokens):**

| Element | Token |
|---|---|
| Screen background | `colors.neutral0` |
| Page title | `typography.display`, `fontColor.primary` |
| Subtitle | `typography.bodyLg`, `fontColor.secondary` |
| Rooftop item (unselected) | `backgroundColor: colors.white`, `borderColor: colors.neutral1`, `borderRadius: radius.sm`, `padding: spacing.md` |
| Rooftop item (selected) | `borderColor: colors.primary1000`, `backgroundColor: colors.primary100` |
| Rooftop item text | `typography.headingSm`, `fontColor.primary` |
| Selected checkmark | `colors.primary1000` |
| "Start Audit" button (enabled) | `backgroundColor: colors.primary1000`, `typography.labelLg`, `colors.white`, `radius.sm`, height 52 |
| "Start Audit" button (disabled) | `backgroundColor: colors.neutral1`, `colors.neutral3` text |
| Gutter | `spacing.gutter` (24px) |

**Acceptance Criteria:**
- Screen fetches from `GET /rooftops?dealer_group_id={id}`; no reference to `MOCK_ROOFTOPS`.
- Selected rooftop is visually highlighted.
- "Start Audit" disabled until selection is made.
- On confirm: `AppContext.dealerGroupId` and `AppContext.rooftopId` are set; navigation goes to `StartSession` (not directly to `Scanning`).
- All styles use `theme.ts` tokens.
- `RooftopSelection` nav param type updated to `{ dealerGroupId: number }` (integer, not string).

---

### E7-09 — Activate Navigation Flow: Login → Dealer Group → Rooftop

**Goal:** Make the full selection flow the live post-login path. After successful login, the app routes to `DealerGroupSelection` instead of `StartSession`.

**Current state:**
- `prototype/src/screens/LoginScreen.tsx` calls `navigation.replace('StartSession')` after login.
- `RootNavigator.tsx` comment marks `DealerGroupSelection` and `RooftopSelection` as "Phase 1: dormant".

**Required change (Frontend):**
- In `LoginScreen.tsx`: change the post-login navigation from `navigation.replace('StartSession')` to `navigation.replace('DealerGroupSelection')`.
- The open-session check path (navigate to `ResumeSession`) remains unchanged.
- In `RootNavigator.tsx`: remove the "Phase 1: dormant" comments from `DealerGroupSelection` and `RooftopSelection` screen entries.
- In `navigation/types.ts`: update `RooftopSelection` param type from `{ dealerGroupId: string }` to `{ dealerGroupId: number }`.

**Acceptance Criteria:**
- Successful login navigates to `DealerGroupSelection` (not `StartSession`).
- Existing open-session detection still routes to `ResumeSession` when an in-progress session exists.
- Back navigation from `RooftopSelection` returns to `DealerGroupSelection`.
- Back navigation from `DealerGroupSelection` is disabled (user cannot back-navigate to Login).
- No TypeScript errors.

---

### E7-10 — Update `StartSessionScreen` to Pass `dealer_group_id`

**Goal:** Now that `dealer_group_id` is set in `AppContext` from the selection flow, pass it to `POST /audit/start-session` so sessions are fully attributed.

**Current state:** `prototype/src/screens/StartSessionScreen.tsx` sends only `{ rooftop_id }` in the request body.

**Required change (Frontend):**
- Read `dealerGroupId` from `AppContext`.
- Include `dealer_group_id: dealerGroupId` in the `POST /audit/start-session` request body (alongside `rooftop_id`).

**Acceptance Criteria:**
- `POST /audit/start-session` request body includes `dealer_group_id` when set in context.
- If `dealerGroupId` is `null` (fallback), the field is omitted (backend accepts optional field — E7-05).
- No change to navigation or loading/error handling logic.

---

## Sequencing

```
E7-01  Remove dealer_group_user table
E7-02  Seed dealer_group + rooftop data
E7-03  GET /dealer-groups endpoint         ← unblocks E7-07
E7-04  GET /rooftops endpoint              ← unblocks E7-08
E7-05  Update start-session + dealer_group_id ← unblocks E7-10
E7-06  Upgrade AppContext                  ← unblocks E7-07, E7-08, E7-10
E7-07  DealerGroupSelectionScreen          ← requires E7-03 + E7-06
E7-08  RooftopSelectionScreen              ← requires E7-04 + E7-06
E7-09  Activate navigation flow            ← requires E7-07 + E7-08
E7-10  StartSessionScreen dealer_group_id  ← requires E7-05 + E7-06
```

**Agents to use:**
- E7-01: Xano Table Designer
- E7-02: Manual seed in Xano DB browser
- E7-03, E7-04, E7-05: Xano API Query Writer
- E7-06 → E7-10: Xano Frontend Developer
