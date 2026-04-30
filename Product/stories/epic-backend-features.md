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

---

## Frontend Rollover Stories (UI-15 → UI-22)

These stories cover applying the NXTG design system and the approved mockup layouts to the production screens in `prototype/src/screens/`. They consume — but do not redefine — the backend stories above.

---

### UI-15 — NXTG Design System Adoption

**Goal:** Centralize design tokens and apply them across all production screens so the prototype renders 1:1 with the mockup suite.

**Current state:** `prototype/mockup/theme.ts` exists and is consumed by every mockup. Production screens still contain ad-hoc inline hex values and one-off spacing.

**Required change (Frontend):**
- Promote `prototype/mockup/theme.ts` (or a copy) into a location consumable by `prototype/src/screens/`.
- Replace raw hex / spacing literals in production screens with token references.
- Load the Barlow font on web (already handled in mockup theme — extend to native via Expo Font if needed).

**Acceptance Criteria:**
- Zero raw hex color values in `prototype/src/screens/*.tsx` outside of theme imports.
- All cards, buttons, and surfaces use `radius.sm` / `radius.md` from theme.
- Web build renders Barlow; native fallback is system font (acceptable for MVP).

---

### UI-16 — Login Screen Visual Refresh

**Goal:** Replace the current login UI with the approved mockup layout.

**Current state:** Production login is a minimal form without branding or T&C affordance.

**Required change (Frontend):**
- Adopt the layout from `prototype/mockup/Login.mockup.tsx`: Toolbox Lot Audit logo, "Welcome Back" heading, username + password fields with inline icons, `LOGIN` primary button.
- **Excluded from prototype scope (deferred):**
  - T&C checkbox is **not rendered** (backend story E6-06 held; visual UI-22 was proposed and dropped).
  - FORGOT PASSWORD? button is **not rendered** (backend story E6-07 held; visual UI-23 was proposed and dropped).
- LOGIN button stays disabled until both username and password fields have values.

**Acceptance Criteria:**
- Production login matches `Login.mockup.tsx` for the in-scope elements (logo, heading, fields, primary button).
- T&C row and Forgot Password CTA are absent from the prototype.
- Disabled-state styling matches mockup (neutral-1 surface, neutral-3 text).
- Logo loads on web and native.

---

### UI-17 — Scanning Screen Tally Header

**Goal:** Show a live `Scanned · Pass · Exceptions` tally and rooftop name in the scanning header.

**Current state:** Scanning screen shows VIN input only; no running session totals visible.

**Required change (Frontend):**
- Adopt header pattern from `prototype/mockup/ScanningScreen.mockup.tsx`.
- Counts derived client-side from successive `/scan-vin` responses (no new backend call).
- Rooftop name sourced from `rooftop_name` (E6-05).
- Show last-scan status chip below the tally.

**Acceptance Criteria:**
- Scan, Pass, and Exception counts increment correctly across consecutive scans without any re-fetch.
- Rooftop name renders from session state, not a placeholder.
- Last-scan chip color matches result type (pass = primary, exception = error/warning/purple per type).

---

### UI-18 — Full-Bleed Scan Result Layout (Pass full styling + Exception placeholder)

**Goal:** Replace the modal-style scan result with the mockup's full-bleed Pass screen, and apply NXTG palette/typography only to the Exception screen as a visual placeholder pending UI-08.

**Current state:** Scan result is rendered as a small card; exception types are limited (4 supported).

**Required change (Frontend):**
- **Pass:** Adopt the full-bleed status block layout from `ScanResultPass.mockup.tsx` (primary1000 banner + content cards).
- **Exception (placeholder):** Apply NXTG tokens (palette, typography, radius, spacing) to the existing exception screen layout. **Do not** introduce per-type colors, do not rename existing types, do not add new types.
- Show required-action text prominently below the status block (per Epic E1 Story 1.2) using current copy.
- Supporting device details collapse below the action.
- **Held (out of scope; tracked under UI-08):** taxonomy rename (`customer_registered` → `customer_linked`), new `missing_device` detection, per-type color/icon mapping, and the 5-type `EXCEPTION_CONFIG` from the mockup. The exception screen is intentionally a placeholder until UI-08 is unheld.

**Acceptance Criteria:**
- Pass result uses `colors.primary1000` full-bleed block matching `ScanResultPass.mockup.tsx`.
- Exception result keeps current 4-type behavior; visuals use NXTG tokens but apply uniform palette (no per-type variation).
- Required-action text is visible above the fold on a typical phone viewport.
- No backend taxonomy changes, no new exception types, and no `EXCEPTION_CONFIG` import in this story.

---

### UI-19 — End Audit Confirm Summary Card

**Goal:** Show a 3-stat summary card (Scanned / Pass / Exceptions) on the End Audit Confirm screen.

**Current state:** End Audit Confirm shows a generic confirmation prompt.

