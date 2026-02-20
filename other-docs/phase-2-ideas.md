# Lot Scan - Phase 2 & Future Ideas

**Project:** Ikon Lot Scan (Lot Audit)  
**Date:** 2026-02-18  
**Status:** Exploratory - Needs Research & Validation

---

## Purpose

This document captures strategic opportunities and feature ideas for future phases of the Lot Scan product. These are **not in scope for MVP** but represent potential value-add capabilities once the core workflow is validated.

---

## Phase 2 Ideas

### 1. Lot Audit as External Service (Non-Ikon Dealerships)

**Opportunity:**
Offer lot audit services to dealerships that are **not currently Ikon customers** as a lead generation and "foot-in-the-door" strategy.

**Strategic Value:**
- Generate new customer leads
- Demonstrate Ikon's operational expertise and technology
- Create touchpoint for upselling Ikon devices and services
- Competitive intelligence (understand what devices competitors are using)

**Open Questions (Needs Research):**

#### Business Model:
- [ ] Is this a **paid service** (dealerships pay for audits)?
- [ ] Or a **free service** (loss leader to acquire customers)?
- [ ] Or **value-added service** (bundled with Ikon device sales pitch)?
- [ ] What's the pricing model if paid? (per audit, per vehicle, subscription?)

#### Market Opportunity:
- [ ] How many **non-Ikon dealerships** are potential targets?
- [ ] What's the total addressable market (TAM)?
- [ ] What regions/markets have the highest concentration of non-Ikon dealerships?
- [ ] What's the competitive landscape? (Do other GPS vendors offer similar services?)

#### Value Proposition for Non-Ikon Dealerships:
- [ ] What problem does lot audit solve for dealerships **without Ikon devices**?
- [ ] Are they auditing competitor devices (other GPS tracking vendors)?
- [ ] Or auditing general inventory management (VIN tracking, lot aging, vehicle location)?
- [ ] What data would FSMs collect during these audits?
- [ ] How does this differ from auditing Ikon customers?

#### Conversion Strategy:
- [ ] What's the path from "lot audit service" → "Ikon device customer"?
- [ ] Do FSMs upsell during the audit? After the audit?
- [ ] What's the expected conversion rate (audit → customer)?
- [ ] What's the average customer lifetime value (LTV) of converted dealerships?
- [ ] What's the customer acquisition cost (CAC) for this channel vs. traditional sales?

#### Technical Requirements:
- [ ] Does the tool need to support **non-Ikon device data**?
- [ ] Can FSMs audit competitor GPS devices (different APIs, data formats)?
- [ ] Or is this purely inventory/VIN tracking (no device status)?
- [ ] What integrations are needed (competitor APIs, third-party data sources)?

#### Operational Considerations:
- [ ] Who performs these audits? (Same FSMs or dedicated sales team?)
- [ ] How does this impact FSM capacity for existing Ikon customer audits?
- [ ] What's the service level agreement (SLA) for non-Ikon audits?
- [ ] How are leads handed off to sales after audit completion?

#### Legal/Compliance:
- [ ] Are there legal considerations for auditing competitor devices?
- [ ] Do we need dealership consent/contracts before auditing?
- [ ] What data privacy/security requirements apply?

**Next Steps:**
1. Validate market demand (talk to non-Ikon dealerships)
2. Define business model and pricing
3. Calculate ROI (conversion rate × LTV vs. CAC)
4. Assess technical feasibility (competitor device support)
5. Pilot with 2-3 non-Ikon dealerships to test conversion

---

### 2. Offline Mode / Queue-Based Sync

**Opportunity:**
Enable FSMs to continue scanning VINs without cellular signal. Scans are queued locally and automatically synced when connectivity returns.

**Strategic Value:**
- Eliminate audit interruptions due to poor signal (rural lots, parking garages)
- Improve FSM productivity in low-coverage areas
- Reduce frustration and improve user experience
- Enable audits in areas with poor cellular coverage

**Technical Requirements:**
- Local storage for queued scans (IndexedDB, LocalStorage)
- Background sync when online (Service Worker API)
- Conflict resolution (if device status changes while offline)
- Offline-first architecture
- Queue management UI (show pending scans, sync status)

**Status:** Out of scope for MVP - requires active internet connection (from lean-canva.md)

---

### 3. Audio Feedback (Pass/Exception Beeping)

**Opportunity:**
Provide audio feedback on scan results so FSMs can work hands-free without looking at the screen.

