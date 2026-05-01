## Epic E10 — Multi-Exception Classification & Display

### Context

- **Why this epic exists:** The E9 classification engine uses a first-match-wins short-circuit (`$px_classified` flag) that stops evaluating rules the moment one exception fires. In practice a vehicle can trigger multiple exception conditions simultaneously — for example, a vehicle at the wrong rooftop whose device has also stopped reporting. Today the FSM only sees the highest-priority exception and misses the rest, leading to incomplete audit records and follow-up work that could have been resolved in a single visit.
- **Business driver:** Every missed secondary exception is a return trip for the FSM and an unresolved compliance or revenue issue. Surfacing all exceptions at scan time gives FSMs the complete picture to resolve the vehicle in one action.
- **What E9 built (do not rebuild):** All six exception rules and their classification logic in `functions/9_scan_vin.xs`. The rule definitions, strings, and field checks are correct — only the short-circuit behaviour and the schema for storing results changes.
- **What this epic adds:** Remove the short-circuit, collect all fired rules into an `exceptions` array, persist it, return it from the API, and update the `ScanResult` screen to display a simple list when multiple exceptions are found.
- **Sequencing:** E10-01 (schema) must complete before E10-02 (function). E10-02 must complete before E10-03 (UI).

---

## Multi-Exception Scenarios Reference

Combinations that can co-exist (both rules can fire independently):

| Primary Exception | Secondary Exception | Real-world cause |
|---|---|---|
| `wrong_rooftop` | `not_reporting` | Vehicle moved to wrong dealer; device also went silent |
| `wrong_rooftop` | `customer_registered` | Sold vehicle physically relocated to wrong rooftop |
| `customer_registered` | `not_reporting` | Sold vehicle; device stopped reporting after handover |
| `missing_device` | `wrong_rooftop` | Hardware removed; vehicle also at wrong location |

Mutually exclusive combinations (impossible by definition):

| Exception | Why it cannot combine |
|---|---|
| `no_device` + anything | No PX record means no other rules have data to evaluate |
| `not_installed` + `not_reporting` | Non Registrations account has no active device to report |

---

## Pre-conditions

- [ ] E9 is fully deployed to Xano production (all six rules active)
- [ ] `scan.device_status` enum is final (E9-01 complete)
- [ ] No existing scan records have `exceptions` data — new field, safe to add

---

## Backend Stories

---

### E10-01 — Add `exceptions` Array Field to `scan` Table

**Goal:** Add a new `exceptions` field to the `scan` table to store all exception types that fired for a given scan, not just the primary one.

**Current state:** `tables/7_scan.xs` has `device_status` (single enum) and `required_action` (text). There is no field for multiple exception values.

**Required change (Xano Table Designer):**
- Add field `exceptions` of type `text[]` (array of text) to the `scan` table.
- Field is nullable — pass scans (`device_status = "installed"`) will have `exceptions = null` or `[]`.
- No changes to the existing `device_status` enum or any other field.
- Push schema change to Xano before any function changes.

**Acceptance Criteria:**
- `scan` table contains an `exceptions` text-array field.
- Existing scan records are unaffected (field is null for all pre-existing rows).
- Xano push completes without errors.

---

### E10-02 — Remove Short-Circuit from `scan_vin`; Collect All Exceptions

**Goal:** Change the classification block in `functions/9_scan_vin.xs` to evaluate every rule independently and collect all fired exceptions into an array, rather than stopping at the first match.

**Current state:** `functions/9_scan_vin.xs` uses a `$px_classified` boolean flag. Once any rule sets `$px_classified = true`, all subsequent `if ($px_classified == false && ...)` conditions skip. Only one exception is ever recorded per scan.

**Required change (Xano Function Writer):**

1. **Replace `$px_classified`** with an `$exceptions` array variable initialised to `[]`.

2. **Change every rule** from a short-circuit guard (`$px_classified == false &&`) to an **independent condition** that appends to the array when it fires. Example for Rule 1:
   ```
   // Rule 1: Not Reporting
   if ($px_data.lastReported == null || $px_data.lastReported < $cutoff_24h) {
     var.update $exceptions { value = $exceptions|push:"not_reporting" }
     var.update $is_exception { value = true }
   }
   ```

3. **Set `$classified_status`** to the highest-severity exception in `$exceptions` after all rules have evaluated, using this priority order:
   ```
   no_device > missing_device > not_installed > wrong_rooftop > customer_registered > not_reporting
   ```
   If `$exceptions` is empty, `$classified_status` remains `"installed"`.

4. **Set `$required_action`** from the primary (highest-severity) exception — same strings as E9, no change.

5. **Persist `exceptions`** in both `db.edit scan` blocks (PX record found and no PX record):
   ```
   exceptions: $exceptions
   ```

6. **Return `exceptions`** in the `$scan_data` response object alongside the existing `device_status` and `required_action` fields.

7. **`no_device` branch** (`$px_data == null`) is unchanged in outcome — it sets `$exceptions = ["no_device"]` and returns immediately without evaluating the PX rules.

