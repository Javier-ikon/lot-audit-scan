# Product Requirements Document (PRD) Template

> **📌 REQUIREMENT KEY:**  
> 🔴 **Hard Requirement** — Must be completed before the PRD can move to Review/Approved status. Stakeholders will block without these.  
> 🟡 **Soft Requirement** — Recommended for a complete PRD. Can be filled with best estimates and refined during discovery/development. Mark unknowns as "TBD" with an owner and due date.

---

## **📋 Document Header** 🔴

```
Product Name: [Enter product/feature name]
Version: [DRAFT 1.0, V2.0, etc.]
Last Updated: [YYYY-MM-DD]
Status: [Discovery / In Progress / Review / Approved]
Owner: [Product Manager name]
Stakeholders: [List key stakeholders]
```

---

## **1. Executive Summary** 🔴

**Instructions:** Write a 2-3 paragraph overview. Answer: What are we building? Why does it matter? What's the expected impact?

- **What:** [Brief description of the product/feature]
- **Why:** [Business justification - why now?]
- **Impact:** [Expected outcomes - revenue, efficiency, user satisfaction]
- **Ask:** [What decision or approval are you seeking?]

---

## **2. Problem Statement** 🔴

**Instructions:** Clearly define the problem you're solving. Be specific about who experiences this problem and how often.

**What problem are we solving?**
- [Describe the problem in 2-3 sentences]

**Who experiences this problem?**
- [Primary user persona]
- [Secondary user persona]

