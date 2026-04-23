# Ikon Lot Scan (Lot Audit) — Stories

**Source:** Product/prd.md only. No assumptions added. Where the PRD does not specify a value, the field is left blank.

**App flow:** [app-flow.md](./app-flow.md) — Screen flow, navigation, and screen responsibilities.

**Prioritization:** RICE was requested; the PRD does not provide Reach, Impact, Confidence, or Effort. Stories are ordered by **workflow dependency** (top = highest priority, bottom = least in flow):
- **Stories 1-6:** Core audit workflow (Login → Rooftop/Session → Scan VIN → Lookup → Status/Actions → Report)
- **Stories 7-12:** Multi-tenancy features (Account creation → Rooftop management → User management → Data isolation)

RICE scores can be added when available.

---

# Story 1 (Highest priority)

## Story Header 🔴

**Title:** Log in once via SSO and reach rooftop selection
**Initiative/PRD:** Ikon Lot Scan (Lot Audit) — Product/prd.md
**Status:** Complete (Modified: Username/Password auth instead of SSO for MVP)
**Owner:** AI Agent
**Created:**
**Last Updated:** 2026-03-09
**Implementation Notes:** Created `functions/auth/login.xs` with username/password authentication. SSO deferred to post-MVP.

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
**Status:** Complete
**Owner:** AI Agent
**Created:**
**Last Updated:** 2026-03-09
**Implementation Notes:** Created `functions/session/start_session.xs`, `functions/session/end_session.xs`, `functions/session/get_active_session.xs` and corresponding APIs in `apis/audit/`

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
**Status:** Complete
**Owner:** AI Agent
**Created:**
**Last Updated:** 2026-03-09
**Implementation Notes:** Created `functions/utils/validate_vin.xs`, `functions/scan/create_scan.xs`, `functions/scan/check_duplicate_vin.xs`

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

PRD §10.1 Dependencies: Scanner / manual input. Scanner integration uses DataWedge on Zebra TC58 — see [zebraTC58.md](./zebraTC58.md).

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
**Status:** Complete (Mock implementation)
**Owner:** AI Agent
**Created:**
**Last Updated:** 2026-03-09
**Implementation Notes:** Created `functions/device/lookup_device_by_vin.xs` (MOCK - returns test data). Replace with actual PlanetX API integration later.

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

**AC1: Successful Lookup**
- Given a valid VIN has been captured, When the system performs lookup, Then the system retrieves VIN → IMEI and device status in real time
  - AND displays the result within 5 seconds (95th percentile)
  - AND shows all required fields per [scan-response-schema.md](./scan-response-schema.md) (Serial, Activated, Last Report Date, Company, Group, Notes)
  - AND the FSM can proceed to next scan

**AC2: No System Switching**
- Given the lookup completes successfully, When the result is displayed, Then all device status information is visible in the app
  - AND the FSM does not need to open PlanetX, Dealer Portal, or Ikon Toolbox
  - AND the data matches what would be shown in those systems

**AC3: Loading State**
- Given the lookup is in progress, When the FSM is waiting, Then a loading indicator appears within 300ms
  - AND the FSM can see which VIN is being looked up
  - AND the FSM cannot scan another VIN until lookup completes or times out

**AC4: Error Handling**
- Given the API returns an error or times out, When the lookup fails, Then the FSM sees a clear error message
  - AND the FSM can retry the lookup
  - AND the FSM can skip this vehicle and continue to the next scan

**AC5: Performance**
- Given 100 consecutive VIN lookups, When measured in production-like conditions, Then 95% complete within 5 seconds
  - AND no lookup exceeds 10 seconds timeout

**Logging:**
- Log all API requests (VIN, timestamp, response time)
- Log all errors (VIN, error type, timestamp)
- Log timeout events

**Metrics:**
- Average lookup response time
- 95th percentile response time
- Error rate (% of failed lookups)
- Timeout rate
- Retry success rate

**Counter measures:**
- If error rate >5%, alert engineering team
- If average response time >3 seconds, investigate API performance

