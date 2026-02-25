# Product Requirements Document (PRD) Template

> **📌 REQUIREMENT KEY:**  
> 🔴 **Hard Requirement** — Must be completed before the PRD can move to Review/Approved status. Stakeholders will block without these.  
> 🟡 **Soft Requirement** — Recommended for a complete PRD. Can be filled with best estimates and refined during discovery/development. Mark unknowns as "TBD" with an owner and due date.

---

## **📋 Document Header** 🔴

```
Product Name: Ikon Lot Scan (Lot Audit)
Version: 2.0
Last Updated: 2026-02-17
Status: [Discovery / In Progress / Review / Approved]
Owner: [Product Manager name]
Stakeholders: [List key stakeholders]
```

*Source: Product/lean-canva.md. No assumptions added.*

---

## **1. Executive Summary** 🔴

**Instructions:** Write a 2-3 paragraph overview. Answer: What are we building? Why does it matter? What's the expected impact?

- **What:** A standardized lot audit tool: FSM logs in once (SSO), selects rooftop, scans VINs (barcode/QR or manual), gets real-time VIN → IMEI lookup and device status with defined actions, and downloads a standardized CSV report at session end. One rugged device replaces three systems (PlanetX, Dealer Portal, Ikon Toolbox).
- **Why:** Today FSM logs into three separate systems, manually reads and types VINs, switches between systems for device status, and manually compiles and emails reports. This is error-prone, slow, and inconsistent. The Lean Canvas validates this as worth building.
- **Impact:** (From Lean Canvas.) Operational efficiency: 58% reduction in audit time (4 hours → 1.7 hours per dealership). Productivity gain: 2.4x more audits per FSM per day. Revenue protection: identify exceptions faster (save 2.75 min per exception). Better install penetration via standardized exception tracking. Risk reduction: fewer errors, reduced laptop/vehicle damage.
- **Ask:** [What decision or approval are you seeking?]

---

## **2. Problem Statement** 🔴

*Source: Lean Canvas §1 (Problem), §2 (Customer Segments). No assumptions added.*

**What problem are we solving?**

Problems by workflow stage (current state):

1. **Prepare for audit:** FSM logs into three separate systems (PlanetX, Dealer Portal, Ikon Toolbox), navigates to records, and prepares a spreadsheet for manual data entry.
2. **Locate vehicle & identify VIN:** FSM walks to the vehicle, manually reads the 17-character VIN from the windshield or door jamb, and types it into a laptop.
3. **Look up device status:** FSM searches for the VIN in PlanetX, cross-references it in Dealer Portal, then checks Ikon Toolbox for device status—switching between all three systems.
4. **Identify exception or pass:** FSM manually reviews device status across the three systems, decides if it's a pass or exception, then writes notes or updates a spreadsheet.
5. **Complete audit & generate report:** FSM manually compiles data from the three systems into a spreadsheet, formats the report, calculates exception counts, and emails it to Field Support and Corporate.

**Pain points (from Lean Canvas):**
- **Prepare:** Juggling a laptop while walking the lot; multiple login credentials; risk of dropping the laptop; slow system load times; non-mobile-friendly interface.
- **VIN capture:** VIN typing errors (e.g. O vs 0, I vs 1); difficulty reading VINs (dirty windshields, glare); slow manual entry; balancing a laptop while typing; re-typing after errors.
- **Lookup:** Slow navigation across three systems; internet connectivity issues on the laptop.
- **Exception/pass:** Inconsistent classification criteria; human error in status determination; no standardized exception definitions; unclear next actions.
- **Report:** Time-consuming manual report creation; inconsistent report formats; data entry errors; no visual summary (e.g. map with exception pins); manual email distribution.

**Who experiences this problem?**
- Ikon Field Support Managers (FSMs) performing lot audits across 450 dealerships.
- Early adopters: Field Support in two pilot markets (specific markets to be defined).

**Scale (from Lean Canvas):**
> **⚠️ Note:** These are rough estimates based on business operations feedback.
- ~450 dealerships in Ikon's network; ~135 vehicles per dealership (average); total fleet ~60,750 vehicles under management; ~15% exception rate (devices with issues requiring attention).

**Existing alternatives (from Lean Canvas):**
- Manual lookups and data entry across PlanetX, Dealer Portal, and Ikon Toolbox.
- Ad-hoc audit processes using laptops; no single standardized workflow or reporting.

