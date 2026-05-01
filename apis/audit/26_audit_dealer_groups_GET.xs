// Returns all active dealer groups from the DB
// Short-term: queries dealer_group table directly
// Long-term (E8): swap stack body to call get_dealer_groups_from_planetx function — response shape unchanged
query "audit/dealer-groups" verb=GET {
  api_group = "audit"
  auth = "user"

  input {}

  stack {
    // Query active dealer groups sorted alphabetically by name
    db.query dealer_group {
      where  = $db.dealer_group.status == "active"
      sort   = {name: "asc"}
      return = {type: "list"}
    } as $dealer_groups
  }

  response = $dealer_groups
  guid = "s1TjWfUXG52ffzIGT0vmQnhYHTc"
}
