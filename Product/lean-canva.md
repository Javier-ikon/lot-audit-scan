# Lean Canvas Business Planning Tool

> **📋 TEMPLATE INSTRUCTIONS:**  
> This template includes example content to help you get started. All example content is clearly marked with `[EXAMPLE]` tags.  
> **To remove all examples:** Search for `<!-- EXAMPLE START -->` and delete everything between `<!-- EXAMPLE START -->` and `<!-- EXAMPLE END -->` markers.  
> **To use this template:** Replace the placeholder text in brackets `[...]` with your own content.

> **📌 REQUIREMENT KEY:**  
> 🔴 **Hard Requirement** — Must be completed. The Lean Canvas is not valid without this section.  
> 🟡 **Soft Requirement** — Recommended but can be iterated on. Fill with best estimates and revisit as you learn more.

---

**Project Name:** Ikon Lot Scan (Lot Audit)
**Date:** 2026-02-17
**Version:** 2.0 (Updated from MVP Agreement)

---

## 1. Problem 🔴

**Problems by workflow stage (current state):**

1. **Prepare for audit:** FSM logs into three separate systems (PlanetX, Dealer Portal, Ikon Toolbox), navigates to records, and prepares a spreadsheet for manual data entry.
2. **Locate vehicle & identify VIN:** FSM walks to the vehicle, manually reads the 17-character VIN from the windshield or door jamb, and types it into a laptop.
3. **Look up device status:** FSM searches for the VIN in PlanetX, cross-references it in Dealer Portal, then checks Ikon Toolbox for device status—switching between all three systems.
4. **Identify exception or pass:** FSM manually reviews device status across the three systems, decides if it’s a pass or exception, then writes notes or updates a spreadsheet.
5. **Complete audit & generate report:** FSM manually compiles data from the three systems into a spreadsheet, formats the report, calculates exception counts, and emails it to Field Support and Corporate.

**Pain points:**

- **Prepare:** Juggling a laptop while walking the lot; multiple login credentials; risk of dropping the laptop; slow system load times; non-mobile-friendly interface.
- **VIN capture:** VIN typing errors (e.g. O vs 0, I vs 1); difficulty reading VINs (dirty windshields, glare); slow manual entry; balancing a laptop while typing; re-typing after errors.
- **Lookup:** Slow navigation across three systems; internet connectivity issues on the laptop.
- **Exception/pass:** Inconsistent classification criteria; human error in status determination; no standardized exception definitions; unclear next actions.
- **Report:** Time-consuming manual report creation; inconsistent report formats; data entry errors; no visual summary (e.g. map with exception pins); manual email distribution.

**Existing alternatives:**

- Manual lookups and data entry across PlanetX, Dealer Portal, and Ikon Toolbox.
- Ad-hoc audit processes using laptops; no single standardized workflow or reporting.

**Competition:**

- N/A — This is an internal tool for Ikon Field Support only. No external competition or market alternatives.

---

## 2. Customer Segments 🔴

**Target Customers:**

- Ikon Field Support Managers (FSMs) performing lot audits across 450 dealerships.

**Early Adopters:**

- Field Support in two pilot markets (specific markets to be defined).

**Scale:**
- 450 dealerships in Ikon's network
- 135 vehicles per dealership (average)
- Total fleet: ~60,750 vehicles under management
- 15% exception rate (devices with issues requiring attention)

---

## 3. Unique Value Proposition 🔴

**Single, Clear, Compelling Message:**

Cut lot audit time by 58% with instant VIN scanning and real-time device status—save 45 seconds per pass, 2.75 minutes per exception.

**High-Level Concept:**

One rugged device replaces three systems: scan VIN → instant status → standardized reports in under 2 hours instead of 4.

---

## 4. Solution 🔴

**Proposed solutions by workflow stage (future state):**

