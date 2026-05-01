// Returns active rooftops for a given dealer group from the DB
// Short-term: queries rooftop table directly
// Long-term (E8): swap stack body to call get_rooftops_from_planetx function — response shape unchanged
query "audit/rooftops" verb=GET {
  api_group = "audit"
  auth = "user"

  input {
    int dealer_group_id
  }

  stack {
    // Query active rooftops for the selected dealer group sorted alphabetically
    db.query rooftop {
      where  = $db.rooftop.dealer_group_id == $input.dealer_group_id && $db.rooftop.status == "active"
      sort   = {name: "asc"}
      return = {type: "list"}
    } as $rooftops
  }

  response = $rooftops
  guid = "doEGpKwyKlhutMF6y8SaA3zLDuk"
}