**Session tally (`total_exceptions`) is unchanged** — increments by 1 per scan vehicle regardless of how many exceptions fired.

**Acceptance Criteria:**
- A VIN that triggers `wrong_rooftop` AND `not_reporting` → `device_status = "wrong_rooftop"`, `exceptions = ["wrong_rooftop", "not_reporting"]`, `is_exception = true`.
- A VIN that triggers only one rule → `device_status` = that rule, `exceptions = ["that_rule"]` — identical outcome to E9 for single-exception vehicles.
- A pass scan → `device_status = "installed"`, `exceptions = []`, `is_exception = false`.
- `no_device` VIN → `device_status = "no_device"`, `exceptions = ["no_device"]`.
- `total_exceptions` increments by 1 per scan vehicle, not per exception count.
- API response includes `exceptions` array field.

---

## Frontend Stories

---

### E10-03 — Update `ScanResult` Screen to Display Exception List

**Goal:** When a scan returns multiple exceptions, replace the single "Action Required" card with a flat, scrollable list of exception rows — one per exception — so the FSM sees every issue and knows exactly what to do for each.

**Current state:** `prototype/src/screens/ScanResultScreen.tsx` reads a single `device_status` and renders one `actionCard`. There is no handling for an `exceptions` array.

**Required change (Xano Frontend Developer):**

1. **Read `exceptions`** from the scan API response:
   ```ts
   const exceptions = (scan?.exceptions as string[]) ?? [];
   const isMultiException = exceptions.length > 1;
   ```

2. **Status block subtitle** — conditional on exception count:
   - 1 exception: current behaviour — show `exceptionLabel` (e.g. "Wrong Rooftop"). No change.
   - 2+ exceptions: show `"{N} issues found for this vehicle"` instead of the type label.

3. **Exception list** — replaces the single `actionCard` when `isMultiException` is true:
   - Section label: "Exceptions Found"
   - One row per item in `exceptions` array, ordered as returned by the API (highest severity first)
   - Each row: exception name (from `EXCEPTION_LABELS`) + action text (from `EXCEPTION_GUIDANCE` / `required_action`)
   - Divider between rows
   - No per-row colour coding — keep it clean, single style for all rows

4. **Single exception path** — when `exceptions.length <= 1`, render the existing `actionCard` exactly as today. No visual change for single-exception scans.

5. **`no_device` revenue callout** — render above the exception list when `isNoDevice` is true. Unchanged.

6. **Details card** (VIN, Serial, Company, Group, Last Report) — unchanged, always shown below the exception list.

7. **`EXCEPTION_LABELS` and `EXCEPTION_GUIDANCE`** maps already cover all six exception types — no additions needed.

**Acceptance Criteria:**
- Single-exception scan renders identically to E9-05 — no regression.
- Multi-exception scan: status block shows count subtitle; exception list renders one row per exception; details card unchanged; CTAs unchanged.
- Pass scan shows green pass state — no exception section rendered.
- All styles use existing `theme.ts` tokens — no raw hex values.

---

## Screen Layout Reference (Multi-Exception)

```
┌──────────────────────────────────────┐
│  Ikon Lot Audit   48 scanned · 7 ex  │  ← header (unchanged)
├──────────────────────────────────────┤
│              ⚠  EXCEPTION            │
│   2 issues found for this vehicle    │  ← count subtitle (new)
├──────────────────────────────────────┤
│  Exceptions Found                    │  ← section label
│  ─────────────────────────────────── │
│  ⚠ Wrong Rooftop                    │
│    Vehicle registered to a different │
│    rooftop. Verify with manager.     │
│  ─────────────────────────────────── │
│  ⚠ Not Reporting                    │
│    Device has not reported in 24 h.  │
│    Flag for service inspection.      │
├──────────────────────────────────────┤
│  VIN           3VWF...001            │
│  Serial        869181...             │  ← details card (unchanged)
│  Company       Friendly Chev...      │
│  Last Report   3 days ago            │
├──────────────────────────────────────┤
│         [ Next vehicle → ]           │
│         [ End audit ]                │
│           Delete this scan           │
└──────────────────────────────────────┘
```

---

## Sequencing

```
E10-01  Add exceptions[] field to scan table      ← must run first
E10-02  Remove short-circuit; collect exceptions   ← requires E10-01
E10-03  ScanResult multi-exception UI              ← requires E10-02
```

**Agents to use:**
- E10-01: Xano Table Designer
- E10-02: Xano Function Writer
- E10-03: Xano Frontend Developer

---

## What Does NOT Change in E10

| Component | Status |
|---|---|
| Exception rule definitions and match strings | ✅ No changes — E9 rules are correct |
| `scan.device_status` enum values | ✅ No changes |
| `POST /audit/scan-vin` API endpoint contract | ✅ Additive only — `exceptions` field added to response |
| Session `total_exceptions` tally logic | ✅ No changes — 1 vehicle = 1 exception event |
| Pass scan behaviour | ✅ No changes |
| `no_device` revenue callout | ✅ No changes |
