// Cleanup task — auto-abandons in_progress sessions older than 8 hours
// Runs every hour as a safety net for interrupted audits
task cleanup_stale_sessions {
  stack {
    // Calculate the cutoff timestamp (now minus 8 hours = -28800 seconds)
    var $cutoff {
      value = now|add_secs_to_timestamp:-28800
    }

    // Find all stale in_progress sessions
    db.query audit_session {
      where = $db.audit_session.status == "in_progress" && $db.audit_session.started_at < $cutoff
    } as $stale_sessions

    // Abandon each stale session
    foreach ($stale_sessions) {
      each as $session {
        db.edit audit_session {
          field_name  = "id"
          field_value = $session.id
          data = {
            status  : "abandoned"
            ended_at: now
          }
        } as $_

        debug.log {
          value = {
            source    : "cleanup_stale_sessions"
            session_id: $session.id
            user_id   : $session.user_id
            started_at: $session.started_at
            reason    : "Auto-abandoned after 8 hours with no completion"
          }
          description = "Log abandoned session"
        }
      }
    }
  }

  schedule = [{starts_on: 2026-04-26 00:00:00+0000, freq: 3600}]

  history = "inherit"
  guid = "BvX9YfGreFY0mEV4iM_6Ifd6gFY"
}