**How do we know this is a real problem?** *(Validate, don't assume)*
- [ ] User research conducted (interviews, surveys, observations)
- [ ] Data analysis shows impact (metrics, reports)
- [ ] Stakeholder feedback collected
- [ ] Competitive analysis completed

**Quantify the problem:**
- How often does this occur? [Your answer here]
- How many users are affected? [Your answer here]
- What is the cost/impact? [Your answer here]

**What happens if we don't solve this?**
- [Impact on business]
- [Impact on users]
- [Impact on customers]

<!-- EXAMPLE (delete this section after filling out):
- How often does this occur? "Daily for 80% of FSMs"
- How many users are affected? "50 FSMs across 10 regions"
- What is the cost/impact? "$25K lost revenue per month"
-->

---

## **🚨 3. Assumption Validation Tracker** 🔴

> **⚠️ RECOMMENDED BY PETER:** List EVERY quantitative claim and validate it.

**Instructions:** For every number, metric, or claim in this PRD, document validation status.

| Assumption | Status | Validation Method | Owner | Due Date | Result |
|------------|--------|-------------------|-------|----------|--------|
| [Your assumption here] | ❓ Unvalidated | [How you'll validate] | [Name] | [YYYY-MM-DD] | [Result after validation] |
| [Your assumption here] | ❓ Unvalidated | [How you'll validate] | [Name] | [YYYY-MM-DD] | [Result after validation] |
| [Add more rows as needed] | | | | | |

<!-- EXAMPLES (delete these rows after filling out your own):
| "FSMs spend 65s per vehicle on audits" | ❓ Unvalidated | Shadow 3 FSMs, time with stopwatch | Jane Doe | 2026-03-01 | TBD |
| "$2.5M/year revenue recovery potential" | ❓ Unvalidated | Finance team analysis | John Smith | 2026-03-05 | TBD |
-->

**Legend:**
- ❓ **Unvalidated** - Assumption not yet tested
- 🔄 **In Progress** - Currently validating
- ✅ **Validated** - Confirmed with data/research
- ❌ **Invalidated** - Assumption proven wrong

---

## **4. Quantification Requirements** 🔴

> **⚠️ RECOMMENDED BY PETER:** Be specific. Avoid vague claims like "faster" or "time savings." Show your math.

**Instructions:** For EVERY claim about time savings, cost reduction, or efficiency gains, complete this section.

### **Current State (Baseline):**
- **What is the current metric?** [Your answer]
- **How was this measured?** [Your answer]
- **What is the sample size?** [Your answer]
- **What is the variance?** [Your answer]

<!-- EXAMPLE (delete after filling out):
- Current metric: "65s per vehicle"
- How measured: "Timed 5 FSMs across 3 dealerships over 2 weeks"
- Sample size: "15 audits observed, 750 vehicles total"
- Variance: "Range: 45s - 120s, median: 65s, mean: 68s"
-->

### **Target State (Goal):**
- **What is the target metric?** [Your answer]
- **How will this be achieved?** [Your answer]
- **What is the confidence level?** [Your answer]

<!-- EXAMPLE (delete after filling out):
- Target metric: "45s per vehicle"
- How achieved: "Barcode scanning eliminates 15s of manual VIN entry, API lookup saves 5s"
- Confidence level: "Medium - based on similar tools in market"
-->

### **Impact Calculation:**
**Show your math:**
```
[Your calculation here]
[Show each step]
[Final result]
```

<!-- EXAMPLE (delete after filling out):
20s savings per vehicle
× 50 vehicles per audit
× 10 audits per month per FSM
× 50 FSMs
= 167 hours saved per month across all FSMs
× $50/hour labor cost
= $8,350/month cost savings
-->

**Break down to per-unit economics:**
- Revenue recovery per rooftop: [Your answer]
- Cost savings per FSM: [Your answer]
- Time savings per audit: [Your answer]

---

## **5. Goals & Success Metrics** 🔴

**Instructions:** Define what success looks like. Use SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound).

### **Business Goals:**
- [e.g., "Increase revenue by $X in 6 months"]
- [e.g., "Reduce operational costs by X%"]

### **User Goals:**
- [e.g., "Reduce time spent on audits by X%"]
- [e.g., "Improve user satisfaction score from X to Y"]

### **Success Metrics:**

| Metric | Baseline (Current) | Target | Measurement Method | Owner | Tracking Frequency |
|--------|-------------------|--------|-------------------|-------|-------------------|
| [Your metric] | [Current value] | [Target value] | [How you'll measure] | [Name] | [Frequency] |
| [Your metric] | [Current value] | [Target value] | [How you'll measure] | [Name] | [Frequency] |

<!-- EXAMPLES (delete these rows after filling out your own):
| Time per audit | 65s | 45s | In-app analytics | Jane Doe | Weekly |
| Audit completion rate | 60% | 85% | Backend logs | John Smith | Monthly |
-->

**How will we measure success?**
- [ ] Analytics/telemetry in place
- [ ] User surveys planned
- [ ] A/B testing framework ready
- [ ] Dashboard created for tracking

---

## **6. Target Users / Personas** 🔴

**Instructions:** Who will use this product? Be specific about their role, goals, pain points, and context.

### **Primary Persona:**
- **Name/Role:** [Your answer]
- **Goals:** [What are they trying to achieve?]
- **Pain Points:** [What frustrates them today?]
- **Context:** [Where/when/how do they work?]
- **Tech Savviness:** [Low / Medium / High]

<!-- EXAMPLE (delete after filling out):
- Name/Role: "Field Support Manager (FSM)"
- Goals: "Complete lot audits quickly and accurately"
- Pain Points: "Juggling 3 systems, manual data entry, slow lookups"
- Context: "Works outdoors at dealership lots, often in extreme weather"
- Tech Savviness: Medium
-->

### **Secondary Persona:**
- **Name/Role:** [Your answer]
- **Goals:** [What are they trying to achieve?]
- **Pain Points:** [What frustrates them today?]

<!-- EXAMPLE (delete after filling out):
- Name/Role: "Regional Manager"
- Goals: "Track audit completion across all dealerships in region"
- Pain Points: "Inconsistent reporting formats, no visibility into audit status"
-->

---

## **7. User Stories / Use Cases** 🔴

**Instructions:** Describe how users will interact with this product. Use the format: "As a [user], I want to [action], so that [benefit]."

| User Story | Validation Status | Frequency | Impact if Not Solved |
|------------|------------------|-----------|---------------------|
| As a [role], I want to [action], so that [benefit] | ❓ Not validated yet | [How often] | [Impact] |
| As a [role], I want to [action], so that [benefit] | ❓ Not validated yet | [How often] | [Impact] |

<!-- EXAMPLES (delete these rows after filling out your own):
| As a FSM, I want to scan VIN barcode, so that I don't have to manually type it | ✅ Validated with 5 FSMs | Daily (50x/day) | 15 min/day wasted on manual entry |
| As a Regional Manager, I want to download CSV reports, so that I can track audit completion | ❓ Not validated yet | Weekly | No visibility into audit status |
-->

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

**Instructions:** Clearly define what's IN scope and what's OUT of scope. Be explicit about what you're NOT building.

### **In Scope (MVP):**
- [ ] [Feature 1]
- [ ] [Feature 2]
- [ ] [Feature 3]

### **Out of Scope (Future Versions):**
- ❌ [Feature deferred to V2]
- ❌ [Feature deferred to V3]
- ❌ [Feature not planned]

### **Scope Rationale:**
**Why are we limiting scope?**
- [e.g., "Focus on core workflow first, validate with pilot before adding complexity"]
- [e.g., "API limitations prevent this feature in V1"]

---

## **10. Requirements** 🔴

### **10.1 Functional Requirements**

**Instructions:** What must the product DO? Be specific and testable.

| Requirement ID | Description | Priority | Acceptance Criteria | Dependencies |
|---------------|-------------|----------|-------------------|--------------|
| FR-001 | [Your requirement] | [P0/P1/P2] | [How to test/verify] | [What's needed] |
| FR-002 | [Your requirement] | [P0/P1/P2] | [How to test/verify] | [What's needed] |
| FR-003 | [Your requirement] | [P0/P1/P2] | [How to test/verify] | [What's needed] |

<!-- EXAMPLES (delete these rows after filling out your own):
| FR-001 | User can scan VIN barcode | P0 (Must Have) | Barcode scans in <2s, 95% accuracy | Hardware: Zebra TC58e |
| FR-002 | System displays device status | P0 (Must Have) | Status shown within 3s of scan | API: PlanetX integration |
| FR-003 | User can download CSV report | P1 (Should Have) | CSV includes all required fields | None |
-->

**Priority Levels:**
- **P0 (Must Have):** Blocker - product doesn't work without this
- **P1 (Should Have):** Important - significant value, but workarounds exist
- **P2 (Nice to Have):** Low priority - can be deferred

### **10.2 Non-Functional Requirements**

**Instructions:** How should the product perform? (speed, reliability, security, etc.)

| Category | Requirement | Target | Measurement |
|----------|-------------|--------|-------------|
| **Performance** | [Your requirement] | [Target value] | [How measured] |
| **Reliability** | [Your requirement] | [Target value] | [How measured] |
| **Security** | [Your requirement] | [Target value] | [How measured] |
| **Usability** | [Your requirement] | [Target value] | [How measured] |
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

### **User Flow:**
1. [Step 1]
2. [Step 2]
3. [Step 3]
4. [Step 4]

<!-- EXAMPLE (delete after filling out):
1. User logs in
2. User scans VIN barcode
3. System displays device status
4. User downloads report
-->

### **Key Screens / Wireframes:**
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
- **How many devices are needed?** [Your answer]
- **Who procures them?** [Your answer]
- **Who manages inventory?** [Your answer]
- **What happens if a device breaks?** [Your answer]
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
- **Who trains users?** [Your answer]
- **How long does training take?** [Your answer]
- **What is the training format?** [Your answer]
- **What is the rollout plan?** [Your answer]

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

### **How does this fit into the broader product roadmap?**
- Does this align with [NextGen/Platform Strategy/Other Initiatives]? [Your answer]
- Is this a temporary solution or long-term investment? [Your answer]
- Will this create system fragmentation or reduce it? [Your answer]
- What is the migration path if this is replaced later? [Your answer]

### **Build vs. Buy vs. Integrate:**
- **Have we evaluated existing tools that solve this?** [Your answer]
- **Why can't existing systems be enhanced instead?** [Your answer]
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
- [ ] VINs
- [ ] IMEIs
- [ ] Customer names
- [ ] Customer addresses
- [ ] Customer phone numbers
- [ ] Customer email addresses
- [ ] Other: [Specify]

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

### **Key Assumptions:**
1. [Your assumption]
2. [Your assumption]
3. [Your assumption]

<!-- EXAMPLES (delete after filling out):
1. "PlanetX API supports VIN → IMEI lookup"
2. "FSMs have reliable network connectivity at dealership lots"
3. "Barcode scanning works through windshield glass"
-->

### **Risks:**

| Risk | Likelihood | Impact | Mitigation Plan | Owner |
|------|-----------|--------|----------------|-------|
| [Your risk] | [Low/Med/High] | [Low/Med/High] | [How you'll mitigate] | [Name] |
| [Your risk] | [Low/Med/High] | [Low/Med/High] | [How you'll mitigate] | [Name] |

<!-- EXAMPLES (delete these rows after filling out your own):
| PlanetX API doesn't support required fields | High | High | Validate API in Week 0, have backup plan | Jane Doe |
| Poor network connectivity at lots | Medium | Medium | Offline mode with sync when online | John Smith |
-->

**Risk Levels:**
- **Likelihood:** Low / Medium / High
- **Impact:** Low / Medium / High

---

## **17. Open Questions** 🔴

**Instructions:** What don't we know yet? What needs to be answered before we can proceed?

| Question | Owner | Due Date | Answer |
|----------|-------|----------|--------|
| [Your question] | [Name] | [YYYY-MM-DD] | [To be filled in] |
| [Your question] | [Name] | [YYYY-MM-DD] | [To be filled in] |

<!-- EXAMPLES (delete these rows after filling out your own):
| What fields does PlanetX API return? | Jane Doe | 2026-03-01 | TBD |
| How many FSMs conduct lot audits per month? | John Smith | 2026-03-05 | TBD |
-->

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

<!-- EXAMPLES (delete these rows after filling out your own):
| Discovery | Week 0-1 | User interviews, API validation | Jane Doe | ❓ Not Started |
| Design | Week 2-3 | Wireframes, user flows | John Smith | ❓ Not Started |
| Development | Week 4-7 | MVP build | Dev Team | ❓ Not Started |
| Testing | Week 8 | QA, bug fixes | QA Team | ❓ Not Started |
| Pilot | Week 9-12 | Pilot in Dallas/Houston | Jane Doe | ❓ Not Started |
| Evaluation | Week 13 | Pilot results, go/no-go decision | Jane Doe | ❓ Not Started |
-->

**Key Dates:**
- **Project Kickoff:** [YYYY-MM-DD]
- **MVP Launch:** [YYYY-MM-DD]
- **Pilot Start:** [YYYY-MM-DD]
- **Go/No-Go Decision:** [YYYY-MM-DD]

---

## **19. Go-to-Market Considerations** 🟡

**Instructions:** How will this product be launched and communicated?

### **Launch Plan:**
- **Who is the target audience for launch?** [Your answer]
- **How will we communicate the launch?** [Your answer]
- **What is the rollout strategy?** [Your answer]

<!-- EXAMPLE (delete after filling out):
- Target audience: "50 FSMs in Dallas/Houston"
- Communication: "Email announcement, training sessions"
- Rollout strategy: "Pilot → Phased rollout → Full launch"
-->

### **Success Criteria for Launch:**
- [ ] [Your criterion]
- [ ] [Your criterion]
- [ ] [Your criterion]

<!-- EXAMPLES (delete after filling out):
- [ ] 80% of pilot users complete training
- [ ] 50+ audits completed in first month
- [ ] User satisfaction score >4/5
-->

---

## **20. Stakeholder Sign-Off** 🔴

**Instructions:** Who needs to approve this PRD before development begins?

| Stakeholder | Role | Approval Status | Date | Comments |
|-------------|------|----------------|------|----------|
| [Name] | [Role] | ❓ Pending | [YYYY-MM-DD] | [Comments] |
| [Name] | [Role] | ❓ Pending | [YYYY-MM-DD] | [Comments] |
| [Name] | [Role] | ❓ Pending | [YYYY-MM-DD] | [Comments] |

<!-- EXAMPLES (delete these rows after filling out your own):
| Jane Doe | VP Product | ❓ Pending | 2026-03-01 | Waiting for review |
| John Smith | Engineering Lead | ❓ Pending | 2026-03-01 | Waiting for review |
| Sarah Johnson | Finance | ❓ Pending | 2026-03-01 | Waiting for review |
-->

**Approval Levels:**
- ❓ **Pending** - Awaiting review
- ✅ **Approved** - Signed off
- ❌ **Rejected** - Needs changes

---

## **21. Appendix** 🟡

### **Research & Data:**
- [Link to user research]
- [Link to competitive analysis]
- [Link to market data]
- [Link to financial models]

### **References:**
- [Related PRDs]
- [Technical documentation]
- [External resources]

### **Change Log:**

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| [YYYY-MM-DD] | 1.0 | Initial draft | [Your name] |
| [YYYY-MM-DD] | 1.1 | [What changed] | [Your name] |

<!-- EXAMPLE (delete these rows after filling out your own):
| 2026-02-15 | 1.0 | Initial draft | Jane Doe |
| 2026-02-20 | 1.1 | Updated based on stakeholder feedback | Jane Doe |
-->

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



