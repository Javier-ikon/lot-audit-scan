## Epic E9 — VIN Scan Exception Classification Engine

### Context

- **Why this epic exists:** The core audit loop — scan a VIN, get a pass/exception result — currently has only partial exception logic. Three rules are already built (Not Reporting, Not Installed, Missing Device). This epic completes the classification engine with the remaining actionable exceptions that an FSM needs to flag during a lot audit, including a new **No Device** exception that surfaces revenue opportunities.
- **Business driver:** Every undetected exception is either a revenue miss (no device installed = no recurring subscription) or a compliance risk (vehicle at wrong rooftop, sold unit still on dealer lot). Accurate classification gives FSMs actionable information in real time.
- **What's already built (do not rebuild):**
  - `not_reporting` — last report > 24 h ago or null ✅
  - `missing_device` — `device_status.name` from Planet X contains "missing" ✅
  - `not_installed` — `company.name` **or** `group.name` contains `"Non Registrations"` (case-insensitive substring match on both fields) ✅
- **What this epic adds:** Three new exception rules + one schema cleanup + one rule fix (`not_installed` string and field scope correction).
- **Matching strategy:** Rooftop and dealer group names in Xano are manually copied from Planet X verbatim, making exact string comparison reliable for now. This approach is superseded when Planet X endpoints are integrated in E8.
- **Sequencing:** E9-01 (schema) must complete before E9-02 → E9-04. Backend stories before frontend stories.
- **Stories on hold (pending clarification):** `install_exception` trigger, `wrong_dealer` status. *(Non-Reg / No Sale fix resolved — see E9-06.)*

---

## Exception Classification Reference

| Exception | Enum Value | Signal | Is Exception | Revenue Action |
|---|---|---|---|---|
| Installed | `installed` | PX record found, all rules pass | ❌ | None |
| Not Reporting | `not_reporting` | `lastReported` null or > 24 h | ✅ | Check device health |
| No Device Associated | `no_device` | VIN returns no PX record at all | ✅ | **Install device — revenue opportunity** |
| Wrong Rooftop | `wrong_rooftop` | `px_data.group.name` ≠ `rooftop.name` | ✅ | Relocate or reassign vehicle |
| Customer Registered | `customer_registered` | `device_detail.CustomerName` or `FirstName`/`LastName` non-null | ✅ | Verify sale / transfer ownership |
| Not Installed | `not_installed` | `company.name` **or** `group.name` contains `"Non Registrations"` (case-insensitive) | ✅ | Install device |
| Missing Device | `missing_device` | PX `device_status.name` contains "missing" | ✅ | Recover/replace hardware |

---

## Pre-conditions

- [ ] E7 is fully deployed to Xano production
- [ ] `scan.device_status` enum update (E9-01) is pushed to Xano before any function changes
- [ ] Planet X `quality-control/devices` endpoint is accessible with a valid `$env.planetxDevice` token

---

## Backend Stories

---

### E9-01 — Update `scan.device_status` Enum

**Goal:** Add the `no_device` and `wrong_rooftop` values to the `scan` table enum. Remove the orphaned `customer_linked` and `wrong_dealer` values that have no defined business rule and do not appear in the audit report schema.

**Current state:** `tables/7_scan.xs` enum contains `customer_linked` and `wrong_dealer` (no rules defined for either) and is missing `no_device` and `wrong_rooftop`.

**Required change (Xano Table Designer):**
- Add `"no_device"` to the `device_status` enum values.
- Add `"wrong_rooftop"` to the `device_status` enum values.
- Remove `"customer_linked"` from the enum (not in audit report, no business rule).
- Remove `"wrong_dealer"` from the enum (not in audit report, on hold).
- Push schema change to Xano before any function changes.

**Acceptance Criteria:**
- Final enum values: `["installed", "not_installed", "wrong_rooftop", "not_reporting", "no_device", "customer_registered", "missing_device"]`
- No existing scan records break (no records should have `customer_linked` or `wrong_dealer` values yet).
- Xano push completes without errors.

---

### E9-02 — Implement No Device Exception in `scan_vin`

**Goal:** When a VIN lookup against Planet X returns no record (`$px_data == null`), classify the scan as `no_device` — not `missing_device`. This is a distinct exception: the vehicle has never had a device associated with it and represents a direct installation revenue opportunity.

**Current state:** `functions/9_scan_vin.xs` lines 273–283 classifies `$px_data == null` as `missing_device`. This conflates "no device ever installed" with "device hardware is gone."

