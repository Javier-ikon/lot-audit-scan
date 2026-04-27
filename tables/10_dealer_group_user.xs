// Maps users to dealer groups with a role (membership)
// Enables: a user can belong to multiple dealer groups
table dealer_group_user {
  auth = false

  schema {
    int id
    timestamp created_at?=now {
      visibility = "private"
    }
  
    // Membership links
    int dealer_group_id {
      table = "dealer_group"
    }
  
    int user_id {
      table = "user"
    }
  
    // Role within the dealer group
    enum role?=member {
      values = ["admin", "member", "fsm"]
    }
  }

  index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "btree", field: [{name: "dealer_group_id"}]}
    {type: "btree", field: [{name: "user_id"}]}
    {
      type : "btree|unique"
      field: [
        {name: "dealer_group_id", op: "asc"}
        {name: "user_id", op: "asc"}
      ]
    }
  ]

  tags = ["ikon-lot-scan", "multi-tenant"]
}