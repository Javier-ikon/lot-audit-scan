// Simplified heartbeat logging table - tracks system events
// Used for monitoring system health and debugging issues
table heartbeat_log {
  auth = false

  schema {
    // Unique identifier for the log entry
    int id
  
    // When the log entry was created
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // Log level (severity)
    enum level?=info {
      values = ["debug", "info", "success", "warning", "error", "critical"]
    }
  
    // Source of the log (e.g., "validate_vin", "start_session")
    text source filters=trim
  
    // Human-readable log message
    text message filters=trim
  
    // Additional context data (JSON) - can contain anything
    json context?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "level"}]}
    {type: "btree", field: [{name: "source"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]

  tags = ["ikon-lot-scan", "logging", "monitoring"]
}