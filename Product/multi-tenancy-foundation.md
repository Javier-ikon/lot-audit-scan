# Multi-Tenancy Foundation — Database & Logic Layer

**Purpose:** Prepare the Lot Scan product for future dealer offering while keeping MVP scope focused on Ikon internal use only.

**Status:** Foundation only — MVP implements single-tenant (Ikon), but database schema supports future multi-tenant expansion.

---

## Strategic Context

### MVP (Phase 1): Single Tenant
- **User:** Ikon FSMs only
- **Data scope:** Ikon dealerships (rooftops) only
- **Access control:** All users see all Ikon rooftops

### Future (Phase 2+): Multi-Tenant
- **Users:** Ikon FSMs + External dealer users
- **Data scope:** Each dealer sees only their own rooftops and audit data
- **Access control:** Tenant-based data isolation

---

## Database Schema — Foundational Design

### Core Principle: Tenant-Aware from Day 1

Every table that contains business data MUST include a `tenant_id` column, even if MVP only uses a single tenant.

---

## Table Definitions

### 1. **tenants** (Foundation table)
Represents organizations that use the system (Ikon, or future external dealers).

| Column | Type | Description | MVP Value |
|--------|------|-------------|-----------|
| `id` | UUID/INT | Primary key | Auto-generated |
| `name` | VARCHAR(255) | Tenant name | "Ikon Technologies" |
| `type` | ENUM | `internal`, `external_dealer` | "internal" |
| `status` | ENUM | `active`, `inactive`, `suspended` | "active" |
| `created_at` | TIMESTAMP | Record creation | Auto |
| `updated_at` | TIMESTAMP | Last update | Auto |

**MVP:** Single row: Ikon Technologies (internal tenant).

---

### 2. **users** (Extends existing auth table)
FSMs and future dealer users.

| Column | Type | Description | Notes |
|--------|------|-------------|-------|
| `id` | UUID/INT | Primary key | From SSO/auth system |
| `tenant_id` | UUID/INT | FK → tenants.id | **REQUIRED** |
| `email` | VARCHAR(255) | User email | From SSO |
| `name` | VARCHAR(255) | Full name | From SSO |
| `role` | ENUM | `fsm`, `admin`, `dealer_user` | MVP: "fsm" only |
| `status` | ENUM | `active`, `inactive` | "active" |
| `created_at` | TIMESTAMP | Record creation | Auto |
| `updated_at` | TIMESTAMP | Last update | Auto |

**MVP:** All users have `tenant_id` = Ikon's tenant ID.

**Index:** `(tenant_id, email)` for fast user lookup within tenant.

---

### 3. **rooftops** (Dealership locations)
Physical dealership locations where audits are performed.

| Column | Type | Description | Notes |
|--------|------|-------------|-------|
| `id` | UUID/INT | Primary key | Auto-generated |
| `tenant_id` | UUID/INT | FK → tenants.id | **REQUIRED** |
| `name` | VARCHAR(255) | Rooftop name | "Friendly Chevrolet" |
| `external_id` | VARCHAR(100) | ID from external system | PlanetX company ID |
| `address` | TEXT | Physical address | Optional |
| `status` | ENUM | `active`, `inactive` | "active" |
| `created_at` | TIMESTAMP | Record creation | Auto |
| `updated_at` | TIMESTAMP | Last update | Auto |

**MVP:** All rooftops have `tenant_id` = Ikon's tenant ID.

**Index:** `(tenant_id, status)` for rooftop selection dropdown.

---

### 4. **audit_sessions**
Represents a single audit session (start to end).

| Column | Type | Description | Notes |
|--------|------|-------------|-------|
| `id` | UUID/INT | Primary key | Auto-generated |
| `tenant_id` | UUID/INT | FK → tenants.id | **REQUIRED** |
| `rooftop_id` | UUID/INT | FK → rooftops.id | Selected rooftop |
| `user_id` | UUID/INT | FK → users.id | FSM who performed audit |
| `status` | ENUM | `in_progress`, `completed`, `cancelled` | Session state |
| `started_at` | TIMESTAMP | Session start time | Auto on start |
| `ended_at` | TIMESTAMP | Session end time | NULL until ended |
| `vehicle_count` | INT | Total vehicles scanned | Incremented per scan |
| `exception_count` | INT | Total exceptions found | Calculated |
| `created_at` | TIMESTAMP | Record creation | Auto |
| `updated_at` | TIMESTAMP | Last update | Auto |

**MVP:** All sessions have `tenant_id` = Ikon's tenant ID.

**Index:** 
- `(tenant_id, user_id, status)` for user's active sessions
- `(tenant_id, rooftop_id, started_at)` for rooftop audit history

---

### 5. **scans**
Individual VIN scans within an audit session.

