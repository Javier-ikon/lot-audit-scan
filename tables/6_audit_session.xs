// Stores audit session information
// Each audit session represents one FSM's audit of one rooftop
table audit_session {
  auth = false

  schema {
    // Unique identifier for the audit session
    int id
  
    // When the audit session was created
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // When the audit session was last updated
    timestamp updated_at?=now {
      visibility = "private"
    }
  
    // Multi-tenant isolation - CRITICAL
    // New: Explicit dealer group selected by the user when starting an audit
    // Note: Temporarily optional to allow migration; make required after data backfill
    int dealer_group_id? {
      table = ""
    }
  
    // Legacy/compat: existing account ownership (kept for backward compatibility)
    // TODO: deprecate once APIs fully migrate to dealer_group_id
    int account_id? {
      table = "account"
    }
  
    // Foreign key references
    // Reference to the rooftop being audited
    int rooftop_id {
      table = "rooftop"
    }
  
    // Reference to the FSM performing the audit
    int user_id {
      table = "user"
    }
  
    // Session timing
    // When the audit session started
    timestamp started_at?=now
  
    // When the audit session ended (null if still in progress)
    timestamp ended_at?
  
    // Session status
    // Current status of the audit session
    enum status?="in_progress" {
      values = ["in_progress", "completed", "cancelled", "error", "abandoned"]
    }
  
    // Session statistics (computed from scans)
    // Total number of VINs scanned in this session
    int total_scans?
  
    // Total number of exceptions found in this session
    int total_exceptions?
  
    // Total number of passes (normal vehicles) in this session
    int total_passes?
  
    // Session metadata
    // Additional session data (e.g., device info, weather conditions, notes)
    json session_metadata?
  
    // Report generation
    // URL to the generated CSV report (if generated)
    text report_url?
  
    // When the CSV report was generated
    timestamp report_generated_at?
  
    // Notes from FSM
    // Optional notes from the FSM about this audit session
    text notes? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "dealer_group_id"}]}
    {type: "btree", field: [{name: "account_id"}]}
    {type: "btree", field: [{name: "rooftop_id"}]}
    {type: "btree", field: [{name: "user_id"}]}
    {type: "btree", field: [{name: "status"}]}
    {type: "btree", field: [{name: "started_at", op: "desc"}]}
    {type: "btree", field: [{name: "ended_at", op: "desc"}]}
  ]

  tags = ["ikon-lot-scan", "multi-tenant"]
  guid = "LpR2rf0q2AQbGObd_QFrVJNjoGY"
}