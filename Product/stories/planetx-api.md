## Planet X API Stories (Limited to required 4 endpoints)

Context
- Scope limited to these Planet X integrations only: Login, Dealer Groups, Rooftops, and Device Details by VIN. All other logic (authorization checks, persistence, classification, CSV) remains in Xano.

References
- Scan response: ../scan-response-schema.md
- CSV columns: ../csv-report-schema.md
- Classification rules: ../status-classification-rules.md

---

PX-API-01 Login (Planet X)
- Description: Xano proxies user credentials to Planet X for authentication.
- Acceptance Criteria:
  - App → Xano: POST /auth/login with username/password.
  - Xano → Planet X: forwards credentials to Planet X login endpoint.
  - Success: 200 from Xano with app session token; Planet X token is stored server-side (not exposed to client).
  - Failure: 401 is returned with a user-safe error message; no secret leakage.

Example (illustrative)
<augment_code_snippet mode="EXCERPT">
```http
POST /auth/login
{ "username": "u", "password": "p" }
```
</augment_code_snippet>

PX-API-02 Dealer Groups (Planet X)
- Description: Fetch dealer groups available to the authenticated user via Planet X.
- Acceptance Criteria:
  - App → Xano: GET /dealer-groups
  - Xano → Planet X: fetches groups for the user context.
  - Response includes list of groups with at least id and name.
  - Errors from Planet X are mapped to a stable error in Xano (e.g., 401/5xx) without exposing upstream details.

Example (illustrative)
<augment_code_snippet mode="EXCERPT">
```json
[
  { "id": "dg_123", "name": "Friendly Auto Group" }
]
```
</augment_code_snippet>

PX-API-03 Rooftops by Dealer Group (Planet X)
- Description: Fetch rooftops for a selected dealer group.
- Acceptance Criteria:
  - App → Xano: GET /rooftops?dealer_group_id=dg_123
  - Xano → Planet X: fetches rooftops for that dealer_group_id in the user context.
  - Response includes list of rooftops with at least id, name, and dealer_group_id.
  - If the user does not have access to that group, Xano returns 403.

Example (illustrative)
<augment_code_snippet mode="EXCERPT">
```json
[
  { "id": "rt_456", "name": "Friendly Chevrolet - Downtown", "dealer_group_id": "dg_123" }
]
```
</augment_code_snippet>

PX-API-04 Device Details by VIN (Planet X)
- Description: Look up device/vehicle details by VIN in Planet X and return normalized fields required by the app.
- Acceptance Criteria:
  - App → Xano: POST /audit/sessions/{id}/scans with { vin }.
  - Xano → Planet X: calls VIN/device lookup endpoint.
  - Response (minimum fields): Serial, Last Report Date, Company, Group. Optional (if available): Activated, Notes.
  - Xano normalizes the payload per scan-response-schema.md and persists a snapshot for the session.

Example (illustrative)
<augment_code_snippet mode="EXCERPT">
```json
{
  "Serial": "016723002393428",
  "Last Report Date": "2026-02-24T16:10:21Z",
  "Company": "Friendly Chevrolet",
  "Group": "Friendly Chevrolet"
}
```
</augment_code_snippet>

---

Open Questions (confirm)
1) Do Planet X responses include stable IDs for Company/Group in addition to names? If yes, we’ll use IDs for comparisons; if no, we’ll compare names.
2) Any specific rate limits we should respect for these endpoints?
3) Do you prefer VIN-only lookup, or should we also enable serial lookup later (not in current scope)?

