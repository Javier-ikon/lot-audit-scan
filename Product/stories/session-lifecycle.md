# Epic: Session Lifecycle — Incomplete Session Handling

**Initiative:** Ikon Lot Scan (Lot Audit)
**Branch:** `feature/demo-mvp`
**Status:** 📋 To Do
**Created:** 2026-04-26
**Owner:** TBD

---

## Epic Summary

When an FSM hard-resets (browser refresh, app close, logout), `AppContext` is wiped and the active `audit_session` row in Xano is left with `status = "in_progress"` indefinitely — orphaned. This corrupts session counts, blocks clean restarts, and leaves incomplete data in the DB.

This epic covers two complementary solutions:
1. **Resume/Abandon UX** — detect an open session on login and let the FSM choose what to do
2. **Cleanup Task** — a scheduled Xano task that auto-abandons stale sessions (safety net)

---

## Stories

---

### SESS-01 — Add `abandoned` status to `audit_session` table

**Status:** 📋 To Do
**Owner:** TBD

#### Context
The `audit_session` status enum currently supports `["in_progress", "completed", "cancelled", "error"]`. There is no terminal state for sessions that were interrupted without being explicitly ended. `abandoned` fills this gap and keeps the audit trail intact without deleting data.

#### Acceptance Criteria
- `"abandoned"` added to the `status` enum in `tables/6_audit_session.xs`
- `end_session.xs` accepts `"abandoned"` as a valid terminal status alongside `"completed"`
- Abandoned sessions are excluded from active reporting and session summary counts
- Existing rows are unaffected

#### Files to update
- `tables/6_audit_session.xs` — add `"abandoned"` to status enum
- `functions/8_end_session.xs` — allow `abandoned` as a terminal status

---

### SESS-02 — Detect open session after login

**Status:** 📋 To Do
**Owner:** TBD

#### Context
After a successful login, the app currently always routes to `StartSessionScreen`. If the FSM had an active `in_progress` session from a previous interrupted audit, it is silently ignored and a new session can be started on top of it.

A check after login should query for any `in_progress` session belonging to the authenticated user and route accordingly.

#### Acceptance Criteria
- After login, before navigating to `StartSessionScreen`, the app calls a `GET /audit/active-session` endpoint
- If an open session exists → navigate to `ResumeSessionScreen` with session details
- If no open session → proceed to `StartSessionScreen` as normal
- The check must be non-blocking — if it fails, fall through to `StartSessionScreen`

#### Files to update
- `apis/audit/` — new `active_session_GET.xs` endpoint
- `prototype/src/screens/LoginScreen.tsx` — add post-login session check

---

### SESS-03 — Resume or abandon screen

**Status:** 📋 To Do
**Owner:** TBD

#### Context
When an open session is detected after login, the FSM needs a clear decision point. Silently resuming could be confusing if the FSM is starting a new audit at a different rooftop. Silently discarding would lose existing scan data.

#### Acceptance Criteria
- New `ResumeSessionScreen` displays:
  - Rooftop name (or ID for demo)
  - Session start time
  - Number of scans already recorded (active, non-deleted)
  - Two actions: **Resume audit** and **Start new audit**
- **Resume** → restore `sessionId` in `AppContext` and navigate to `ScanningScreen` with correct scan count
- **Start new** → call `POST /audit/abandon-session` to mark old session as `abandoned`, then navigate to `StartSessionScreen`
- Screen is skipped entirely if no open session exists

#### Files to update
- `prototype/src/screens/ResumeSessionScreen.tsx` — new screen
- `prototype/src/navigation/types.ts` — add `ResumeSession` route
- `prototype/src/navigation/AppNavigator.tsx` — register new screen

---

### SESS-04 — Abandon session API endpoint

**Status:** 📋 To Do
**Owner:** TBD

#### Context
When the FSM chooses "Start new audit", the previous open session must be cleanly closed with `status = "abandoned"` before a new one is created. This prevents orphaned sessions accumulating in the DB.

#### Acceptance Criteria
- New `POST /audit/abandon-session` endpoint accepts `session_id`
- Sets `status = "abandoned"` and `ended_at = now` on the session row
- Only the session owner can abandon their own session
- Returns `{ success: true }` or a clear error

#### Files to update
- `apis/audit/` — new `abandon_session_POST.xs`
- `functions/` — new `abandon_session.xs` (or reuse `end_session` with status override)

---

### SESS-05 — Scheduled cleanup task for stale sessions (safety net)

**Status:** 📋 To Do
**Owner:** TBD

#### Context
Even with the resume/abandon UX, edge cases exist where sessions get orphaned (e.g., token expires mid-session, server-side errors). A scheduled Xano task provides a safety net by auto-abandoning sessions that have been `in_progress` for longer than 8 hours with no scan activity.

#### Acceptance Criteria
- New Xano task runs every hour via cron
- Queries all `audit_session` rows where `status = "in_progress"` AND `started_at < now - 8 hours`
- Sets `status = "abandoned"` and `ended_at = now` on each stale session
- Logs each abandoned session via `heartbeat_log`
- Does not affect sessions that have scans recorded in the last 8 hours (active sessions)

#### Files to update
- `tasks/` — new `cleanup_stale_sessions.xs`

---

## Dependencies

- `tables/6_audit_session.xs` — SESS-01 (add abandoned status)
- `functions/8_end_session.xs` — SESS-01 (allow abandoned)
- `prototype/src/screens/LoginScreen.tsx` — SESS-02
- `prototype/src/screens/ResumeSessionScreen.tsx` — SESS-03 (new)
- `prototype/src/navigation/` — SESS-03
- `apis/audit/` — SESS-02, SESS-04 (new endpoints)
- `tasks/` — SESS-05 (new task)

## Recommended Execution Order

1. SESS-01 → table + function change (unblocks everything)
2. SESS-04 → abandon API (needed before SESS-03 UI)
3. SESS-02 → active session check post-login
4. SESS-03 → resume/abandon screen
5. SESS-05 → cleanup task (independent, can be done anytime)

## Out of Scope (defer to Phase 2)

- Push notifications to FSM if session auto-abandoned
- Admin dashboard view of abandoned sessions
- Session timeout warning UI (e.g., "Your session will expire in 30 min")
