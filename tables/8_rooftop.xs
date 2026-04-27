// Stores dealership rooftop locations for lot audits
// Each rooftop belongs to one account (multi-tenant isolation)
table rooftop {
  auth = false

  schema {
    // Unique identifier for the rooftop
    int id
  
    // When the rooftop was created
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // When the rooftop was last updated
    timestamp updated_at?=now {
      visibility = "private"
    }
  
    // Multi-tenant isolation - CRITICAL
    // New: Explicit dealer group ownership for selection flow (preferred going forward)
    // Note: Temporarily optional to allow migration; make required after data backfill
    int dealer_group_id? {
      table = "dealer_group"
    }
  
    // Legacy/compat: existing account ownership (kept for backward compatibility)
    // TODO: deprecate once APIs fully migrate to dealer_group_id
    int account_id? {
      table = "account"
    }
  
    // Name of the dealership location (e.g., 'Friendly Chevrolet Dallas')
    text name filters=trim
  
    // Physical address of the rooftop
    text location? filters=trim
  
    // Unique dealer code for identification
    text dealer_code? filters=trim
  
    // City where the rooftop is located
    text city? filters=trim
  
    // State where the rooftop is located
    text state? filters=trim
  
    // ZIP code of the rooftop location
    text zip_code? filters=trim
  
    // Status of the rooftop
    // Current status of the rooftop
    enum status?=active {
      values = ["active", "inactive", "archived"]
    }
  
    // Contact information
    // Primary contact person at the rooftop
    text contact_name? filters=trim
  
    // Contact phone number
    text contact_phone? filters=trim
  
    // Contact email address
    text contact_email? filters=trim|lower
  
    // Metadata
    // Additional rooftop metadata (e.g., operating hours, special instructions)
    json metadata?
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "dealer_group_id"}]}
    {type: "btree", field: [{name: "account_id"}]}
    {type: "btree", field: [{name: "status"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "btree|unique"
      field: [{name: "dealer_code", op: "asc"}]
    }
  ]

  tags = ["ikon-lot-scan", "multi-tenant"]
}