// Stores information about accounts that users belong to
table account {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // The name of the company.
    text name? filters=trim
  
    // A brief description of the company.
    text description? filters=trim
  
    text location? filters=trim
  
    // Account type: 'internal' for Ikon employees, 'external' for dealer groups
    // Distinguishes between Ikon internal accounts and external dealer group accounts
    enum type?=internal {
      values = ["internal", "external"]
    }
  
    // Account status
    // Current status of the account
    enum status?=active {
      values = ["active", "inactive", "suspended"]
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
  ]

  tags = ["xano:quick-start"]
}