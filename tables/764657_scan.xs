// Stores individual VIN scan records
// Each scan represents one vehicle scanned during an audit session
table scan {
  auth = false

  schema {
    // Unique identifier for the scan
    int id
  
    // When the scan was created
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // Multi-tenant isolation - CRITICAL
    // New: Explicit dealer group ownership (should inherit from audit_session)
    // Note: Temporarily optional to allow migration; make required after data backfill
    int dealer_group_id? {
      table = ""
    }
  
    // Legacy/compat: existing account ownership (kept for backward compatibility)
    // TODO: deprecate once APIs fully migrate to dealer_group_id
    int account_id? {
      table = "account"
    }
  
    // Foreign key reference
    // Reference to the parent audit session
    int audit_session_id {
      table = "audit_session"
    }
  
    // VIN and device information
    // 17-character Vehicle Identification Number
    text vin filters=trim
  
    // IMEI of the device associated with this VIN (from lookup)
    text imei? filters=trim
  
    // Serial number of the device
    text serial? filters=trim
  
    // Scan timing
    // When the VIN was scanned
    timestamp scanned_at?=now
  
    // Scan method
    // How the VIN was captured (barcode scanner, QR code, or manual entry)
    enum scan_method?=barcode {
      values = ["barcode", "qr_code", "manual"]
    }
  
    // Device status classification (from status-classification-rules.md)
    // Classified device status based on lookup results
    enum device_status? {
      values = [
        "installed"
        "not_installed"
        "wrong_dealer"
        "not_reporting"
        "customer_linked"
        "customer_registered"
        "missing_device"
      ]
    
    }
  
    // Exception or pass
    // Whether this scan is classified as an exception (true) or pass (false)
    bool is_exception?
  
    // Device data from PlanetX lookup (stored as JSON for flexibility)
    // Raw device data from PlanetX API lookup
    json device_data?
  
    // Timestamps from device data
    // When the device was activated
    timestamp activated_at?
  
    // Last time the device reported
    timestamp last_report_date?
  
    // Dealer information
    // Company name from device lookup
    text company? filters=trim
  
    // Group name from device lookup
    text group? filters=trim
  
    // Notes and actions
    // Optional notes about this scan
    text notes? filters=trim
  
    // Required action based on device status (e.g., 'Install device', 'Check reporting')
    text required_action? filters=trim
  
    // Metadata
    // Additional scan metadata (e.g., GPS coordinates, photo URLs, weather)
    json scan_metadata?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "dealer_group_id"}]}
    {type: "btree", field: [{name: "account_id"}]}
    {type: "btree", field: [{name: "audit_session_id"}]}
    {type: "btree", field: [{name: "vin"}]}
    {type: "btree", field: [{name: "device_status"}]}
    {type: "btree", field: [{name: "is_exception"}]}
    {type: "btree", field: [{name: "scanned_at", op: "desc"}]}
  ]

  tags = ["ikon-lot-scan", "multi-tenant"]
}