1. **Prepare for audit:** FSM logs in once via Single Sign-On (SSO), selects a rooftop from a dropdown, and confirms the start of the audit—all in a single application. Audit session management (start/stop).
2. **Locate vehicle & identify VIN:** FSM points a scanner at the VIN barcode or QR code for instant capture; manual VIN entry remains available as a fallback. VIN validation ensures correct input.
3. **Look up device status:** The system automatically looks up VIN → IMEI, retrieves device status in real time, and displays the result instantly. No switching between systems.
4. **Identify exception or pass:** The system automatically classifies device status (Installed, Not Installed, Wrong Dealer, Not Reporting, Customer Linked/Registered) and displays the required actions for each type.
5. **Complete audit & generate report:** The system automatically generates a standardized CSV report with all vehicle data and a summary, ready for download at the end of the audit session.

**MVP features (from journey):**

- Single Sign-On (SSO); rooftop selection; audit session management (start/stop).
- VIN scanning (barcode/QR); manual VIN entry (fallback); VIN validation.
- Real-time VIN → IMEI lookup.
- Automatic status classification with defined actions per type (Installed, Not Installed, Wrong Dealer, Not Reporting, Customer Linked).
- Standardized CSV report with vehicle data and summary; download at session end.

**8-step MVP workflow:**
1. FSM logs in (SSO).
2. FSM selects rooftop and confirms start of audit.
3. FSM scans each vehicle VIN (barcode, QR, or manual entry).
4. System looks up VIN in real time and returns device status with defined action.
5. FSM sees per-vehicle data and session count; repeats for each vehicle.
6. FSM ends the audit session (with confirmation).
7. System produces standardized report (CSV + summary); FSM downloads.
8. FSM can start a new audit or finish.

---

## 5. Channels 🟡

**Path to Customers:**

- **Internal deployment only.** Tool will be rolled out to Ikon Field Support Managers (FSMs).
- Pilot: Two markets (to be defined)
- Rollout: Scale to all FSMs after pilot validation

**Distribution:**

- N/A - Internal tool. No external channels, marketing, or sales required.
- Training and onboarding handled internally by Field Operations leadership.

---

## 6. Revenue Streams 🟡

**Revenue Model:**

- **Internal tool - no direct pricing or revenue.** This is an operational efficiency tool for Ikon Field Support.

**Value Delivered:**

- **Operational efficiency:** 58% reduction in audit time (4 hours → 1.7 hours per dealership)
  - Automation: Quick VIN scanning (barcode/QR) eliminates manual VIN entry
  - Real-time lookup eliminates navigation across 3 systems (PlanetX, Dealer Portal, Ikon Toolbox)
- **Productivity gain:** 2.4x more audits per FSM per day
- **Revenue protection:** Identify device exceptions faster (save 2.75 min per exception vs. manual troubleshooting)
- **Better install penetration:** Standardized exception tracking and reporting
- **Risk reduction:** Fewer errors, reduced laptop/vehicle damage during manual audits

**Pricing:**

- N/A - Internal tool for Ikon Field Support only

**Lifetime Value (LTV):**

- N/A - Internal tool

---

## 7. Cost Structure 🟡

**Fixed Costs:**

- More research is needed (e.g. engineering, device evaluation/procurement, PlanetX integration).

**Variable Costs:**

- More research is needed (e.g. devices per FSM, support).

**Customer Acquisition Cost (CAC):**

- N/A internal initiative; more research is needed if applicable.

---

## 8. Key Metrics 🔴

**Key Activities to Measure:**

- Audit time (reduction vs baseline).
- Scan success across VIN types.
- VIN → IMEI matching accuracy.
- Standardized reporting adoption in pilot.
- Reduction in missed installs.
- Install penetration.
- Exception identification rate.
- FSM productivity (audits per day).

**Success Indicators:**