**How do we know this is a real problem?** *(Validate, don't assume)*
- [ ] User research conducted (interviews, surveys, observations)
- [ ] Data analysis shows impact (metrics, reports)
- [ ] Stakeholder feedback collected
- [ ] Competitive analysis completed

**Quantify the problem:** *(Only where Lean Canvas provides numbers.)*
> **⚠️ Note:** These are rough estimates based on business operations feedback. See Section 3 for validation plan.
- Baseline (from Lean Canvas): ~135 vehicles per dealership (average); ~15% exception rate; time per normal vehicle ~1–2 min (avg ~1.5 min); time per exception vehicle ~2–5 min (avg ~3.5 min); time per audit ~242.5 minutes (~4 hours per dealership).

**What happens if we don't solve this?**
- [Impact on business — to be filled when validated]
- [Impact on users — to be filled when validated]
- [Impact on customers — to be filled when validated]

---

## **🚨 3. Assumption Validation Tracker** 🔴

*Quantitative claims from Lean Canvas only. Each must be validated.*

| Assumption | Status | Validation Method | Owner | Due Date | Result |
|------------|--------|-------------------|-------|----------|--------|
| 135 vehicles per dealership (average) | ❓ Unvalidated | [How you'll validate] | [Name] | [YYYY-MM-DD] | [Result] |
| 15% exception rate | ❓ Unvalidated | [How you'll validate] | [Name] | [YYYY-MM-DD] | [Result] |
| Time per normal vehicle 1.5 min (current) | ❓ Unvalidated | [How you'll validate] | [Name] | [YYYY-MM-DD] | [Result] |
| Time per exception vehicle 3.5 min (current) | ❓ Unvalidated | [How you'll validate] | [Name] | [YYYY-MM-DD] | [Result] |
| Time per audit ~4 hours per dealership (current) | ❓ Unvalidated | [How you'll validate] | [Name] | [YYYY-MM-DD] | [Result] |
| 58% reduction in audit time (4h → 1.7h) | ❓ Unvalidated | [How you'll validate] | [Name] | [YYYY-MM-DD] | [Result] |
| Scan time 45 seconds per vehicle (MVP target) | ❓ Unvalidated | [How you'll validate] | [Name] | [YYYY-MM-DD] | [Result] |
| 2.4x more audits per FSM per day | ❓ Unvalidated | [How you'll validate] | [Name] | [YYYY-MM-DD] | [Result] |
| Save 2.75 min per exception vs. manual | ❓ Unvalidated | [How you'll validate] | [Name] | [YYYY-MM-DD] | [Result] |
| Barcode/QR scan success >95% | ❓ Unvalidated | [How you'll validate] | [Name] | [YYYY-MM-DD] | [Result] |

**Legend:**
- ❓ **Unvalidated** - Assumption not yet tested
- 🔄 **In Progress** - Currently validating
- ✅ **Validated** - Confirmed with data/research
- ❌ **Invalidated** - Assumption proven wrong

---

## **4. Quantification Requirements** 🔴

*Source: Lean Canvas §8 (Key Metrics), §6 (Value Delivered). No assumptions added.*

> **⚠️ DISCLAIMER:** All baseline and target metrics below are **rough estimates** based on business operations feedback and have not yet been validated with formal data collection. Values are marked with **~** to indicate approximation. See Section 3 (Assumption Validation Tracker) for validation plan.

### **Current State (Baseline) — from Lean Canvas:**
- **Vehicles per dealership:** ~135 (average).
- **Exception rate:** ~15% (~20 exception vehicles, ~115 normal vehicles per audit).
- **Time per normal vehicle:** ~1–2 min (avg ~1.5 min) — manual VIN entry + lookup.
- **Time per exception vehicle:** ~2–5 min (avg ~3.5 min) — manual VIN entry + troubleshooting across 3 systems.
- **Time per audit:** ~242.5 minutes (~4 hours per dealership): normal ~115 × ~1.5 min = ~172.5 min; exception ~20 × ~3.5 min = ~70 min.
- **How was this measured?** [To be filled when validated.]
- **Sample size / variance:** [To be filled when validated.]

### **Target State (Goal) — from Lean Canvas:**
- **Scan time per vehicle:** ~45 seconds (~0.75 min) for all vehicles.
- **Time per audit:** ~101.25 minutes (~1.7 hours per dealership): all ~135 vehicles × ~0.75 min = ~101.25 min.
- **Time savings:** ~141.25 minutes per audit (~58% reduction).
- **Productivity gain:** ~2.4x more audits per FSM per day (~4 hours → ~1.7 hours per audit).
- **Per vehicle:** Pass/normal save ~45 seconds per scan (~1.5 min → ~0.75 min); exception save ~2.75 minutes per scan (~3.5 min → ~0.75 min).

### **Impact Calculation (from Lean Canvas):**
```
Current: ~242.5 min per audit
Target:  ~101.25 min per audit
Savings: ~141.25 min per audit (~58% reduction)
```

**Break down to per-unit economics:** [Not in Lean Canvas — to be filled when validated.]
- Revenue recovery per rooftop: [Your answer]
- Cost savings per FSM: [Your answer]
- Time savings per audit: 141.25 minutes (from Lean Canvas)

---

## **5. Goals & Success Metrics** 🔴

**Instructions:** Define what success looks like. Use SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound). *Source: Lean Canvas §8, §6. No assumptions added.*

> **⚠️ DISCLAIMER:** All metrics below are **rough estimates** based on business operations feedback and have not yet been validated with formal data collection. Values are marked with **~** to indicate approximation. See Section 3 (Assumption Validation Tracker) for validation plan.

### **Business Goals (from Lean Canvas value delivered):**
- Operational efficiency: ~58% reduction in audit time (~4 hours → ~1.7 hours per dealership).
- Productivity gain: ~2.4x more audits per FSM per day.
- Revenue protection: identify device exceptions faster (save ~2.75 min per exception vs. manual troubleshooting).
- Better install penetration: standardized exception tracking and reporting.
- Risk reduction: fewer errors, reduced laptop/vehicle damage during manual audits.

### **User Goals:**
- Reduce time spent on audits (~58% reduction per Lean Canvas).
- Single device replaces three systems; no manual report compilation.

### **Success Metrics (from Lean Canvas §8):**

| Metric | Baseline (Current) | Target | Measurement Method | Owner | Tracking Frequency |
|--------|-------------------|--------|---------------------|-------|-------------------|
| Time per audit | ~4 hours per dealership | ≤~1.7 hours per dealership | [To be defined] | [Name] | [Frequency] |
| Scan time per vehicle | ~1.5 min (normal), ~3.5 min (exception) | ≤~45 seconds | [To be defined] | [Name] | [Frequency] |
| Manual VIN entry rate | [Current] | <~5% (barcode/QR success >~95%) | [To be defined] | [Name] | [Frequency] |
| Exception identification accuracy | [Current] | Validate against known device status | [To be defined] | [Name] | [Frequency] |
| Standardized reporting adoption | [Current] | Adoption in pilot | [To be defined] | [Name] | [Frequency] |

**Key success metrics (from Lean Canvas):** Scan time ≤~45 seconds per vehicle; audit completion time ≤~1.7 hours per dealership; manual VIN entry rate <~5% (barcode/QR scan success >~95%); exception identification accuracy; FSM satisfaction vs. current 3-system process.

**How will we measure success?**
- [ ] Analytics/telemetry in place
- [ ] User surveys planned
- [ ] A/B testing framework ready
- [ ] Dashboard created for tracking

---

## **6. Target Users / Personas** 🔴

**Instructions:** Who will use this product? Be specific about their role, goals, pain points, and context.

*Source: Lean Canvas §2, §1. No assumptions added.*

### **Primary Persona:**
- **Name/Role:** Ikon Field Support Manager (FSM).
- **Goals:** Complete lot audits; match VIN → device status; produce reports for Field Support and Corporate.
- **Pain Points:** (From Lean Canvas.) Juggling laptop while walking; multiple logins; risk of dropping laptop; slow system load; non-mobile-friendly; VIN typing errors; difficulty reading VINs (glare, dirty windshields); slow manual entry; switching between three systems; inconsistent classification; human error in status; no standardized exception definitions; unclear next actions; time-consuming manual report creation; inconsistent formats; data entry errors; manual email distribution.
- **Context:** Works at dealership lots; uses laptop and three systems (PlanetX, Dealer Portal, Ikon Toolbox).
- **Tech Savviness:** [Not in Lean Canvas — to be filled when validated.]

### **Scale (from Lean Canvas):**
> **⚠️ Note:** These are rough estimates based on business operations feedback.
- ~450 dealerships in Ikon's network; ~135 vehicles per dealership (average); total fleet ~60,750 vehicles; ~15% exception rate.

### **Early Adopters:**
- Field Support in two pilot markets (specific markets to be defined).

### **Secondary Persona:**
- [Not in Lean Canvas — to be filled when validated.]

---

## **7. User Stories / Use Cases** 🔴

**Instructions:** Describe how users will interact with this product. Use the format: "As a [user], I want to [action], so that [benefit]."

| User Story | Validation Status | Frequency | Impact if Not Solved |
|------------|------------------|-----------|---------------------|
*Source: Lean Canvas §4 (8-step workflow, solution). No assumptions added.*

| As a FSM, I want to log in once (SSO), so that I don't use multiple credentials | ❓ Not validated yet | Per audit session | [Impact] |
| As a FSM, I want to select a rooftop and start an audit, so that all scans are tied to the right location | ❓ Not validated yet | Per audit session | [Impact] |
| As a FSM, I want to scan VIN (barcode, QR, or manual), so that I capture VIN without manual typing errors | ❓ Not validated yet | Per vehicle | [Impact] |
| As a FSM, I want the system to look up VIN → device status in real time, so that I don't switch between three systems | ❓ Not validated yet | Per vehicle | [Impact] |
| As a FSM, I want to see device status and required action, so that I know if it's a pass or exception and what to do | ❓ Not validated yet | Per vehicle | [Impact] |
| As a FSM, I want to end the audit and download a standardized CSV report, so that I don't manually compile and email | ❓ Not validated yet | Per audit session | [Impact] |

**Legend:**
- ✅ **Validated** - Confirmed with real users
- ❓ **Not Validated** - Assumed, needs validation

---

## **8. User Research Validation** 🟡

>Document who said what, when, and how.

**Instructions:** For EVERY user quote or pain point, document the source and validation.

### **User Feedback Log:**

| Quote / Pain Point | Source (Name, Role, Location) | Date Collected | Collection Method | # of Users Who Said This |
|-------------------|------------------------------|----------------|-------------------|------------------------|
| [Quote here] | [Name, Role, Location] | [YYYY-MM-DD] | [Method] | [X out of Y users] |
| [Quote here] | [Name, Role, Location] | [YYYY-MM-DD] | [Method] | [X out of Y users] |

<!-- EXAMPLES (delete these rows after filling out your own):
| "I hate switching between 3 systems" | John Doe, FSM, Dallas | 2026-02-10 | In-person interview | 7 out of 10 FSMs interviewed |
| "Barcode scanning would save me time" | Jane Smith, FSM, Houston | 2026-02-11 | Phone interview | 8 out of 10 FSMs interviewed |
-->

**If user research has NOT been conducted yet:**
- [ ] Add to discovery plan with specific questions
- [ ] Flag as "PENDING VALIDATION" in the PRD
- [ ] Set timeline for user interviews/surveys

**Discovery Plan:**
- **Who will we interview?** [Your answer]
- **What questions will we ask?** [List 5-10 key questions]
- **When will this happen?** [Your answer]
- **Who owns this?** [Name]

<!-- EXAMPLE (delete after filling out):
- Who: "10 FSMs across Dallas, Houston, Austin"
- Questions: "How do you currently conduct audits? What takes the most time? What tools do you use?"
- When: "Week 0-1 of project"
- Owner: "Jane Doe"
-->

---

## **9. Scope** 🔴

*Source: Lean Canvas §4 (Solution), Notes (Out of Scope for MVP). No assumptions added.*

### **In Scope (MVP) — from Lean Canvas:**

**By workflow stage:**
1. **Prepare for audit:** FSM logs in once via SSO, selects rooftop from dropdown, confirms start of audit in single application; audit session management (start/stop).
2. **Locate vehicle & identify VIN:** FSM points scanner at VIN barcode or QR for instant capture; manual VIN entry fallback; VIN validation.
3. **Look up device status:** System automatically looks up VIN → IMEI, retrieves device status in real time, displays result instantly.
4. **Identify exception or pass:** System automatically classifies device status (Installed, Not Installed, Wrong Dealer, Not Reporting, Customer Linked/Registered, Missing Device) and displays required actions for each type. Classification logic per [status-classification-rules.md](./status-classification-rules.md).
5. **Complete audit & generate report:** System automatically generates standardized CSV report with all vehicle data and summary, ready for download at end of session.

**MVP features (from Lean Canvas):** SSO; rooftop selection; audit session (start/stop); VIN scanning (barcode/QR); manual VIN entry (fallback); VIN validation; real-time VIN → IMEI lookup; automatic status classification with defined actions; standardized CSV report with vehicle data and summary; download at session end.

**8-step MVP workflow (from Lean Canvas):** (1) FSM logs in (SSO). (2) FSM selects rooftop and confirms start of audit. (3) FSM scans each vehicle VIN (barcode, QR, or manual entry). (4) System looks up VIN in real time and returns device status with defined action. (5) FSM sees per-vehicle data and session count; repeats for each vehicle. (6) FSM ends audit session (with confirmation). (7) System produces standardized report (CSV + summary); FSM downloads. (8) FSM can start a new audit or finish.

### **Out of Scope (Future Versions) — from Lean Canvas Notes:**
- ❌ Offline mode / scanning without cellular signal (MVP requires active internet connection).
- ❌ Exception resolution / corrective actions within the app (FSMs handle exceptions through existing systems).
- ❌ Customer/Dealer-facing lot audit reports (reports are for internal Ikon use only).
- ❌ Pass or Exception beeping / audio feedback on scan results.
- ❌ Visual map report with exception pins.

### **Scope Rationale (from Lean Canvas — Test Drive MVP):**
- Prove the concept works: single-device workflow, basic reporting.

---

## **10. Requirements** 🔴

### **10.1 Functional Requirements**

**Instructions:** What must the product DO? Be specific and testable.

*Source: Lean Canvas §4 (Solution, MVP features). No assumptions added.*

| Requirement ID | Description | Priority | Acceptance Criteria | Dependencies |
|---------------|-------------|----------|---------------------|--------------|
| FR-001 | User logs in once (SSO) | P0 | User reaches rooftop selection without separate logins | SSO integration |
| FR-002 | User selects rooftop and starts/stops audit session | P0 | Rooftop required to start; session has start/stop | None |
| FR-003 | User scans VIN (barcode, QR, or manual entry) with validation | P0 | VIN captured; invalid format rejected (e.g. 17 chars, no I/O/Q) | Scanner / manual input |
| FR-004 | System performs real-time VIN → IMEI lookup and displays device status | P0 | Status shown after scan; no switching to other systems | PlanetX (or equivalent) API |
| FR-005 | System classifies status and displays required action (Installed, Not Installed, Wrong Dealer, Not Reporting, Customer Linked, Missing Device) | P0 | Correct status and action per type; logic layer applies rules per [status-classification-rules.md](./status-classification-rules.md) | None |
| FR-006 | System generates standardized CSV report with vehicle data and summary; user downloads at session end | P0 | Report downloadable at end of audit; 30 columns per [csv-report-schema.md](./csv-report-schema.md) | None |

**Priority Levels:**
- **P0 (Must Have):** Blocker - product doesn't work without this
- **P1 (Should Have):** Important - significant value, but workarounds exist
- **P2 (Nice to Have):** Low priority - can be deferred

### **10.2 Non-Functional Requirements**

**Instructions:** How should the product perform? (speed, reliability, security, etc.)

> **⚠️ Note:** Performance targets below are rough estimates based on business operations feedback.

| Category | Requirement | Target | Measurement |
|----------|-------------|--------|-------------|
| **Performance** | Scan time per vehicle (from LC §8) | ≤~45 seconds | [To be defined] |
| **Performance** | Audit completion time per dealership (from LC §8) | ≤~1.7 hours | [To be defined] |
| **Usability** | Barcode/QR scan success (from LC §8) | >~95% (manual entry <~5%) | [To be defined] |
| **Reliability** | [Your requirement] | [Target value] | [How measured] |
| **Security** | [Your requirement] | [Target value] | [How measured] |
| **Scalability** | [Your requirement] | [Target value] | [How measured] |

<!-- EXAMPLES (delete these rows after filling out your own):
| Performance | API response time | <3 seconds | 95th percentile |
| Reliability | Uptime | 99.5% | Monthly average |
| Security | Authentication | Username/password | All users authenticated |
| Usability | Training time | <2 hours | User can complete audit independently |
| Scalability | Concurrent users | 50 users | No performance degradation |
-->

---

## **11. User Experience (UX)** 🟡

**Instructions:** Describe the user flow and key screens. Include wireframes or mockups if available.

### **User Flow (from Lean Canvas §4 — 8-step MVP workflow):**
1. FSM logs in (SSO).
2. FSM selects rooftop and confirms start of audit.
3. FSM scans each vehicle VIN (barcode, QR, or manual entry).
4. System looks up VIN in real time and returns device status with defined action.
5. FSM sees per-vehicle data and session count; repeats for each vehicle.
6. FSM ends the audit session (with confirmation).
7. System produces standardized report (CSV + summary); FSM downloads.
8. FSM can start a new audit or finish.

### **Key Screens / Wireframes:**
- **App flow:** [app-flow.md](./app-flow.md) — Screen flow, navigation, and screen responsibilities.
- [Link to Figma/mockups]
- [Attach screenshots or sketches]

### **Design Principles:**
- [Your principle]
- [Your principle]
- [Your principle]

<!-- EXAMPLES (delete after filling out):
- Mobile-first design
- Minimal clicks to complete task
- Works in bright sunlight (outdoor use)
-->

---

## **12. Technical Considerations** 🟡

**Instructions:** What technical constraints or dependencies exist?

### **Architecture (Layered):**

| Layer | Responsibility |
|-------|----------------|
| **UI layer** | Presentation, user interaction |
| **Logic layer** | Status classification and business rules (see [status-classification-rules.md](./status-classification-rules.md)) |
| **Database layer** | Data persistence |

Status is computed in the logic layer from raw scan data; the UI consumes the result.

### **Technology Stack:**
- **Frontend:** [Your answer]
- **Backend:** [Your answer]
- **Database:** [Your answer]
- **Hosting:** [Your answer]

<!-- EXAMPLE (delete after filling out):
- Frontend: React Native
- Backend: Node.js, Express
- Database: PostgreSQL
- Hosting: AWS
-->

### **Integrations:**

| System | Purpose | API Available? | Authentication Method | Rate Limits | Owner |
|--------|---------|---------------|----------------------|-------------|-------|
| [System name] | [What it does] | ✅ Yes / ❓ Unknown / ❌ No | [Auth method] | [Limits] | [Name] |
| [System name] | [What it does] | ✅ Yes / ❓ Unknown / ❌ No | [Auth method] | [Limits] | [Name] |

<!-- EXAMPLES (delete these rows after filling out your own):
| PlanetX | VIN → IMEI lookup | ✅ Yes | API Key | 1000 req/min | Jane Doe |
| Dealer Portal | Dealer data | ❌ No | N/A | N/A | John Smith |
-->

### **Technical Risks:**
- [ ] [e.g., "PlanetX API may not support required fields"]
- [ ] [e.g., "Network connectivity at dealership lots may be poor"]
- [ ] [e.g., "Barcode scanning through windshield glass may not work"]

### **Mitigation Plan:**
- [How will you address each risk?]

---

## **13. Operational Readiness** 🟡

> **⚠️ RECOMMENDED BY PETER:** Address logistics, procurement, support. Don't ignore the operational side.

**Instructions:** How will this product be deployed, managed, and supported?

### **Device/Hardware Management:**
- **How many devices are needed?** POC: 2 devices; full rollout: 15 devices
- **Who procures them?** Hardware
- **Who manages inventory?** Ops
- **What happens if a device breaks?** Ops will manage
- **How do users request new devices?** [Your answer]
- **What is the replacement SLA?** [Your answer]

<!-- EXAMPLE (delete after filling out):
- Devices needed: "2 Zebra TC58e for pilot, 50 for full rollout"
- Procurement: "IT team"
- Inventory management: "Warehouse team"
- If device breaks: "Replacement shipped within 48 hours"
- Request process: "Submit ticket to IT helpdesk"
- Replacement SLA: "2 business days"
-->

### **Training & Onboarding:**
- **Who trains users?** Product will training the trainers
- **How long does training take?** 1hr
- **What is the training format?** Online
- **What is the rollout plan?** Pilot → Phased rollout → Full launch

<!-- EXAMPLE (delete after filling out):
- Trainers: "Regional Managers"
- Training duration: "2 hours"
- Training format: "In-person demo + video tutorial"
- Rollout plan: "Pilot in Dallas/Houston, then expand to 10 regions"
-->

### **Support & Maintenance:**
- **Who provides support?** [Your answer]
- **What are support hours?** [Your answer]
- **What is the escalation path?** [Your answer]
- **How are bugs reported and tracked?** [Your answer]

<!-- EXAMPLE (delete after filling out):
- Support provider: "IT helpdesk"
- Support hours: "8am-6pm CT, Mon-Fri"
- Escalation path: "L1 → L2 → Engineering"
- Bug tracking: "Jira tickets"
-->

---

## **14. Strategic Alignment & Long-Term Vision** 🟡

> **⚠️ RECOMMENDED BY PETER:** Ensure this fits the roadmap and doesn't create future technical debt.

**Instructions:** How does this product fit into the broader strategy?

*Source: Lean Canvas §9 (Unfair Advantage / Internal Advantages). No assumptions added.*

### **How does this fit into the broader product roadmap?**
- **Internal advantages (from Lean Canvas):** 

- Does this align with [NextGen/Platform Strategy/Other Initiatives]? [Your answer]
- Is this a temporary solution or long-term investment? [Your answer]
- Will this create system fragmentation or reduce it? [Your answer]
- What is the migration path if this is replaced later? [Your answer]

### **Build vs. Buy vs. Integrate:**
- **Have we evaluated existing tools that solve this?** For now we are moving with Zebra TC58e, during pilot we will evaluate other options
- **Why can't existing systems be enhanced instead?** 
Enahancing existing systems will take longer, high risk of causing unintended consequences and may not provide the same level of user experience and functionality.
- **What is the total cost of ownership (TCO) vs. alternatives?** 

| Option | Upfront Cost | Annual Cost | Pros | Cons |
|--------|-------------|-------------|------|------|
| Build in-house | [Cost] | [Cost] | [List pros] | [List cons] |
| Buy off-the-shelf | [Cost] | [Cost] | [List pros] | [List cons] |
| Enhance existing system | [Cost] | [Cost] | [List pros] | [List cons] |

<!-- EXAMPLE (delete these rows after filling out your own):
| Build in-house | $50K | $10K | Full control, custom features | Long dev time, maintenance burden |
| Buy off-the-shelf | $20K | $15K | Fast deployment, proven solution | Less customization, vendor lock-in |
| Enhance existing | $30K | $5K | Leverages existing infrastructure | May not fully solve problem |
-->

**Recommendation:** [Build / Buy / Integrate] because [rationale]

---

## **15. Data & Privacy Considerations** 🔴

> **⚠️ RECOMMENDED BY PETER:** Flag potential PII, security, or compliance issues early.

**Instructions:** What data does this product handle? Are there privacy or compliance concerns?

### **What data does this product collect, store, or display?**

Scan response data returned when FSM scans a VIN/serial. Required fields (per scan):

| Label | Data Type | JSON Format | Web UI Format | Sample Value |
|-------|-----------|-------------|---------------|--------------|
| Serial | string | `"016723002393428"` | Plain text | 016723002393428 |
| Activated | string (datetime) | `"2025-12-29T13:21:13.000Z"` or `"2025-12-29 13:21:13.000"` | M/D/YYYY HH:mm | 12/29/2025 13:21 |
| Last Report Date | string (datetime) | `"2026-02-24T16:10:21.000Z"` or `"2026-02-24 16:10:21.000"` | M/D/YYYY HH:mm | 2026-02-24 16:10:21.000 |
| Company | string | `"Friendly Chevrolet"` | Plain text | Friendly Chevrolet |
| Group | string | `"Friendly Chevrolet"` | Plain text | Friendly Chevrolet |
| Notes | string | `""` or `"free text"` | Plain text / textarea | *(empty)* |

*Full schema and source mappings: [scan-response-schema.md](./scan-response-schema.md)*

**CSV report:** The standardized report includes 30 columns (all device/vehicle fields). Column order and headers: [csv-report-schema.md](./csv-report-schema.md).

### **Is any of this PII (Personally Identifiable Information)?**
- [ ] Yes - [List which fields]
- [ ] No

### **Data Handling:**
- **What are the data retention requirements?** [e.g., "90 days"]
- **What are the security requirements?** [e.g., "Encrypted at rest and in transit"]
- **Are there compliance considerations?** [e.g., "GDPR, CCPA, SOC 2"]

### **Who has access to this data?**
- **Internal users:** [e.g., "FSMs, Regional Managers, IT admins"]
- **External users:** [e.g., "None"]

---

## **16. Assumptions & Risks** 🔴

**Instructions:** What could go wrong? What are we assuming to be true?

- Assumptions:
    - We are assuming that the existing system will support API needed to support this product.
    - We are assuming that for the most part (90%~) FSMs will have reliable network connectivity at dealership lots.
    - We are assuming that VIN scanning will work through windshield glass in most weather conditions.

### **Key Assumptions:**
- **API availability:** 
- **Network connectivity:** 
- **Barcode scanning:** 

### **Risks:**

| Risk | Likelihood | Impact | Mitigation Plan | Owner |
|------|-----------|--------|----------------|-------|
| API availability | High | High | Validate API in Week 0, have backup plan | Jane Doe |
| Network connectivity | Medium | Medium | Implement offline mode with sync when online | John Smith |
| Barcode scanning | Medium | Medium | Test in various conditions, provide clear instructions | Jane Doe |


**Risk Levels:**
- **Likelihood:** Low / Medium / High
- **Impact:** Low / Medium / High

---

## **17. Open Questions** 🔴

**Instructions:** What don't we know yet? What needs to be answered before we can proceed?

### **Open Questions:**
- **Who receives reports and at what frequency?**
- **Who owns device procurement?**
- **Approved hardware vendor?**
- **Does PlanetX expose API with required fields?**
- **Should dealer staff also use the tool or only Ikon Field Support?**
- **Audit history storage and retention period?**
- **Where is audit data visible beyond emailed reports?**
- Who know about the Bi report that will be integrated with this tool?


*Source: Lean Canvas Notes (Open questions from initiative). No assumptions added.*

| Question | Owner | Due Date | Answer |
|----------|-------|----------|--------|
| Who receives reports and at what frequency? | [Name] | [YYYY-MM-DD] | [To be filled in] |
| Who owns device procurement? | [Name] | [YYYY-MM-DD] | [To be filled in] |
| Approved hardware vendor? | [Name] | [YYYY-MM-DD] | [To be filled in] |
| Does PlanetX expose API with required fields? | [Name] | [YYYY-MM-DD] | [To be filled in] |
| Should dealer staff also use the tool or only Ikon Field Support? | [Name] | [YYYY-MM-DD] | [To be filled in] |
| Audit history storage and retention period? | [Name] | [YYYY-MM-DD] | [To be filled in] |
| Where is audit data visible beyond emailed reports? | [Name] | [YYYY-MM-DD] | [To be filled in] |

---

## **18. Timeline & Milestones** 🟡

**Instructions:** What is the project timeline? What are the key milestones?

| Phase | Duration | Key Deliverables | Owner | Status |
|-------|----------|-----------------|-------|--------|
| Discovery | [Timeline] | [Deliverables] | [Name] | ❓ Not Started |
| Design | [Timeline] | [Deliverables] | [Name] | ❓ Not Started |
| Development | [Timeline] | [Deliverables] | [Name] | ❓ Not Started |
| Testing | [Timeline] | [Deliverables] | [Name] | ❓ Not Started |
| Pilot | [Timeline] | [Deliverables] | [Name] | ❓ Not Started |
| Evaluation | [Timeline] | [Deliverables] | [Name] | ❓ Not Started |


-->

**Key Dates:**
- **Project Kickoff:** [2026-02-17]
- **MVP Launch:** [TBD]
- **Pilot Start:** [TBD]
- **Go/No-Go Decision:** [NA]

---

## **19. Go-to-Market Considerations** 🟡 Not applicable

**Instructions:** How will this product be launched and communicated?

### **Launch Plan:**
- **Who is the target audience for launch?** [Your answer]
- **How will we communicate the launch?** [Your answer]
- **What is the rollout strategy?** [Your answer]


### **Success Criteria for Launch:**
- [ ] [Your criterion]
- [ ] [Your criterion]
- [ ] [Your criterion]


---

## **20. Stakeholder Sign-Off** 🔴

**Instructions:** Who needs to approve this PRD before development begins?

| Stakeholder | Role | Approval Status | Date | Comments |
|-------------|------|----------------|------|----------|
| Mario Limas | VP of operations | Approved | 2026-02-17 | Aproved |
| Peter McDowell | Director of Product Management | Approved | 2026-02-17 | Approved |

---

## **21. Appendix** 🟡

### **Research & Data:**
- [Link to user research]
- [Link to competitive analysis] - NA
- [Link to market data] - NA
- [Link to financial models]

### **References:**
- [Related PRDs]
- [Technical documentation]
- [scan-response-schema.md](./scan-response-schema.md) — Scan API response
- [csv-report-schema.md](./csv-report-schema.md) — CSV report columns (30 fields)
- [status-classification-rules.md](./status-classification-rules.md) — Logic layer: status classification rules
- [app-flow.md](./app-flow.md) — Screen flow and navigation
- [data-mapping.md](./data-mapping.md) — Field definitions

### **Change Log:**

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-02-17 | 2.0 | PRD updated from Product/lean-canva.md only; no assumptions added | [Your name] |

---

## **🎯 How to Use This Template:**

1. **Start with Problem Statement** - Make sure you understand the problem before jumping to solutions
2. **Validate Assumptions Early** - Use the Assumption Validation Tracker religiously
3. **Be Specific with Numbers** - Use the Quantification Requirements section to show your math
4. **Don't Skip Operational Readiness** - Address logistics, procurement, and support upfront
5. **Align with Strategy** - Ensure this fits the broader roadmap and doesn't create technical debt
6. **Validate with Real Users** - Document user research; don't assume pain points
7. **Flag Privacy/Security Early** - Use the Data & Privacy section to catch issues before they become blockers
8. **Keep it Living** - Update as you learn more during discovery and development
9. **Collaborate Early** - Get input from engineering, design, operations, and stakeholders before finalizing
10. **Be Honest About What You Don't Know** - Use the Open Questions section liberally

---