**Required change (Frontend):**
- Adopt summary card layout from `EndAuditConfirm.mockup.tsx`.
- Use client-derived tally if E6-02 is not yet available; switch to E6-02 response when ready.
- Display rooftop name (E6-05) above the stats.

**Acceptance Criteria:**
- Counts shown match what the FSM saw on the Scanning screen the moment they tapped End.
- If E6-02 is wired, the values reconcile with the API response.
- Rooftop name renders correctly.

---

### UI-20 — Session Complete Vehicle List

**Goal:** Render the completed session's scan list with VIN + Make/Model/Year + status badge, filterable by pill.

**Current state:** Session Complete shows VIN + status only; no Make/Model/Year; pill filter not wired.

**Required change (Frontend):**
- Adopt list row layout from `SessionComplete.mockup.tsx`.
- Wire to `GET /audit/session-scans` (E6-03); show `make` / `model` / `year` (E6-01) below the VIN.
- Hook up pill filter (UI-11A) to slice the list by All / Pass / Exception.
- Preserve existing CSV download CTA.

**Acceptance Criteria:**
- List renders all scans for the session in chronological order.
- Pill filter correctly slices the list; counts in pills match.
- CSV download still works and reflects the unfiltered list (or current filter — TBD with product).
- Empty state renders gracefully when session has zero scans.

---

### UI-21 — Resume Session Status Breakdown

**Goal:** Show rooftop name + 3-stat breakdown (Scanned / Pass / Exceptions) on the Resume Session screen.

**Current state:** Resume Session shows scan_count only.

**Required change (Frontend):**
- Adopt summary card from `ResumeSession.mockup.tsx`.
- Wire `exception_count` from E6-04; derive `pass_count = scan_count - exception_count`.
- Display `rooftop_name` from E6-05.

**Acceptance Criteria:**
- Card matches mockup layout.
- Pass and Exception counts match persisted session state.
- Rooftop name renders from API, not a placeholder.

---

### UI-22 — Start Session Screen NXTG Application

**Goal:** Apply the NXTG design system to the existing Start Session screen so it visually aligns with the rest of the rollover, without requiring a separate mockup file.

**Current state:** `prototype/src/screens/StartSessionScreen.tsx` uses pre-rollover styling (off-palette colors, default system typography).

**Required change (Frontend):**
- Apply NXTG palette and typography directly to the existing Start Session layout.
- Reuse the card + primary CTA pattern established by `ResumeSession.mockup.tsx` and `EndAuditConfirm.mockup.tsx` (rooftop name in a bordered card above the primary `Start Audit` button).
- Display `rooftop_name` (E6-05) above the CTA when available; fall back gracefully to a generic title when missing.
- No separate `StartSession.mockup.tsx` is created — pattern is borrowed from existing mockups.

**Acceptance Criteria:**
- Start Session screen uses tokens from the shared `prototype/src/theme.ts` (no raw hex).
- Rooftop name renders from `rooftop_name` (E6-05); placeholder string used when null.
- Primary CTA matches the 52 px / `radius.sm` / `primary1000` button style used across the suite.
- No regressions to the existing Start Session navigation behavior.

---

## Sequencing Notes (Option C — Backend First)

Per the Mockup-to-Prototype Rollover plan, backend stories execute **before** the frontend rollover so the UI lands on real data the day it ships.

**Phase 1 — Backend (Xano specialized agents):**
1. **E6-05 — Rooftop Name Resolution** — unblocks rooftop name on Scanning, ResumeSession, EndAuditConfirm, SessionComplete, and StartSession headers.
2. **E6-04 — Resume Session exception_count** — unblocks Pass/Exception breakdown on Resume.
3. **E6-03 — Session Scan List** — unblocks SessionComplete vehicle list.
4. **E6-01 — VIN Decode (Make/Model/Year)** — enriches the SessionComplete row labels.
5. *(Deferred until Phase 2 of UX work)* **E6-02** — adopted opportunistically when Session Summary endpoint is consumed by UI-19.

**Phase 2 — Frontend rollover:**
6. **UI-15** — Extract shared `prototype/src/theme.ts`; refactor production screens off raw hex. Lands first since every other UI- story depends on it.
7. **UI-16** — Login visual refresh (T&C + Forgot Password excluded per stakeholder decision).
8. **UI-22** — Start Session NXTG application.
9. **UI-17 / UI-21 / UI-19** — Scanning header, Resume Session breakdown, End Audit summary (consume E6-04 + E6-05).
10. **UI-18** — Pass screen full styling, Exception screen placeholder (UI-08 held).
11. **UI-20** — Session Complete vehicle list (consumes E6-01 + E6-03).

**Held (not in this rollover):**
- **E6-06 / E6-07** — T&C tracking + Forgot Password backend.
- **UI-08 expansion** — 5-type exception taxonomy; UI-18 ships placeholder visuals only.
