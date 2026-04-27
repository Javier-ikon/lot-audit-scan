// Returns the authenticated user's most recent in_progress session, if any
query "audit/active-session" verb=GET {
  api_group = "audit"
  auth = "user"

  input {}

  stack {
    // Query for any in_progress session belonging to this user
    db.query audit_session {
      where = $db.audit_session.user_id == $auth.id && $db.audit_session.status == "in_progress"
      sort = {started_at: "desc"}
      return = {type: "single"}
    } as $session

    // Count active (non-deleted) scans in this session
    var $scan_count {
      value = 0
    }

    conditional {
      if ($session != null) {
        db.query scan {
          where = $db.scan.audit_session_id == $session.id && $db.scan.is_deleted == false
          return = {type: "count"}
        } as $scan_count
      }
    }
  }

  response = {
    has_active_session: ($session != null)
    session          : $session
    scan_count       : $scan_count
  }
  guid = "fENLrw48Owl95jRDHoRzZCg09AU"
}