| Column | Type | Description | Notes |
|--------|------|-------------|-------|
| `id` | UUID/INT | Primary key | Auto-generated |
| `tenant_id` | UUID/INT | FK → tenants.id | **REQUIRED** |
| `audit_session_id` | UUID/INT | FK → audit_sessions.id | Parent session |
| `vin` | VARCHAR(17) | Vehicle VIN | Validated 17 chars |
| `serial` | VARCHAR(50) | Device serial number | From lookup response |
| `status` | VARCHAR(50) | Device status | "Installed", "Not Installed", etc. |
| `scan_method` | ENUM | `barcode`, `qr`, `manual` | How VIN was captured |
| `scan_data` | JSON/JSONB | Full scan response | Raw API response |
| `scanned_at` | TIMESTAMP | Scan timestamp | Auto |
| `created_at` | TIMESTAMP | Record creation | Auto |

**MVP:** All scans have `tenant_id` = Ikon's tenant ID.

**Index:** 
- `(tenant_id, audit_session_id, scanned_at)` for session scan list
- `(tenant_id, vin)` for VIN lookup/duplicate detection

---

## Logic Layer — Tenant Context

### Tenant Context Injection

Every API request MUST include tenant context. This is enforced at the logic layer.

```
Request → Auth Middleware → Tenant Context → Business Logic → Database Query
```

**MVP Implementation:**
```javascript
// Middleware extracts user from SSO token
const user = await getUserFromToken(request.headers.authorization);

// Inject tenant_id into request context
request.tenantId = user.tenant_id;

// All database queries MUST filter by tenant_id
const rooftops = await db.rooftops.findMany({
  where: { tenant_id: request.tenantId, status: 'active' }
});
```

**Future Multi-Tenant:**
Same code works — each user's `tenant_id` automatically isolates their data.

---

## Data Isolation Rules

### Rule 1: Every Query Filters by tenant_id
```sql
-- ✅ CORRECT
SELECT * FROM rooftops WHERE tenant_id = ? AND status = 'active';

-- ❌ WRONG (data leak risk)
SELECT * FROM rooftops WHERE status = 'active';
```

### Rule 2: Foreign Keys Must Match tenant_id
When creating related records, validate tenant ownership:

```javascript
// Creating a scan
const session = await getAuditSession(sessionId, tenantId);
if (!session) throw new Error('Session not found');

// Ensure scan inherits session's tenant_id
await createScan({
  tenant_id: session.tenant_id,  // ✅ Inherit from parent
  audit_session_id: sessionId,
  vin: vinData
});
```

### Rule 3: Cross-Tenant Queries Forbidden
Users can NEVER access data from other tenants, even by accident.

---

## MVP Implementation Checklist

### Database Setup (Phase 1)
- [ ] Create `tenants` table with single Ikon row
- [ ] Add `tenant_id` column to all business tables
- [ ] Set up foreign key constraints: `tenant_id → tenants.id`
- [ ] Create indexes on `(tenant_id, ...)` for all queries
- [ ] Seed Ikon tenant: `INSERT INTO tenants (name, type) VALUES ('Ikon Technologies', 'internal')`

### Logic Layer (Phase 1)
- [ ] Implement tenant context middleware
- [ ] Hard-code `tenant_id` = Ikon's ID for MVP (single tenant)
- [ ] Add `tenant_id` filter to ALL database queries
- [ ] Validate tenant ownership on related record creation

### Testing (Phase 1)
- [ ] Verify all queries include `tenant_id` filter
- [ ] Test that users cannot access data without tenant context
- [ ] Confirm indexes are used (query performance)

---

## Future Migration Path (Phase 2+)

When adding external dealers:

1. **Add new tenant:** `INSERT INTO tenants (name, type) VALUES ('ABC Motors', 'external_dealer')`
2. **Create dealer users:** Assign `tenant_id` = ABC Motors' ID
3. **Import dealer rooftops:** Assign `tenant_id` = ABC Motors' ID
4. **No code changes needed** — tenant isolation already enforced

---

## Security Considerations

### Row-Level Security (RLS)
Consider database-level RLS policies (PostgreSQL example):

```sql
CREATE POLICY tenant_isolation ON rooftops
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

This provides defense-in-depth: even if application code fails to filter, database blocks cross-tenant access.

---

## Summary

| Aspect | MVP (Phase 1) | Future (Phase 2+) |
|--------|---------------|-------------------|
| **Tenants** | 1 (Ikon only) | Multiple (Ikon + dealers) |
| **Schema** | Tenant-aware (foundation ready) | No schema changes needed |
| **Logic** | Single tenant hard-coded | Multi-tenant context injection |
| **Data isolation** | Enforced by `tenant_id` filter | Same enforcement, multiple tenants |
| **Migration effort** | N/A | Add tenants + users, zero code changes |

**Key Principle:** Build the foundation now, activate multi-tenancy later with minimal effort.

---

**Last updated:** 2026-02-26  
**PRD reference:** Future expansion consideration (not in current MVP scope)

