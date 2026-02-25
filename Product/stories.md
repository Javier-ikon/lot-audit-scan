# Ikon Lot Scan (Lot Audit) — Stories

**Source:** Product/prd.md only. No assumptions added. Where the PRD does not specify a value, the field is left blank.

**Prioritization:** RICE was requested; the PRD does not provide Reach, Impact, Confidence, or Effort. Stories are ordered by **workflow dependency** (top = highest priority, bottom = least in flow): 1) Login → 2) Rooftop/Session → 3) Scan VIN → 4) Lookup → 5) Status/Actions → 6) Report. RICE scores can be added when available.

---

# Story 1 (Highest priority)

## Story Header 🔴

**Title:** Log in once via SSO and reach rooftop selection  
**Initiative/PRD:** Ikon Lot Scan (Lot Audit) — Product/prd.md  
**Status:** Backlog  
**Owner:**  
**Created:**  
**Last Updated:**  

**PRD reference:** FR-001, §9 In Scope (Prepare for audit), §7 User Stories

---

### 1. Context and Background 🟡

**Why now:**  
**Related problem/opportunity:** PRD §2 — Prepare for audit: FSM logs into three separate systems (PlanetX, Dealer Portal, Ikon Toolbox), multiple login credentials, slow system load times, non-mobile-friendly interface.  
**User research or data:**  

---

### 2. User Story 🔴

As a Field Support Manager (FSM),  
I want to log in once (SSO),  
So that I don't use multiple credentials.

---

### 3. Acceptance Criteria 🔴

**From PRD FR-001:** User reaches rooftop selection without separate logins.

- Given the FSM is on the login screen, When the FSM completes SSO authentication, Then the FSM reaches the rooftop selection screen without logging into other systems.
- Given the FSM is authenticated, When the FSM opens the app, Then the FSM does not need to enter credentials for PlanetX, Dealer Portal, or Ikon Toolbox separately.

**Logging:**  
**Metrics:**  
**Counter measures:**  

---

### Tech notes and links 🟡

PRD §10.1 Dependencies: SSO integration.

---

### QA and Verification 🟡

**How to test:**  
**Edge cases or errors:**  
**Out of scope for QA:**  

---

# Story 2

## Story Header 🔴

**Title:** Select rooftop and start or stop audit session  
**Initiative/PRD:** Ikon Lot Scan (Lot Audit) — Product/prd.md  
**Status:** Backlog  
**Owner:**  
**Created:**  
**Last Updated:**  

**PRD reference:** FR-002, §9 In Scope (Prepare for audit), §7 User Stories

---

### 1. Context and Background 🟡

**Why now:**  
**Related problem/opportunity:** PRD §2 — Prepare for audit: FSM navigates to records and prepares a spreadsheet for manual data entry; need single application and clear session start/stop.  
**User research or data:**  

---

### 2. User Story 🔴

As a Field Support Manager (FSM),  
I want to select a rooftop and start an audit,  
So that all scans are tied to the right location.

---

### 3. Acceptance Criteria 🔴

**From PRD FR-002:** Rooftop required to start; session has start/stop.

- Given the FSM is on the rooftop selection screen, When the FSM selects a rooftop and confirms start, Then an audit session starts and is associated with that rooftop.
- Given an audit session is in progress, When the FSM chooses to end the audit, Then the session stops (with confirmation per PRD 8-step workflow).
- Given the FSM has not selected a rooftop, When the FSM attempts to start an audit, Then the system does not allow starting until a rooftop is selected.

**Logging:**  
**Metrics:**  
**Counter measures:**  

---

### Tech notes and links 🟡

PRD §10.1 Dependencies: None.

---

### QA and Verification 🟡

**How to test:**  
**Edge cases or errors:**  
**Out of scope for QA:**  

---

# Story 3

## Story Header 🔴

**Title:** Scan VIN (barcode, QR, or manual entry) with validation  
**Initiative/PRD:** Ikon Lot Scan (Lot Audit) — Product/prd.md  
**Status:** Backlog  
**Owner:**  
**Created:**  
**Last Updated:**  

**PRD reference:** FR-003, §9 In Scope (Locate vehicle & identify VIN), §7 User Stories

---

### 1. Context and Background 🟡

**Why now:**  
**Related problem/opportunity:** PRD §2 — Locate vehicle & identify VIN: FSM manually reads 17-character VIN and types into laptop; pain points include VIN typing errors (O vs 0, I vs 1), difficulty reading VINs (dirty windshields, glare), slow manual entry.  
**User research or data:**  

---

### 2. User Story 🔴

As a Field Support Manager (FSM),  
I want to scan VIN (barcode, QR, or manual entry),  
So that I capture VIN without manual typing errors.

---

### 3. Acceptance Criteria 🔴

**From PRD FR-003:** VIN captured; invalid format rejected (e.g. 17 chars, no I/O/Q).

- Given the FSM is in an active audit session, When the FSM scans a VIN barcode or QR code, Then the VIN is captured and submitted for lookup.
- Given the FSM is in an active audit session, When the FSM enters a VIN manually, Then the VIN is accepted if it meets validation (e.g. 17 characters, no I/O/Q per PRD) and rejected otherwise.
- Given an invalid VIN format is entered or scanned, When the system validates, Then the VIN is rejected and the user is informed.

**Logging:**  
**Metrics:** PRD §5 / §10.2: Barcode/QR scan success >95% (manual entry <5%).  
**Counter measures:**  

---

### Tech notes and links 🟡

