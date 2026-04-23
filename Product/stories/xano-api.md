## Xano API Stories — App ↔ Xano (Proxies to Planet X: 4 endpoints only)

Context
- Scope limited to four upstream capabilities: Login, Dealer Groups, Rooftops, Device details by VIN.
- App talks to Xano only. Xano proxies to Planet X for these four and returns normalized data.
- Session management and CSV generation exist in Xano but are out of scope for this page.

References
- Planet X scope: ./planetx-api.md
- Scan response (normalized): ../scan-response-schema.md
- CSV columns: ../csv-report-schema.md

---

XANO-API-01 Login (proxy to Planet X)
- Endpoint: POST /auth/login
- Description: Authenticate user via Planet X and return an app session token.
- Request (example):
<augment_code_snippet mode="EXCERPT">
```json
{ "username": "user@example.com", "password": "secret" }
```
</augment_code_snippet>
- Response (example):
<augment_code_snippet mode="EXCERPT">
```json
{ "token": "xano_jwt", "user": { "id": "u_123", "email": "user@example.com" } }
```
</augment_code_snippet>
- Acceptance Criteria:
  - Valid creds → 200 with Xano auth token; Planet X token stored server-side.
  - Invalid creds → 401 with user-safe message; no credential echoing.
  - Errors mapped to a stable schema (no upstream leakage).

XANO-API-02 Dealer Groups (proxy to Planet X)
- Endpoint: GET /dealer-groups
- Description: Return dealer groups for the authenticated user.
- Response (example):
<augment_code_snippet mode="EXCERPT">
```json
[{ "id": "dg_123", "name": "Friendly Auto Group" }]
```
</augment_code_snippet>
- Acceptance Criteria:
  - Returns list of groups (id, name) for current user.
  - 200 on success; upstream failures mapped to 401/5xx accordingly.

XANO-API-03 Rooftops by Dealer Group (proxy to Planet X)
- Endpoint: GET /rooftops?dealer_group_id=dg_123
- Description: Return rooftops for a selected dealer group.
- Response (example):
<augment_code_snippet mode="EXCERPT">
```json
[{ "id": "rt_456", "name": "Friendly Chevrolet - Downtown", "dealer_group_id": "dg_123" }]
```
</augment_code_snippet>
- Acceptance Criteria:
  - Filters rooftops by dealer_group_id.
  - 403 if caller lacks membership to the requested group.

XANO-API-04 Scan VIN (proxy to Planet X)
- Endpoint: POST /audit/scan-vin
- Description: Validate VIN, call Planet X VIN lookup, normalize fields, and return result.
- Request (example):
<augment_code_snippet mode="EXCERPT">
```json
{ "session_id": "sess_001", "vin": "1HGCM82633A004352", "scan_method": "barcode" }
```
</augment_code_snippet>
- Response (example, minimum):
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
- Acceptance Criteria:
  - Reject invalid VIN (HTTP 400) before calling Planet X.
  - On success, return normalized fields per scan-response-schema.md.
  - Upstream timeouts/5xx mapped to a stable error; 404 when VIN not found.

Notes
- Xano persists scan snapshots and may add status classification in the response; Planet X provides raw data only.