---

### Tech notes and links 🟡

**API Integration:**
- **Endpoint:** [TBD - pending API documentation from PlanetX team]
- **Method:** GET/POST [TBD]
- **Authentication:** [TBD - likely API key or OAuth]
- **Timeout:** 10 seconds
- **Retry logic:** 1 automatic retry on network failure, then manual retry option for user

**Data Mapping:**
- **Input:** VIN (17-character string, validated per FR-003)
- **Output:** See [scan-response-schema.md](./scan-response-schema.md)
  - Serial/IMEI (string)
  - Activated (datetime, format: M/D/YYYY HH:mm)
  - Last Report Date (datetime, format: M/D/YYYY HH:mm)
  - Company (string)
  - Group (string)
  - Notes (string, may be empty)

**Performance:**
- **Target response time:** ≤5 seconds (95th percentile)
- **Loading state:** Appears after 300ms
- **Timeout:** 10 seconds with error message and retry option

**Error Handling:**
- **VIN not found:** Display "VIN not found in system. Please verify VIN and try again."
- **API unavailable:** Display "Unable to connect to device lookup service. Check network connection and retry."
- **Network timeout:** Display "Lookup timed out. Please retry or skip this vehicle."
- **Invalid response:** Log error + display "An error occurred. Please retry or contact support."

**Dependencies:**
- ✅ User is authenticated (Story 1 - FR-001)
- ✅ Audit session is active (Story 2 - FR-002)
- ✅ VIN has been captured and validated (Story 3 - FR-003)

**Outputs (for next steps):**
- Device status data for classification (Story 5 - FR-005)
- Scan data for CSV report (Story 6 - FR-006)

PRD §10.1 Dependencies: PlanetX (or equivalent) API. PRD §17 Open Questions: Does PlanetX expose API with required fields?

---

### QA and Verification 🟡

**How to test:**
- Test with 10+ known VINs with valid device data
- Test with VIN not in system
- Test with network disconnected (airplane mode)
- Test with API endpoint returning 500 error (mock)
- Test with slow network (throttle to 3G speeds)
- Measure response times for 100 consecutive lookups

**Edge cases or errors:**
- VIN exists but has no IMEI assigned
- VIN has multiple devices (if possible)
- API returns partial data (missing fields)
- API returns data in unexpected format
- User scans same VIN twice in one session
- Network drops mid-request

**Out of scope for QA:**
- Offline mode (explicitly out of scope per PRD §9)
- Corrective actions for exceptions (handled in existing systems per PRD §9)
- Data accuracy validation (assumes API data is source of truth)

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

# Story 7 (Multi-Tenancy)

## Story Header 🔴

**Title:** Create dealer group account with admin user
**Initiative/PRD:** Ikon Lot Scan (Lot Audit) — Product/prd.md
**Status:** Backlog
**Owner:**
**Created:**
**Last Updated:**

**PRD reference:** FR-008, §9 In Scope (Multi-Tenancy), §7 User Stories (Multi-Tenancy)

---

### 1. Context and Background 🟡

**Why now:** Enable multi-tenancy so dealer groups can create their own accounts and manage their own rooftops and users independently.
**Related problem/opportunity:** PRD §3 — Multi-Tenancy Edition: Dealer groups need self-service account creation to onboard without Ikon intervention.
**User research or data:**

---

### 2. User Story 🔴

As a Dealer Group Administrator,
I want to create an account for my dealer group,
So that I can manage my rooftops and users independently.

---

### 3. Acceptance Criteria 🔴

**From PRD FR-008:** Dealer groups can create accounts with admin user.

- Given a new dealer group wants to use the app, When the admin creates an account, Then a new account record is created with the admin as the first user.
- Given the account is created, When the admin logs in, Then the admin has full permissions to manage rooftops and users for their account.
- Given the account is created, When any user from this account performs actions, Then all data is isolated by account_id.

**Logging:**
- Log account creation events (account_id, admin user_id, timestamp)
- Log account creation failures