PRD §10.1 Dependencies: Scanner / manual input.

---

### QA and Verification 🟡

**How to test:**  
**Edge cases or errors:**  
**Out of scope for QA:**  

---

# Story 4

## Story Header 🔴

**Title:** Real-time VIN → IMEI lookup and display device status  
**Initiative/PRD:** Ikon Lot Scan (Lot Audit) — Product/prd.md  
**Status:** Backlog  
**Owner:**  
**Created:**  
**Last Updated:**  

**PRD reference:** FR-004, §9 In Scope (Look up device status), §7 User Stories

---

### 1. Context and Background 🟡

**Why now:**  
**Related problem/opportunity:** PRD §2 — Look up device status: FSM searches VIN in PlanetX, cross-references Dealer Portal, checks Ikon Toolbox; pain points include slow navigation across three systems, internet connectivity issues.  
**User research or data:**  

---

### 2. User Story 🔴

As a Field Support Manager (FSM),  
I want the system to look up VIN → device status in real time,  
So that I don't switch between three systems.

---

### 3. Acceptance Criteria 🔴

**From PRD FR-004:** Status shown after scan; no switching to other systems.

- Given a valid VIN has been captured, When the system performs lookup, Then the system retrieves VIN → IMEI and device status in real time and displays the result.
- Given the lookup completes, When the result is displayed, Then the FSM does not need to switch to PlanetX, Dealer Portal, or Ikon Toolbox to see device status.
- Given the lookup is in progress, When the FSM is waiting, Then a loading or progress state is shown until the result is displayed.

**Logging:**  
**Metrics:**  
**Counter measures:**  

---

### Tech notes and links 🟡

PRD §10.1 Dependencies: PlanetX (or equivalent) API. PRD §17 Open Questions: Does PlanetX expose API with required fields?

---

### QA and Verification 🟡

**How to test:**  
**Edge cases or errors:**  
**Out of scope for QA:**  

---

# Story 5

## Story Header 🔴

**Title:** Classify device status and display required action per type  
**Initiative/PRD:** Ikon Lot Scan (Lot Audit) — Product/prd.md  
**Status:** Backlog  
**Owner:**  
**Created:**  
**Last Updated:**  

**PRD reference:** FR-005, §9 In Scope (Identify exception or pass), §7 User Stories

---

### 1. Context and Background 🟡

**Why now:**  
**Related problem/opportunity:** PRD §2 — Identify exception or pass: FSM manually reviews device status across three systems; pain points include inconsistent classification criteria, human error in status determination, no standardized exception definitions, unclear next actions.  
**User research or data:**  

---

### 2. User Story 🔴

As a Field Support Manager (FSM),  
I want to see device status and required action,  
So that I know if it's a pass or exception and what to do.

---

### 3. Acceptance Criteria 🔴

**From PRD FR-005:** Correct status and action per type.

- Given device status has been retrieved, When the system classifies the status, Then the status is one of: Installed, Not Installed, Wrong Dealer, Not Reporting, Customer Linked/Registered, Missing Device (per [status-classification-rules.md](./status-classification-rules.md)).
- Given a status is displayed, When the FSM views the result, Then the required action for that status type is displayed.
- Given the FSM has seen the status and action, When the FSM continues, Then the FSM can proceed to the next vehicle (per 8-step workflow).

**Logging:**  
**Metrics:**  
**Counter measures:**  

---

### Tech notes and links 🟡

PRD §10.1 Dependencies: None. Classification logic implemented in logic layer per [status-classification-rules.md](./status-classification-rules.md).

---

### QA and Verification 🟡

**How to test:**  
**Edge cases or errors:**  
**Out of scope for QA:**  

---

# Story 6 (Lowest priority in flow)

## Story Header 🔴

**Title:** Generate standardized CSV report and download at session end  
**Initiative/PRD:** Ikon Lot Scan (Lot Audit) — Product/prd.md  
**Status:** Backlog  
**Owner:**  
**Created:**  
**Last Updated:**  

**PRD reference:** FR-006, §9 In Scope (Complete audit & generate report), §7 User Stories

---

### 1. Context and Background 🟡

**Why now:**  
**Related problem/opportunity:** PRD §2 — Complete audit & generate report: FSM manually compiles data from three systems into a spreadsheet, formats report, calculates exception counts, emails to Field Support and Corporate; pain points include time-consuming manual report creation, inconsistent report formats, data entry errors, manual email distribution.  
**User research or data:**  

---

### 2. User Story 🔴

As a Field Support Manager (FSM),  
I want to end the audit and download a standardized CSV report,  
So that I don't manually compile and email.

---

### 3. Acceptance Criteria 🔴

**From PRD FR-006:** Report downloadable at end of audit.

- Given the FSM has ended the audit session (with confirmation per PRD 8-step workflow), When the system generates the report, Then the system produces a standardized CSV report with all vehicle data and a summary.
- Given the report is ready, When the FSM chooses to download, Then the FSM can download the report at session end.
- Given the report includes vehicle data and summary, When the FSM or recipient opens it, Then the format is standardized (CSV) with 30 columns per [csv-report-schema.md](./csv-report-schema.md).

**Logging:**  
**Metrics:**  
**Counter measures:**  

---

### Tech notes and links 🟡

PRD §10.1 Dependencies: None.

---

### QA and Verification 🟡

**How to test:**  
**Edge cases or errors:**  
**Out of scope for QA:**  

---

**End of stories.** Last updated from PRD: 2026-02-17.
