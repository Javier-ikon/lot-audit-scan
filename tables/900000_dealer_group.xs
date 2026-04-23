// Represents external dealer groups (tenants) that own rooftops and audits
// This table is introduced to support explicit "Login → Pick Dealer Group → Pick Rooftop" flow
table dealer_group {
  auth = false

  schema {
    // Unique identifier for the dealer group
    int id
  
    // Audit fields
    timestamp created_at?=now {
      visibility = "private"
    }
  
    timestamp updated_at?=now {
      visibility = "private"
    }
  
    // Dealer group display name (e.g., "Friendly Auto Group")
    text name filters=trim
  
    // Current status of the dealer group
    enum status?=active {
      values = ["active", "inactive", "suspended"]
    }
  
    // External mapping (legacy/source-of-truth identifiers)
    // e.g., "legacy-portal"
    text external_source? filters=trim
  
    text external_group_id? filters=trim
  
    // Convenience unique identifier to emulate compound-unique(external_source, external_group_id)
    // Format suggestion: `${external_source}:${external_group_id}`
    text external_uid? filters=trim
  
    // Optional description/notes
    text description? filters=trim
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "status"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {
      type : "btree|unique"
      field: [{name: "external_uid", op: "asc"}]
    }
  ]

  tags = ["ikon-lot-scan", "multi-tenant"]
}