**Metrics:**
- Number of accounts created per month
- Time to complete account creation
- Account creation success rate

**Counter measures:**
- If account creation fails, provide clear error message and support contact

---

### Tech notes and links 🟡

**API Integration:**
- Existing Xano API: `apis/members_accounts/3573285_account_POST.xs`
- Creates account and assigns creator as admin
- See [multi-tenancy-foundation.md](./multi-tenancy-foundation.md) for schema design

**Data Model:**
- `account` table serves as tenant boundary
- `user` table has `account_id` foreign key
- `user.role` enum: `["admin", "member"]`

**Dependencies:**
- User authentication (Story 1 - FR-001)

---

### QA and Verification 🟡

**How to test:**
- Create new account with valid data
- Verify admin user is created and linked to account
- Verify admin can access account management features
- Verify data isolation (admin cannot see other accounts' data)

**Edge cases or errors:**
- Duplicate account names
- Invalid email format
- Network failure during creation
- User already exists in another account

**Out of scope for QA:**
- Payment/billing integration
- Account deletion (not in MVP)

---

# Story 8 (Multi-Tenancy)

## Story Header 🔴

**Title:** Manage rooftops (add, edit, remove) within dealer group account
**Initiative/PRD:** Ikon Lot Scan (Lot Audit) — Product/prd.md
**Status:** Backlog
**Owner:**
**Created:**
**Last Updated:**

**PRD reference:** FR-009, §9 In Scope (Multi-Tenancy), §7 User Stories (Multi-Tenancy)

---

### 1. Context and Background 🟡

**Why now:** Dealer groups need to manage their own dealership locations (rooftops) without Ikon support.
**Related problem/opportunity:** PRD §3 — Multi-Tenancy Edition: Admins need self-service rooftop management to add new locations as they expand.
**User research or data:**

---

### 2. User Story 🔴

As a Dealer Group Administrator,
I want to add, edit, and remove rooftops for my dealer group,
So that my users can perform audits at the correct locations.

---

### 3. Acceptance Criteria 🔴

**From PRD FR-009:** Admins can manage rooftops within their account.

- Given the admin is logged in, When the admin adds a new rooftop, Then the rooftop is created with the admin's account_id.
- Given the admin has rooftops, When the admin edits a rooftop, Then only rooftops belonging to the admin's account can be edited.
- Given the admin has rooftops, When the admin removes a rooftop, Then only rooftops belonging to the admin's account can be removed.
- Given a rooftop is removed, When users try to select it, Then it no longer appears in the rooftop selection list.

**Logging:**
- Log rooftop creation, updates, deletions (rooftop_id, account_id, admin user_id, timestamp)

**Metrics:**
- Number of rooftops per account
- Rooftop management actions per month

**Counter measures:**
- Prevent deletion of rooftops with active audit sessions
- Warn before deleting rooftops with historical data

---

### Tech notes and links 🟡

**Data Model:**
- New `rooftop` table required with fields:
  - `id` (int, primary key)
  - `account_id` (int, foreign key to account)
  - `name` (text)
  - `address` (text)
  - `created_at` (datetime)
- See [multi-tenancy-foundation.md](./multi-tenancy-foundation.md) for schema design

**API Requirements:**
- POST `/rooftop` - Create rooftop (admin only)
- PUT `/rooftop/{id}` - Update rooftop (admin only, same account)
- DELETE `/rooftop/{id}` - Delete rooftop (admin only, same account)
- GET `/rooftop` - List rooftops (filtered by user's account_id)

**Dependencies:**
- Account creation (Story 7 - FR-008)
- User authentication (Story 1 - FR-001)

---

### QA and Verification 🟡

**How to test:**
- Admin creates rooftop, verify it appears in rooftop list
- Admin edits rooftop, verify changes are saved
- Admin deletes rooftop, verify it's removed from list
- Non-admin user tries to manage rooftops, verify permission denied
- User from Account A tries to edit rooftop from Account B, verify permission denied

**Edge cases or errors:**
- Duplicate rooftop names within same account
- Deleting rooftop with active audit sessions
- Deleting rooftop with historical audit data
- Network failure during rooftop operations

**Out of scope for QA:**
- Rooftop geolocation/mapping
- Rooftop capacity/inventory management

---

# Story 9 (Multi-Tenancy)

## Story Header 🔴

**Title:** Invite and manage users within dealer group account
**Initiative/PRD:** Ikon Lot Scan (Lot Audit) — Product/prd.md
**Status:** Backlog
**Owner:**
**Created:**
**Last Updated:**

**PRD reference:** FR-010, §9 In Scope (Multi-Tenancy), §7 User Stories (Multi-Tenancy)

---

### 1. Context and Background 🟡

**Why now:** Dealer groups need to add their own field staff and managers to perform audits.
**Related problem/opportunity:** PRD §3 — Multi-Tenancy Edition: Admins need to invite users with appropriate roles (admin, member, fsm) to their account.
**User research or data:**

---

### 2. User Story 🔴

As a Dealer Group Administrator,
I want to invite users to my dealer group account,
So that my field staff can perform audits at our rooftops.

---

### 3. Acceptance Criteria 🔴

**From PRD FR-010:** Admins can invite users with roles.

- Given the admin is logged in, When the admin invites a user, Then the user receives an invitation email with account details.
- Given a user accepts the invitation, When the user logs in, Then the user is associated with the admin's account_id.
- Given the admin invites a user, When setting the role, Then the admin can assign roles: admin, member, or fsm.
- Given the admin manages users, When viewing the user list, Then only users from the admin's account are visible.
- Given the admin manages users, When updating or removing a user, Then only users from the admin's account can be modified.

**Logging:**
- Log user invitations (inviter user_id, invitee email, role, timestamp)
- Log user role changes (admin user_id, target user_id, old role, new role, timestamp)
- Log user removals (admin user_id, removed user_id, timestamp)

**Metrics:**
- Number of users per account
- User invitation acceptance rate
- Average time from invitation to first login

**Counter measures:**
- Limit number of pending invitations per account
- Expire invitations after 7 days

---

### Tech notes and links 🟡

**API Integration:**
- Existing Xano API: `apis/members_accounts/3573284_user_join_account_POST.xs`
- Existing Xano API: `apis/members_accounts/3573280_account_my_team_members_GET.xs`
- Existing Xano API: `apis/members_accounts/3573281_admin_user_role_POST.xs`

**Data Model:**
- `user` table already has `account_id` and `role` fields
- `role` enum: `["admin", "member"]` (may need to add "fsm")
- See [multi-tenancy-foundation.md](./multi-tenancy-foundation.md) for schema design

**Email Integration:**
- Need email service for sending invitations
- Email should include: account name, inviter name, role, invitation link

**Dependencies:**
- Account creation (Story 7 - FR-008)
- User authentication (Story 1 - FR-001)

---

### QA and Verification 🟡

**How to test:**
- Admin invites user with email, verify invitation sent
- User accepts invitation, verify user added to account
- Admin assigns different roles, verify permissions work correctly
- Admin views user list, verify only same-account users visible
- Admin from Account A tries to modify user from Account B, verify permission denied

**Edge cases or errors:**
- Invite user who already exists in another account
- Invite user with invalid email
- User accepts expired invitation
- Admin tries to remove themselves (last admin)
- Network failure during invitation

**Out of scope for QA:**
- User profile management (beyond role)
- User deactivation (vs. deletion)
- Bulk user import

---

# Story 10 (Multi-Tenancy)

## Story Header 🔴

**Title:** Enforce data isolation by account_id across all queries
**Initiative/PRD:** Ikon Lot Scan (Lot Audit) — Product/prd.md
**Status:** Backlog
**Owner:**
**Created:**
**Last Updated:**

**PRD reference:** FR-011, §9 In Scope (Multi-Tenancy), §15 Data & Privacy (Multi-Tenancy Data Isolation)

---

### 1. Context and Background 🟡

**Why now:** Critical security requirement to prevent data leakage between dealer groups.
**Related problem/opportunity:** PRD §15 — Multi-Tenancy Data Isolation: Every query must filter by account_id to ensure users only see their own data.
**User research or data:**

---

### 2. User Story 🔴

As a System,
I want to enforce account_id filtering on all database queries,
So that users can only access data from their own dealer group.

---

### 3. Acceptance Criteria 🔴

**From PRD FR-011:** All queries filter by account_id.

- Given any database query is executed, When the query accesses tenant-aware tables, Then the query MUST include `WHERE account_id = {current_user.account_id}`.
- Given a user tries to access data, When the data belongs to a different account, Then the system returns empty results or permission denied.
- Given a user creates new records, When the record is saved, Then the record MUST include the user's account_id.
- Given a user updates records, When validating the update, Then the system MUST verify the record belongs to the user's account.

**Logging:**
- Log all data access attempts with account_id
- Log any attempts to access cross-account data (security alert)

**Metrics:**
- Number of cross-account access attempts (should be 0)
- Query performance with account_id filtering

**Counter measures:**
- Alert security team if cross-account access attempts detected
- Implement row-level security (RLS) at database level

---

### Tech notes and links 🟡

**Data Isolation Rules:**
Per [multi-tenancy-foundation.md](./multi-tenancy-foundation.md):

1. **Every business table includes `account_id`:**
   - `rooftop` table: `account_id` (FK to account)
   - `audit_session` table: `account_id` (FK to account)
   - `scan` table: `account_id` (FK to account)
   - `user` table: Already has `account_id`

2. **Every query filters by `account_id`:**
   ```
   // CORRECT ✅
   db.query("rooftop").where("account_id", authUser.account_id).all()

   // INCORRECT ❌ - Missing account_id filter
   db.query("rooftop").all()
   ```

3. **Foreign key validation:**
   - When creating audit_session, verify rooftop.account_id == user.account_id
   - When creating scan, verify audit_session.account_id == user.account_id

**Implementation:**
- Add `account_id` column to all new tables
- Update all existing queries to include account_id filter
- Add database constraints to enforce referential integrity
- Consider implementing Row-Level Security (RLS) policies

**Dependencies:**
- All previous stories (data model must be in place)

---

### QA and Verification 🟡

**How to test:**
- Create test data for Account A and Account B
- User from Account A tries to query data, verify only Account A data returned
- User from Account A tries to access Account B record by ID, verify permission denied
- User from Account A creates record, verify account_id is set correctly
- Review all API endpoints to ensure account_id filtering

**Edge cases or errors:**
- User with no account_id (should not be possible)
- Query without account_id filter (should fail code review)
- Cross-account foreign key references (should be prevented by constraints)

**Out of scope for QA:**
- Super admin access (Ikon staff viewing all accounts)
- Account migration/transfer

---

# Story 11 (Multi-Tenancy)

## Story Header 🔴

**Title:** Filter rooftop selection by user's account
**Initiative/PRD:** Ikon Lot Scan (Lot Audit) — Product/prd.md
**Status:** Backlog
**Owner:**
**Created:**
**Last Updated:**

**PRD reference:** FR-012, §9 In Scope (Multi-Tenancy), §7 User Stories (Multi-Tenancy)

---

### 1. Context and Background 🟡

**Why now:** Users should only see and select rooftops belonging to their dealer group.
**Related problem/opportunity:** PRD §3 — Multi-Tenancy Edition: Rooftop selection must be scoped to user's account to prevent confusion and errors.
**User research or data:**

---

### 2. User Story 🔴

As a Dealer Group Field Staff,
I want to see only my dealer group's rooftops when selecting a location,
So that I don't accidentally audit the wrong dealership.

---

### 3. Acceptance Criteria 🔴

**From PRD FR-012:** Rooftop selection filtered by account_id.

- Given the user is on the rooftop selection screen, When the rooftop list loads, Then only rooftops with account_id matching the user's account_id are displayed.
- Given the user selects a rooftop, When starting an audit, Then the audit_session is created with the user's account_id.
- Given a user from Account A, When viewing rooftops, Then rooftops from Account B are never visible.

**Logging:**
- Log rooftop selection (user_id, rooftop_id, account_id, timestamp)

**Metrics:**
- Number of rooftops per account
- Most frequently selected rooftops per account

**Counter measures:**
- If user has no rooftops in their account, display helpful message to contact admin

---

### Tech notes and links 🟡

**Implementation:**
- Update rooftop query to filter by `authUser.account_id`
- Ensure rooftop dropdown/list only shows same-account rooftops
- Validate rooftop_id belongs to user's account before creating audit_session

**Query Example:**
```
// Get rooftops for current user's account
db.query("rooftop")
  .where("account_id", authUser.account_id)
  .orderBy("name", "asc")
  .all()
```

**Dependencies:**
- Rooftop management (Story 8 - FR-009)
- Data isolation enforcement (Story 10 - FR-011)
- Rooftop selection (Story 2 - FR-002)

---

### QA and Verification 🟡

**How to test:**
- Create rooftops for Account A and Account B
- Login as user from Account A, verify only Account A rooftops visible
- Login as user from Account B, verify only Account B rooftops visible
- Attempt to start audit with rooftop from different account (via API), verify rejected

**Edge cases or errors:**
- User account has no rooftops
- User account has 100+ rooftops (pagination/search needed)
- Rooftop deleted while user is selecting it

**Out of scope for QA:**
- Rooftop search/filtering (beyond account_id)
- Rooftop favorites/recent

---

# Story 12 (Multi-Tenancy)

## Story Header 🔴

**Title:** Generate account-scoped audit reports
**Initiative/PRD:** Ikon Lot Scan (Lot Audit) — Product/prd.md
**Status:** Backlog
**Owner:**
**Created:**
**Last Updated:**

**PRD reference:** FR-013, §9 In Scope (Multi-Tenancy), §7 User Stories (Multi-Tenancy)

---

### 1. Context and Background 🟡

**Why now:** Audit reports must only include data from the user's dealer group.
**Related problem/opportunity:** PRD §3 — Multi-Tenancy Edition: Reports must be scoped to account to ensure data privacy and relevance.
**User research or data:**

---

### 2. User Story 🔴

As a Dealer Group Field Staff,
I want my audit reports to include only my dealer group's data,
So that I don't see irrelevant data from other dealer groups.

---

### 3. Acceptance Criteria 🔴

**From PRD FR-013:** Reports scoped to user's account.

- Given the user completes an audit, When generating the CSV report, Then the report includes only scans from the current audit session (which belongs to user's account).
- Given the user views historical reports, When listing past audits, Then only audit sessions from the user's account are visible.
- Given the user downloads a report, When the CSV is generated, Then all data (rooftop, scans, summary) belongs to the user's account.

**Logging:**
- Log report generation (user_id, audit_session_id, account_id, timestamp)
- Log report downloads

**Metrics:**
- Number of reports generated per account
- Average report size per account
- Report download frequency

**Counter measures:**
- If report generation fails, provide clear error message and retry option

---

### Tech notes and links 🟡

**Implementation:**
- Update report query to filter by `authUser.account_id`
- Ensure audit_session query filters by account_id
- Ensure scan query filters by account_id (via audit_session)

**Query Example:**
```
// Get audit sessions for current user's account
db.query("audit_session")
  .where("account_id", authUser.account_id)
  .orderBy("created_at", "desc")
  .all()

// Get scans for specific audit session (already scoped by account via session)
db.query("scan")
  .where("audit_session_id", sessionId)
  .all()
```

**Report Format:**
- Same CSV format as FR-006 (see [csv-report-schema.md](./csv-report-schema.md))
- Add account_name to report header/metadata (optional)

**Dependencies:**
- Report generation (Story 6 - FR-006)
- Data isolation enforcement (Story 10 - FR-011)
- Audit session management (Story 2 - FR-002)

---

### QA and Verification 🟡

**How to test:**
- User from Account A completes audit, verify report contains only Account A data
- User from Account B completes audit, verify report contains only Account B data
- User views historical reports, verify only same-account sessions visible
- Attempt to download report from different account (via API), verify rejected

**Edge cases or errors:**
- User has no completed audits (empty report list)
- Audit session has no scans (empty report)
- Report generation timeout for large datasets

**Out of scope for QA:**
- Cross-account reporting (Ikon admin view)
- Report scheduling/automation
- Report analytics/dashboards

---

**End of stories.** Last updated from PRD: 2026-03-03 (Multi-Tenancy Edition).

---

# Legacy Integration Stubs (MVP bridge) — Jira stories

These stories create temporary stub endpoints to simulate legacy system behavior until real integrations are available. Keep contracts stable so the stub can be swapped with minimal client changes. Controlled via feature flag `use_legacy_stubs=true`.

## GDL-4033 — Stub: Legacy Login → Xano

**Goal:** Simulate legacy authentication and return memberships (dealer groups) to unblock UI flow.

**Acceptance Criteria**
- When stub mode is ON, POST `/legacy/login` returns 200 with `legacy_user_id` and `dealer_groups[]` (each: `id`, `name`).
- Return 401 for invalid credentials.
- Include `dealer_group_id`s to preserve multi-tenant isolation end-to-end.
- Contract remains stable for drop-in replacement with real legacy auth.
- Metrics: login success %, p95 < 100 ms (stub), error rate.

**Sample 200 response**
```
{
  "legacy_user_id": "lgcy_123",
  "dealer_groups": [
    {"id": 101, "name": "Friendly Auto Group"}
  ]
}
```

**Sample 401 response**
```
{"error":"invalid_credentials"}
```

## GDL-4034 — Stub: Legacy Rooftops (by dealer group) → Xano

**Goal:** Return a scoped list of rooftops for a given dealer group to unblock rooftop selection.

**Acceptance Criteria**
- Input required: `dealer_group_id`.
- When stub mode is ON, GET `/legacy/rooftops?dealer_group_id={id}` returns 200 with `rooftops[]` (each: `id`, `name`, `dealer_code`, `status`).
- Return 200 with `[]` if the group has no rooftops.
- Scope strictly to provided `dealer_group_id` (no cross-tenant leakage).
- Metrics: success %, p95 < 100 ms (stub).

**Sample 200 response**
```
{
  "dealer_group_id": 101,
  "rooftops": [
    {"id": 5001, "name": "Friendly Chevrolet - Dallas", "dealer_code": "FR-DAL", "status": "active"}
  ]
}
```

## GDL-4035 — Stub: Legacy Start Session → Xano

**Goal:** Simulate creating a legacy audit session so scanning can proceed.

**Acceptance Criteria**
- Input: `dealer_group_id`, `rooftop_id`, `user_id` (from legacy login stub).
- When stub mode is ON, POST `/legacy/start-session` returns 200 with `legacy_session_id` and `started_at` (ISO8601).
- Validate membership: 403 if `user_id` not in `dealer_group_id`; 404 if `rooftop_id` not in group.
- Contract stable for real endpoint swap later.
- Metrics: success %, p95 < 100 ms (stub).

**Sample 200 response**
```
{
  "legacy_session_id": "sess_abc123",
  "dealer_group_id": 101,
  "rooftop_id": 5001,
  "user_id": "lgcy_123",
  "started_at": "2026-03-31T21:30:00Z"
}
```

### Implementation notes (Xano)
- Implement as feature-flagged branches in the `.xs` layer (e.g., `if (use_legacy_stubs) { return stub } else { call real }`).
- Mirror final response shapes to minimize client churn when swapping to real integrations.
- Add lightweight timing and count metrics to support p95 and success/error tracking.