**User Experience:**
- **Pass beep:** FSM hears confirmation and continues scanning next vehicle
- **Exception beep:** FSM stops to review details and take action

**Strategic Value:**
- Faster scanning (no need to visually confirm each result)
- Improved ergonomics (less screen time, less neck strain)
- Better workflow for high-volume audits
- Enables true hands-free operation for high-volume audits

**Status:** Out of scope for MVP (from lean-canva.md)

---

### 4. In-App Exception Resolution

**Opportunity:**
Allow FSMs to resolve exceptions directly within the app instead of using external systems.

**Capabilities:**
- Reassign device to correct dealer
- Flag device for follow-up
- Update device status
- Add notes/photos for exceptions
- Create service tickets
- Initiate device replacement workflow
- Schedule follow-up visits

**Strategic Value:**
- Close the loop on exceptions faster
- Reduce context switching (no need to go back to PlanetX/Dealer Portal)
- Improve exception resolution rate
- Complete workflow in single tool
- Track resolution metrics

**Status:** Out of scope for MVP - FSMs will handle exceptions through existing systems (from lean-canva.md)

---

### 5. Dealer-Facing Reports

**Opportunity:**
Generate automated compliance reports sent directly to dealer principals.

**Capabilities:**
- Automated report generation and delivery
- Dealer-specific branding and formatting
- Scheduled delivery (daily, weekly, monthly)
- Self-service portal for dealers to access historical reports
- Customizable report templates

**Strategic Value:**
- Transparency with dealership partners
- Reduce manual reporting burden on FSMs
- Strengthen dealer relationships
- Upsell opportunity (show value of Ikon devices)
- Differentiation from competitors
- Build trust through data transparency

**Status:** Out of scope for MVP - reports are for internal Ikon use only (from lean-canva.md)

---

### 6. Visual Map Report with Exception Pins

**Opportunity:**
Generate visual map-based reports showing dealership lot layout with color-coded pins for device status.

**Capabilities:**
- Interactive map view of dealership lot
- Color-coded pins (green = pass, red = exception, yellow = warning)
- Click pin to see vehicle details (VIN, IMEI, status, notes)
- Export as static image for reports
- Overlay historical audit data (show trends over time)
- Heatmap view (identify problem areas on lot)

**Strategic Value:**
- Visual storytelling for stakeholders
- Easier pattern recognition (e.g., "all exceptions in back lot")
- Better communication with dealer principals
- Executive-friendly reporting format
- Identify physical lot layout issues

**Technical Requirements:**
- Mapbox Static Images API or Google Maps URL schemes
- GPS coordinates for each scanned vehicle
- Pin color-coding logic based on device status
- Image generation and embedding in reports

**Status:** Out of scope for MVP (from lean-canva.md)

---

### 7. AI-Powered Insights & Predictive Analytics

**Opportunity:**
Use historical audit data to predict which lots need priority visits and identify patterns.

**Capabilities:**
- Predict exception likelihood based on historical data
- Smart routing for FSMs (prioritize high-exception lots)
- Trend analysis (device health over time)
- Anomaly detection (sudden spike in exceptions)

**Strategic Value:**
- Proactive exception management
- Optimize FSM time allocation
- Data-driven decision making

**Status:** Phase 3 (requires significant audit history data)

---

## Prioritization Framework

Use this framework to evaluate which Phase 2 ideas to pursue:

| Idea | Business Impact | Technical Complexity | User Demand | Priority |
|------|----------------|---------------------|-------------|----------|
| External Service (Non-Ikon) | High (new revenue) | Medium | TBD | Research |
| Offline Mode | Medium | High | TBD | Validate |
| Audio Feedback | Medium | Low | TBD | Quick Win |
| Exception Resolution | High | Medium | TBD | High |
| Dealer Reports | Medium | Low | TBD | Medium |
| Visual Map Report | Medium | Medium | TBD | Medium |
| AI Insights | High | Very High | Low | Phase 3 |

---

## Next Steps

1. **Validate MVP first** - Prove core workflow works before expanding scope
2. **Gather FSM feedback** during pilot - What features do they request most?
3. **Prioritize based on data** - Use pilot metrics to inform Phase 2 roadmap
4. **Research external service opportunity** - Talk to non-Ikon dealerships to validate demand

---

**Last Updated:** 2026-02-18  
**Owner:** [Product Team]

