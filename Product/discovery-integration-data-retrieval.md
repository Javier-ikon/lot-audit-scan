# Discovery: Integration Data Retrieval

**Initiative:** Ikon Lot Scan (Lot Audit)  
**Owner:** [TBD]  
**Status:** Not Started  
**Created:** 2026-02-27  
**Target completion:** [TBD]

---

## 1. Purpose

Determine **what device and vehicle data can be retrieved** through available integrations when given a VIN. This discovery directly addresses PRD §17 Open Questions: *"Does PlanetX expose API with required fields?"*

**Goal:** Document the data fields available from each integration so we can:
- Confirm whether the required scan response fields can be satisfied
- Identify gaps and fallback strategies
- Inform API design and data mapping before implementation

---

## 2. Required Data (per PRD)

The app needs these fields per scan (source: [scan-response-schema.md](./scan-response-schema.md), PRD §15):

| Field | Data Type | Purpose | Required? |
|-------|-----------|---------|-----------|
| Serial (IMEI) | string | Device identifier | Yes |
| Activated | datetime | Device activation date | Yes |
| Last Report Date | datetime | Last telemetry report | Yes |
| Company | string | Dealer/company name | Yes |
| Group | string | Subfleet/group name | Yes |
| Notes | string | Free-form notes | Yes (may be empty) |

**Source paths (from PlanetX / existing systems):** See [scan-response-schema.md § Source Payload Structure](./scan-response-schema.md) for expected source paths (e.g. `data.gpsTime`, `tObjectData.cache_device_data.deviceID`, etc.).

---

## 3. Integrations to Investigate

| System | Purpose | API Available? (PRD §12) | Owner | Priority |
|--------|---------|--------------------------|-------|----------|
| PlanetX | VIN → IMEI lookup, device/vehicle data | ❓ Unknown | [TBD] | P0 |
| Dealer Portal | Dealer/company context | ❓ Unknown | [TBD] | P1 |
| Ikon Toolbox | Device status, telemetry | ❓ Unknown | [TBD] | P1 |

**Assumption (PRD §16):** PlanetX (or equivalent) is the primary source for VIN → device lookup.

---

## 4. Discovery Questions

### 4.1 PlanetX (or equivalent)

1. **API availability**
   - Is there a VIN lookup API (or equivalent)?
   - What authentication method is used (API key, OAuth, etc.)?
   - Are there rate limits or throttling?

2. **VIN lookup**
   - Does the API accept VIN as input?
   - What is the response structure (JSON, XML)?
   - Does the response include IMEI/Serial for the device linked to the VIN?

3. **Data fields**
   - Which of the 6 required fields are available in the API response?
   - For each field, what is the exact path/attribute name and data format?
   - Are there additional fields that could be useful (e.g. odometer, battery voltage)?

4. **Gaps and constraints**
   - Which required fields are **not** exposed by the API?
   - Where might those fields live (Dealer Portal, Ikon Toolbox, another system)?
   - Are there known limitations (e.g. Activated/Notes require a separate metadata API)?

### 4.2 Dealer Portal

1. Is there an API or programmatic access?
2. What dealer/company/group data is available?
3. Can it be joined with VIN or device ID from PlanetX?

### 4.3 Ikon Toolbox

1. Is there an API for device status or telemetry?
2. What fields are available (Last Report Date, etc.)?
3. Can it be queried by VIN or by IMEI/Serial?

---

## 5. Deliverables

| Deliverable | Description |
|-------------|-------------|
| **Integration matrix** | Table: Field × System — which system provides each required field |
| **API specs (draft)** | For each relevant API: endpoint, auth, request/response format |
| **Gap analysis** | List of required fields not available from any integration; proposed workarounds |
| **Recommendation** | Go/no-go for MVP; suggested data flow (single API vs. multiple API calls) |
| **Update PRD §17** | Replace "Does PlanetX expose API with required fields?" with findings |

---

## 6. Validation Criteria

- [ ] All 6 required fields mapped to at least one source (or explicit gap documented)
- [ ] At least one integration confirmed to support VIN lookup
- [ ] API documentation or sample responses obtained for primary integration
- [ ] Gaps and mitigation options documented

---

## 7. Dependencies and Blockers

- Access to API documentation or technical contacts for PlanetX
- Access to Dealer Portal and Ikon Toolbox technical contacts (if applicable)
- Test credentials or sandbox environment (if available)

---

## 8. References

- [prd.md](./prd.md) — §10.1 Dependencies, §15 Data & Privacy, §17 Open Questions
- [scan-response-schema.md](./scan-response-schema.md) — Required fields and source paths
- [status-classification-rules.md](./status-classification-rules.md) — How retrieved data feeds classification