**Required change (Xano Function Writer):**
- In `functions/9_scan_vin.xs`, change the `$px_data == null` branch:
  - Set `$classified_status = "no_device"` (was `"missing_device"`).
  - Set `$is_exception = true` (unchanged).
  - Set `required_action = "Install device — revenue opportunity"` on the scan record.
- The `missing_device` classification is now reserved exclusively for when Planet X returns a record but `device_status.name` contains "missing" (line 332 — unchanged).
- Update the `db.edit scan` block (lines 351–370) to also write `required_action` for the `no_device` case.

**Acceptance Criteria:**
- Scanning a VIN not found in Planet X → `device_status = "no_device"`, `is_exception = true`.
- `required_action` is set to `"Install device — revenue opportunity"` on the scan record.
- Scanning a VIN with a Planet X record where `device_status.name` contains "missing" → still `device_status = "missing_device"`.
- Session `total_exceptions` increments correctly.

---

### E9-03 — Implement Wrong Rooftop Exception in `scan_vin`

**Goal:** Flag a VIN when its Planet X group name does not match the rooftop selected for the current audit session.

**Current state:** No wrong rooftop check exists in `functions/9_scan_vin.xs`. The session's `rooftop_id` is fetched but `rooftop.name` is never compared to `px_data.group.name`.

**Required change (Xano Function Writer):**
- After the PX call succeeds (`$px_data != null`) and before the classification block, fetch the rooftop record:
  ```
  db.get rooftop { field_name = "id", field_value = $session.rooftop_id } as $rooftop
  ```
- Inside the classification block, add as **Rule 2** (evaluated before `not_installed` and `missing_device`):
  ```
  if ($px_classified == false && $px_data.group.name != $rooftop.name) →
    classified_status = "wrong_rooftop", is_exception = true, px_classified = true
  ```
- Set `required_action = "Vehicle registered to a different rooftop"` on the scan record.
- Matching is exact string comparison — names in Xano are copy-pasted verbatim from Planet X.

**Acceptance Criteria:**
- VIN whose `px_data.group.name` differs from the session rooftop's `name` → `device_status = "wrong_rooftop"`, `is_exception = true`.
- VIN whose `px_data.group.name` matches the session rooftop's `name` → rule does not fire; subsequent rules still evaluated.
- `required_action` is set on the scan record.
- Session `total_exceptions` increments correctly.
- `$rooftop` fetch failure is handled gracefully (wrap in try_catch; log warning; do not fail the scan).

---

### E9-04 — Implement Customer Registered Exception in `scan_vin`

**Goal:** Flag a VIN when its device is registered to a customer account in Planet X rather than remaining under the dealer. This means the vehicle has been sold and the device transferred to the customer.

**Planet X signal:** `device_detail.CustomerName`, `device_detail.FirstName`, `device_detail.LastName`, or `device_detail.DateSold` is non-null.

**Current state:** No customer registration check exists in `functions/9_scan_vin.xs`.

**Required change (Xano Function Writer):**
- Inside the classification block (`$px_data != null`), add as **Rule 3** (after `wrong_rooftop`, before `not_installed`):
  ```
  if ($px_classified == false &&
      ($px_data.device_detail.CustomerName != null ||
       $px_data.device_detail.FirstName != null ||
       $px_data.device_detail.DateSold != null)) →
    classified_status = "customer_registered", is_exception = true, px_classified = true
  ```
- Set `required_action = "Vehicle sold to customer — verify ownership transfer"` on the scan record.

**Acceptance Criteria:**
- VIN where `device_detail.CustomerName` or `FirstName` or `DateSold` is non-null → `device_status = "customer_registered"`, `is_exception = true`.
- VIN where all three fields are null → rule does not fire.
- `required_action` is set on the scan record.
- Session `total_exceptions` increments correctly.

---

### E9-06 — Fix `not_installed` Rule: Correct String and Field Scope

**Goal:** Correct the existing `not_installed` classification in `functions/9_scan_vin.xs` to use the verified Planet X string `"Non Registrations"` and confirm it checks **both** `company.name` and `group.name`.

**Background:** The original implementation was built with the string `"non-registration"` and the scope (company-only vs. company+group) was an open question. The Planet X API sample (confirmed May 2026) shows:
- `company.name = "World Car Auto Group Non Registrations"`
- `group.name = "World Car Auto Group Non Registrations"`

Both fields use the substring `"Non Registrations"` (title case, plural, no hyphen). The check must fire if **either** field contains this substring.

**Current state:** `functions/9_scan_vin.xs` — existing `not_installed` rule uses `"non-registration"` as the match string. Scope (company vs. company+group) unconfirmed.

