# MVP Features (from ikon-lot-audit-tool mockup)

Breakdown of the MVP into features based on the current mockup flow and screens.

---

## 1. Authentication & access

- **Enterprise login:** FSM logs in with Ikon ID (SSO; Azure AD referenced in UI).
- **Field Support Manager Portal:** App is framed as authorized personnel only.
- **Logout:** Return to login from Rooftop Selection (and via Done from Session Complete).

*Screens: Login.*

---

## 2. Audit session setup (rooftop required)

- **Rooftop selection:** FSM selects one rooftop from a list (dropdown) before starting an audit. Required to start.
- **Back / navigation:** Can go back from Rooftop Selection to Login.
- **Continue:** Only enabled when a rooftop is selected; proceeds to Start Audit.

*Screens: Rooftop Selection.*

---

## 3. Start audit confirmation

- **Audit context summary:** Show rooftop (city + name), auditor (name, email), and current date/time.
- **Start Audit:** User confirms and starts the session (start time recorded).
- **Back:** Return to Rooftop Selection without starting.

*Screens: Start Audit.*

---

## 4. VIN capture

- **Scanner:** “Point scanner at VIN barcode and press the physical scan button” (device scan triggers VIN input).
- **Manual VIN entry:** Text input with placeholder example VIN; “Submit VIN” sends the value (normalized to uppercase).
- **VIN validation:** 17 characters; valid characters only (no I/O/Q); invalid format shows error message.

*Screens: Scanning.*

---

## 5. Real-time VIN → IMEI lookup

- **Lookup:** After a valid VIN is submitted, app calls lookup service (mock today; intended PlanetX).
- **Loading state:** Dedicated screen while lookup is in progress (e.g. “Looking up…” with VIN shown).
- **Result:** Vehicle info returned: VIN, IMEI (optional), dealer (optional), last report (optional), status, description, issue (optional).

*Screens: Loading (during lookup); then Status Display.*

---

## 6. Device status classification

- **OK:** Device installed, reporting, assigned to correct dealer.
- **Needs Attention:** Not installed, wrong dealer, not reporting, or customer linked; follow-up required.
- **Not Found:** VIN not found in system (e.g. new vehicle or data error).
- **Error:** Lookup failed (e.g. network); user can retry or skip vehicle.

*Screens: Status Display (status drives icon, color, and copy).*

---

## 7. Status display (per vehicle)

- **Status presentation:** Large status label with icon and color (OK = green, Needs Attention = orange, Not Found / Error = red).
- **Description:** Short text explaining the status.
- **Details:** VIN, IMEI (if present), dealer (if present), last report (if present), issue (if present).
- **Actions:** “Next Vehicle” (back to scanning); on Error, “Retry Lookup” and “Skip Vehicle”.

*Screens: Status Display.*

---

## 8. Scanning session UX

- **Scanned count:** Live count of vehicles scanned in this session.
- **Rooftop label:** Current rooftop shown on scanning screen.
- **Last scanned:** Summary of last VIN and its status (OK / Needs Attention / Not Found) below the scan area.
- **End Audit:** Button to end session; confirmation modal (“You scanned N vehicles. End audit?”) with End Audit and Cancel.

*Screens: Scanning.*

---

## 9. Audit metadata (session & vehicles)

- **Session:** Rooftop, auditor (name, email), start date/time, list of scanned vehicles.
- **Per vehicle:** VIN, IMEI (optional), dealer (optional), last report (optional), status, description, issue (optional).
- **Persistence:** In-memory in mockup; MVP backend to define storage and retention.

*Used across: Start Audit, Scanning, Status, Report.*

---

## 10. Audit report (summary & CSV)

- **Summary:** Rooftop, auditor, date; total scanned; counts and percentages for OK, Needs Attention, Not Found.
- **Download CSV:** “Download CSV Report” triggers report generation (mock delay); then navigates to Session Complete.
- **Start New Audit:** From Report screen, optionally start another audit (back to Rooftop Selection).

*Screens: Report.*

---

## 11. Session complete & next steps

- **Success state:** “Report downloaded successfully”; generated filename shown.
- **Next steps (copy):** Open email, attach CSV from Downloads, send to Regional Manager.
- **Actions:** “Open Email App” (mock), “Start New Audit”, “Done” (full reset to Login).

*Screens: Session Complete.*

---

## 12. Session lifecycle & navigation

- **Full reset (Done / Logout):** Session cleared; back to Login.
- **Start New Audit:** Session cleared; back to Rooftop Selection (no login again).
- **Flow:** Login → Rooftop Selection → Start Audit → Scanning ⇄ (Loading → Status Display) → End Audit → Report → Session Complete → Done or Start New.

---

## Feature-to-screen map

| Feature area              | Primary screen(s)        |
|---------------------------|--------------------------|
| Authentication & access   | Login                    |
| Rooftop required          | Rooftop Selection        |
| Start audit confirmation  | Start Audit              |
| VIN capture               | Scanning                 |
| Lookup + loading           | Loading                  |
| Status classification     | Status Display           |
| Status display + actions  | Status Display           |
| Session UX (count, end)    | Scanning                 |
| Audit metadata            | All (session state)      |
| Report summary + CSV       | Report                   |
| Session complete           | Session Complete         |
| Lifecycle / nav           | All                      |

---

## Out of scope in this mockup (for PRD alignment)

- Actual SSO integration (mock only).
- Real PlanetX API integration (mock lookup).
- Physical scanner hardware integration (UI assumes scan triggers VIN input).
- GPS / geo capture (not in current UI).
- Email sending from app (only “Open Email App” and instructions).
- Stored audit history or cloud retention (in-memory only in mockup).
- Resolved / not resolved tracking for exceptions.
- Dealer-facing or corporate dashboard.

---

**Source:** `ikon-lot-audit-tool` app (screens + `App.tsx` + `auditService.ts` + `types.ts`).  
**Last updated:** 2026-02-17