**Baseline (Current Manual Process):**
- **Vehicles per dealership:** 135 (average)
- **Exception rate:** 15% (20 exception vehicles, 115 normal vehicles)
- **Time per normal vehicle:** 1-2 min (avg 1.5 min) - manual VIN entry + lookup
- **Time per exception vehicle:** 2-5 min (avg 3.5 min) - manual VIN entry + troubleshooting across 3 systems
- **Time per audit:** 242.5 minutes (~4 hours per dealership)
  - Normal vehicles: 115 × 1.5 min = 172.5 minutes
  - Exception vehicles: 20 × 3.5 min = 70 minutes

**MVP Targets:**
- **Scan time per vehicle:** 45 seconds (0.75 min) - all vehicles
- **Time per audit:** 101.25 minutes (~1.7 hours per dealership)
  - All 135 vehicles × 0.75 min = 101.25 minutes
- **Time savings:** 141.25 minutes per audit (58% reduction)
- **Productivity gain:** 2.4x more audits per FSM per day (4 hours → 1.7 hours per audit)

**Time Savings Breakdown (per vehicle):**
- **Pass/Normal vehicles:** Save **45 seconds** per scan
  - Automation: Quick VIN scanning (barcode/QR) + instant real-time lookup eliminates manual VIN entry and system navigation
  - Current: 1.5 min → MVP: 0.75 min (45 sec)

- **Exception vehicles:** Save **2.75 minutes** per scan
  - Automation: Quick VIN scanning + instant status display + system provides resolution guidance
  - Current: 3.5 min → MVP: 0.75 min (2.75 min saved)
  - Key benefit: FSM can identify exceptions immediately without troubleshooting across 3 systems

**Key Success Metrics:**
- Scan time ≤45 seconds per vehicle
- Audit completion time ≤1.7 hours per dealership
- Manual VIN entry rate <5% (barcode/QR scan success >95%)
- Exception identification accuracy (validate against known device status)
- FSM satisfaction vs. current 3-system process

---

## 9. Unfair Advantage 🟡

**Can't be easily copied or bought:**

- N/A - This is an internal operational tool, not a competitive product.

**Internal Advantages:**

- **Proprietary data access:** Direct integration with Ikon's existing systems (PlanetX, Dealer Portal, Ikon Toolbox)
- **Domain expertise:** Built by dealers, for dealers (#ByDealersForDealers) - deep understanding of lot audit workflows
- **Existing infrastructure:** Leverages Ikon's GPS tracking, telematics, and dealership relationship network
- **Internal alignment:** Tool supports Ikon's core business (lot management, connected car, device tracking) rather than competing in external market

---

## Notes & Additional Context 🟡

- Sections marked "more research is needed" must be validated or filled before the Lean Canvas is complete.
- Open questions from initiative: who receives reports and at what frequency; who owns device procurement; approved hardware vendor; PlanetX API availability; whether dealer staff also use the tool; audit history storage and retention; where audit data is visible beyond emailed reports.

**Out of Scope for MVP (Future Phases):**
1. Offline Mode / scanning without cellular signal (MVP requires active internet connection)
2. Exception resolution / corrective actions within the app (FSMs will handle exceptions through existing systems)
3. Customer/Dealer-facing lot audit reports (reports are for internal Ikon use only)
4. Pass or Exception beeping / audio feedback on scan results
5. Visual map report with exception pins


**Product Evolution (Test Drive → Daily Driver → Performance Package):**
- **Test Drive (MVP):** Prove the concept works - single-device workflow, basic reporting
- **Daily Driver (Phase 2):** Enhanced reliability - offline mode, audio feedback, visual map reports, exception resolution, multi-rooftop sessions
- **Performance Package (Phase 3):** Strategic intelligence - AI insights, dealer-facing reports, executive dashboard, Ikon Loop integration, smart routing, ROI analytics

---

## Next Steps 🟡

1. Complete research for all sections marked "more research is needed."
2. Validate problem and solution with Field Support in pilot markets.
3. Define key metrics and baselines (no assumptions; validate with data).

---

**Last Updated:** 2026-02-17  
**Prepared By:** [Name/Team]