**Required change (Xano Function Writer):**
- Locate the `not_installed` classification block in `functions/9_scan_vin.xs`.
- Replace the match string from `"non-registration"` → `"Non Registrations"` using a **case-insensitive substring match** (`string.contains` with case folding or `lower()` on both sides).
- Update the condition to check **both fields with OR logic**:
  ```
  if ($px_classified == false &&
      (string.contains(lower($px_data.company.name), "non registrations") ||
       string.contains(lower($px_data.group.name), "non registrations"))) →
    classified_status = "not_installed", is_exception = true, px_classified = true
  ```
- Set `required_action = "Vehicle in Non Registrations account — install device"` on the scan record.

**Acceptance Criteria:**
- VIN whose `company.name` contains `"Non Registrations"` (any case) → `device_status = "not_installed"`, `is_exception = true`.
- VIN whose `group.name` contains `"Non Registrations"` (any case) → same result.
- VIN where only one of the two fields matches → rule still fires.
- VIN where neither field matches → rule does not fire; subsequent rules evaluated.
- `required_action` is set on the scan record.
- Session `total_exceptions` increments correctly.
- Existing test cases for `not_installed` updated to use the corrected string.

---

## Frontend Stories

---

### E9-05 — Update ScanResult Screen to Display Exception Type and Action

**Goal:** The `ScanResult` screen currently shows a binary pass/exception state. Update it to display the specific exception type label and required action so the FSM knows exactly what to do next.

**Required change (Xano Frontend Developer):**
- Read `device_status` and `required_action` from the scan API response.
- Map `device_status` enum values to human-readable labels and colors:

| `device_status` | Label | Color treatment |
|---|---|---|
| `installed` | ✅ Pass | `colors.success` |
| `no_device` | 🔴 No Device — Install Opportunity | `colors.error` + revenue callout |
| `not_reporting` | 🟡 Not Reporting | `colors.warning` |
| `wrong_rooftop` | 🔴 Wrong Rooftop | `colors.error` |
| `customer_registered` | 🟠 Registered to Customer | `colors.warning` |
| `not_installed` | 🔴 Not Installed | `colors.error` |
| `missing_device` | 🔴 Missing Device | `colors.error` |

- Display `required_action` text below the exception label when non-null.
- For `no_device`: add a distinct visual callout (e.g. banner or highlighted card) — "Revenue Opportunity: Install a device on this vehicle."
- All styles must use `theme.ts` tokens — no raw hex values.

**Acceptance Criteria:**
- Exception type label is displayed for every scan result.
- `required_action` text is shown below the label when present.
- `no_device` scans render the revenue opportunity callout.
- Pass scans (`installed`) show green pass state — no exception detail section rendered.
- All styles use NXTG design tokens.

---

## Sequencing

```
E9-01  Update scan.device_status enum                    ← must run first; unblocks E9-02/03/04/06
E9-02  No Device exception (scan_vin)                    ← can run in parallel with E9-03, E9-04, E9-06
E9-03  Wrong Rooftop exception (scan_vin)                ← can run in parallel with E9-02, E9-04, E9-06
E9-04  Customer Registered exception (scan_vin)          ← can run in parallel with E9-02, E9-03, E9-06
E9-06  Fix not_installed rule — string + field scope     ← can run in parallel with E9-02, E9-03, E9-04
E9-05  ScanResult UI exception display                   ← requires E9-02 + E9-03 + E9-04 + E9-06
```

**Agents to use:**
- E9-01: Xano Table Designer
- E9-02, E9-03, E9-04, E9-06: Xano Function Writer
- E9-05: Xano Frontend Developer

---

## Stories on Hold

The following exceptions were identified but are **not in scope for E9** pending clarification:

| Exception | Blocker |
|---|---|
| Install Exception | Trigger condition not yet defined — unclear how it differs from `not_installed` |
| Wrong Dealer | Not present in audit report sheet — need to confirm if it rolls into Wrong Rooftop or is separate |

> **Resolved — Non-Reg / No Sale fix:** Confirmed via Planet X API sample (May 2026) that the check must cover **both** `company.name` and `group.name` using the string `"Non Registrations"`. See E9-06 for the implementation fix.

---

## What Does NOT Change in E9

| Component | Status |
|---|---|
| `validate_vin` function | ✅ No changes |
| `POST /audit/scan-vin` API endpoint | ✅ No changes — same input/output contract |
| `audit_session` table schema | ✅ No changes |
| NHTSA vPIC decode logic | ✅ No changes |
| Planet X API call in `scan_vin` | ✅ No changes — same request, same parsing |
| `not_reporting`, `not_installed`, `missing_device` rules | ✅ No changes (except `missing_device` scope narrows — see E9-02) |
