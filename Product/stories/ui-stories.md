## UI Stories — Lot Audit Journey (Planet X + Xano)

Context
- Journey: Login → Dealer Group Selection → Rooftop Selection → Scanning → Scan Result → End Audit Confirm → Session Complete (CSV)
- Backend: Planet X is source for auth, groups, rooftops, and telemetry; Xano orchestrates, stores session/scans, and serves CSV.

---

UI-01 Login Screen (Planet X auth)
- Description: Present a single sign-in CTA that authenticates via Xano (which proxies Planet X). On success, navigate to Dealer Group Selection.
- Acceptance Criteria:
  - Button label updated to “Sign in” or “Sign in with Planet X” (final wording TBD).
  - Shows loading while authenticating; on error, show retry.
  - Success navigates to Dealer Group Selection.

UI-02 Dealer Group Selection
- Description: List dealer groups returned from Xano (Planet X memberships). Choose a group to continue.
- Acceptance Criteria:
  - Renders list of dealer groups; tap advances to Rooftop Selection for that group.
  - Empty state with guidance (“No access. Contact admin to be assigned.”).
  - Error state with Retry.

UI-03 Rooftop Selection (with Back to Dealer Group)
- Description: Show rooftops for the chosen dealer group; allow going back to change group.
- Acceptance Criteria:
  - Displays rooftops filtered by selected dealer group.
  - “Start audit” enabled only after a rooftop is selected.
  - Header back navigates to Dealer Group Selection (do not use replace for this transition).
  - Empty state when no rooftops available.

UI-04 Start Audit Session CTA
- Description: On “Start audit,” create session via Xano and move to Scanning with session context.
- Acceptance Criteria:
  - Shows loading while starting; on error, show message + Retry.
  - On success, navigates to Scanning with session_id stored in client state.

UI-05 Scanning Header & Counter
- Description: Persistent header showing selected dealer group and rooftop, plus running scan counter.
- Acceptance Criteria:
  - Header text: Group name (Planet X) and Rooftop name.
  - Counter initializes to 0 when a new session starts.
  - Counter increments once per successful scan result (when Scan Result screen is shown), not on "Next vehicle".
  - Deleting the current scan from the Result screen decrements the counter by 1.
  - Ending the session from the Result screen keeps the incremented count.
  - Counter excludes deleted scans and persists across navigation during the session.

UI-05A Scan Counter Tracking (explicit behavior)
- Description: Define precise counter update rules to avoid off-by-one errors.
- Acceptance Criteria:
  - Scanning → Scan Result navigation passes scanCount + 1.
  - Result → Scanning via "Next vehicle" passes the same scanCount (no additional increment).
  - Result → Scanning via "Delete scan" passes scanCount - 1 (min 0).
  - Rooftop → Start audit → Scanning starts with scanCount = 0.

UI-06 VIN Entry & Validation
- Description: Manual VIN entry and scanner input; validate before lookup.
- Acceptance Criteria:
  - Enforce 17 characters; exclude I/O/Q; uppercase normalization.
  - “Look up” disabled until VIN is valid; invalid shows inline message.
  - Scanner input populates the same field (Zebra intent/wedge ready).

UI-07 Scan Result — Status + Telemetry
- Description: Show PASS or EXCEPTION badge and key fields.
- Acceptance Criteria:
  - Badge reflects status; colors for pass/exception.
  - Fields shown: VIN, Serial, Company/Group, Last Report (min set; align labels with CSV schema where applicable).
  - Actions: “Next vehicle” returns to Scanning; “End audit” goes to End Audit Confirm.

UI-08 Exceptions — Reason Display
- Description: When status is EXCEPTION, display reason and short guidance.
- Acceptance Criteria:
  - Reasons supported: Wrong Rooftop, Not Reporting, Customer Registered.
  - Reason string shown prominently under badge.
  - Optional guidance text (e.g., “Verify rooftop selection”).

UI-09 Delete Scan
- Description: Allow user to delete the last scan from the session.
- Acceptance Criteria:
  - “Delete scan” action present on Result; confirm dialog before delete.
  - After delete, counter decremented; navigate back to Scanning.
  - Soft-delete semantics (UI reflects removal; backend detail out of scope here).

UI-10 End Audit Confirm
- Description: Confirm ending the session; optional notes.
- Acceptance Criteria:
  - Primary: “Yes, end audit”; Secondary: “Cancel”.
  - Shows progress while ending; on error, show Retry and Back.

UI-11 Session Complete + CSV
- Description: Completion screen with CSV download and navigation options.
- Acceptance Criteria:
  - Primary: “Download CSV” opens provided link; disabled until URL available.
  - Secondary: “New audit” returns to Rooftop Selection for the same dealer group.
  - Tertiary: “Finish” returns to Login; no back navigation enabled.

UI-12 Loading, Empty, and Error States (Global)
- Description: Standardize UI states for networked screens.
- Acceptance Criteria:
  - Loading spinners/skeletons on: Login, Groups, Rooftops, Start Session, Scan, End Session.
  - Empty states on: Groups, Rooftops, (optional) Session with zero scans.
  - Error toasts/panels with Retry CTA and non-technical copy.

UI-13 Navigation Stack Rules
- Description: Ensure expected back-navigation per journey map.
- Acceptance Criteria:
  - Dealer Group → Rooftop uses push/navigate (back enabled).
  - Scanning → Result uses replace (loop-friendly); Result “Next vehicle” returns to Scanning.
  - Session Complete disables back; headerBackVisible=false.

UI-14 Labels and Formatting Alignment
- Description: Align on-screen labels with CSV/report schema where practical.
- Acceptance Criteria:
  - Use consistent terms: Group, Rooftop, Serial, Activated, First/Last Report Date, Notes.
  - Dates displayed in local timezone, CSV retains UTC (copy note in UI if needed).

---

Dependencies / Integration Notes
- Xano endpoints: /auth/login, /dealer-groups, /rooftops?dealer_group_id=…, /audit/sessions, /audit/sessions/{id}/scans, /audit/sessions/{id}/end, /audit/sessions/{id}/report.
- Planet X is upstream for auth/memberships/telemetry; UI surfaces loading/errors, but does not expose upstream details.

Open Questions (UI copy/behavior to confirm)
1) Final login CTA wording (“Sign in” vs “Sign in with Planet X”).
2) Whether Delete Scan is Phase 1 or can be deferred.
3) Minimum telemetry fields to show on Result beyond VIN/Serial/Company/Last Report.
4) CSV availability timing: block UI until ready vs allow background and enable when link arrives.

