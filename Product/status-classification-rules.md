# Status Classification Rules

Business logic for classifying device status from scan response data. Implemented in the **logic layer** (separate from UI and database).

**PRD reference:** FR-005, §9 In Scope (Identify exception or pass)

---

## Architecture Context

| Layer | Responsibility |
|-------|----------------|
| **UI layer** | Presentation, user interaction |
| **Logic layer** | Status classification, business rules (this document) |
| **Database layer** | Data persistence |

Status is determined in the logic layer from raw scan data; the UI consumes the computed status.

---

## Status Types

| Status | Pass/Exception |
|--------|----------------|
| Installed | Pass |
| Not Reporting | Exception |
| Wrong Dealer | Exception |
| Customer Linked | Exception |
| Not Installed | Exception |
| Missing Device | Exception |

---

## Classification Rules

Evaluate in order. First match wins.

| # | Status | Condition |
|---|--------|-----------|
| 1 | **Not Reporting** | Last Report Date is more than 24 hours before current date/time |
| 2 | **Wrong Dealer (Wrong Rooftop)** | Company name and Group name do not match |
| 3 | **Customer Linked / Registered** | Company name and Group name contain the end customer/consumer name |
| 4 | **Not Installed (Non-registration)** | Company name ends with ` non-registration` AND Group name ends with ` non-registration` |
| 5 | **Missing Device** | API response includes a dedicated "Missing Device" label-value pair (use this field; do not parse Notes) |
| 6 | **Installed** | None of the above; device is on correct rooftop, reporting, and not registered to end customer |

---

## Notes

- **Missing Device:** Currently FSM enters "Missing device" + date in Notes. This initiative adds a dedicated API field; the logic layer checks that field instead of parsing Notes.
- **Evaluation order:** Rules are evaluated top-to-bottom; first match determines status.

---

**Last updated:** 2026-02-25
