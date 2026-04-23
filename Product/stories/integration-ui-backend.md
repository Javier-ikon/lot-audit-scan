## Integration: UI ↔ Xano ↔ Planet X (Stitching the flow)

Scope
- Planet X endpoints used: Login, Dealer Groups, Rooftops, Device details by VIN (see planetx-api.md)
- Xano endpoints used: /auth/login, /dealer-groups, /rooftops, /audit/start-session, /audit/scan-vin, /audit/end-session, /reports/download-csv (see xano-api.md and apis/*)
- UI screens: Login → Dealer Group → Rooftop → Scanning → Scan Result → End Audit Confirm → Session Complete (see ui-stories.md)

Auth model
- App authenticates to Xano via POST /auth/login. Xano proxies to Planet X for verification. Xano returns an app token.
- App includes Authorization: Bearer <xano_token> on all subsequent requests.

---

End-to-end screen ↔ API mapping

1) Login
- UI: Tap “Sign in” → call Xano
- API: POST /auth/login { username/email, password }
- Behavior:
  - On 200: store xano_token; navigate to Dealer Group Selection
  - On 401/5xx: show error + retry

Example
<augment_code_snippet mode="EXCERPT">
```ts
const res = await fetch(`${base}/auth/login`, {
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({ email, password })
});
```
</augment_code_snippet>

2) Dealer Group Selection
- UI: On mount, fetch user’s dealer groups; show list/empty/error
- API: GET /dealer-groups (Xano proxies to Planet X)
- Behavior:
  - 200: render groups; on select, navigate to Rooftop Selection (dealer_group_id)
  - Empty: show access guidance; 5xx: retry option

Example
<augment_code_snippet mode="EXCERPT">
```ts
await fetch(`${base}/dealer-groups`, {
  headers: { Authorization: `Bearer ${token}` }
});
```
</augment_code_snippet>

3) Rooftop Selection
- UI: On mount, fetch rooftops for selected group; enable “Start audit” when a rooftop is chosen; back navigates to Dealer Group
- API: GET /rooftops?dealer_group_id=DG
- Behavior:
  - 200: render rooftops; empty state supported
  - Start audit: POST /audit/start-session { rooftop_id }
  - On success: store session_id; navigate to Scanning with scanCount=0

Example
<augment_code_snippet mode="EXCERPT">
```ts
const sess = await fetch(`${base}/audit/start-session`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ rooftop_id })
});
```
</augment_code_snippet>

4) Scanning (VIN input + header counter)
- UI:
  - Show header with Group + Rooftop (from previous fetches)
  - Validate VIN (17 chars, [A-HJ-NPR-Z0-9])
  - On “Look up”: POST /audit/scan-vin { session_id, vin, scan_method }
  - Navigation: On success, go to Scan Result with scanCount+1 (counter increments upon seeing result)
- API: POST /audit/scan-vin (Xano validates, proxies VIN lookup to Planet X, normalizes fields, persists snapshot)

Example
<augment_code_snippet mode="EXCERPT">
```ts
const res = await fetch(`${base}/audit/scan-vin`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ session_id, vin, scan_method: 'barcode' })
});
```
</augment_code_snippet>

5) Scan Result (status + telemetry, actions)
- UI:
  - Display PASS or EXCEPTION, show VIN, Serial, Company/Group, Last Report
  - If exception, show reason (wrong_rooftop, not_reporting, customer_registered)
  - Actions:
    - Next vehicle → returns to Scanning with same scanCount
    - Delete scan → confirm; returns to Scanning with scanCount-1 (min 0)
    - End audit → navigate to End Audit Confirm
- API:
  - Next/End: no immediate API call
  - Delete: Xano-only endpoint (e.g., DELETE /audit/scans/{scan_id}) — to be added; UI currently prototypes the flow

6) End Audit Confirm → Session Complete
- UI:
  - Confirm → POST /audit/end-session { session_id, notes? }
  - On success: show Session Complete
  - CSV: either open a direct link to GET /reports/download-csv?session_id=ID or use a returned report_url
- API:
  - POST /audit/end-session (implemented): marks session ended, generates CSV, returns { success, report_url? }
  - GET /reports/download-csv?session_id=ID (implemented): returns CSV file as attachment

Example
<augment_code_snippet mode="EXCERPT">
```ts
await fetch(`${base}/audit/end-session`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ session_id, notes })
});
// then open `${base}/reports/download-csv?session_id=${session_id}`
```
</augment_code_snippet>

---

Data contracts (minimum fields)
- From Planet X via Xano (VIN lookup): Serial, Last Report Date, Company, Group; optional Activated, Notes
- Normalized per scan-response-schema.md for UI and CSV mapping per csv-report-schema.md

Status classification (in Xano)
- Wrong Rooftop: compare session’s group/rooftop vs Planet X company/group (prefer IDs if available)
- Not Reporting: now() - Last Report Date > 24h (UTC)
- Customer Registered: dedicated flag from Planet X if available; otherwise disabled

Counter behavior (UI)
- Starts at 0 on new session
- Increments when navigating to Scan Result after a successful scan
- Does not increment on “Next vehicle”
- Decrements on “Delete scan” (min 0)

Error handling (UI patterns)
- Show inline message and Retry for 4xx/5xx on data fetches
- Map 401 to re-login flow; keep messages user-safe (no upstream details)

Security & headers
- All requests include Authorization: Bearer <xano_token>
- JSON content-type on POSTs

Open items (TBD)
- Implement Xano endpoints: GET /dealer-groups and GET /rooftops (proxies to Planet X)
- Add Xano endpoint for deleting a scan (e.g., DELETE /audit/scans/{scan_id})
- Decide if end-session returns report_url vs using GET /reports/download-csv with a direct link
