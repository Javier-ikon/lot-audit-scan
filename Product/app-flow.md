# Ikon Lot Scan — Web App Flow

Screen flow and navigation for the lot audit app.  
**PRD reference:** §11 User Experience, §9 8-step MVP workflow.

---

## Flow Diagram

```
┌─────────────┐
│   LOGIN     │  SSO
└──────┬──────┘
       ▼
┌─────────────────────┐
│ ROOFTOP SELECTION   │  Choose rooftop, Confirm Start
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│  SCANNING SCREEN    │  Scan VIN (barcode/QR) or Manual Entry
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│  SCAN RESULT        │  Status + Action (Pass/Exception), Per-vehicle data, Session count
└──────┬──────────────┘
       │
       ├─── Next vehicle ───► back to SCANNING SCREEN
       │
       └─── End audit ───►
                    ▼
┌─────────────────────┐
│ END AUDIT CONFIRM   │  Confirm end session
└──────┬──────────────┘
       ▼
┌─────────────────────┐
│ SESSION COMPLETE    │  Report ready, Download CSV
└──────┬──────────────┘
       │
       ├─── New audit ───► back to ROOFTOP SELECTION
       │
       └─── Finish ───► (logout / close)
```

---

## Screens (in order)

| # | Screen | Entry | Exit |
|---|--------|-------|------|
| 1 | **Login** | App open | SSO success |
| 2 | **Rooftop Selection** | After login | Select rooftop + start audit |
| 3 | **Scanning** | Audit started | Scan/enter VIN → result |
| 4 | **Scan Result** | After scan | Next vehicle or End audit |
| 5 | **End Audit Confirm** | User taps "End audit" | Confirm or cancel |
| 6 | **Session Complete** | Audit ended | Download report, new audit, or finish |

---

## Screen Responsibilities

| Screen | Purpose |
|--------|---------|
| **Login** | SSO only; redirect to Rooftop Selection on success |
| **Rooftop Selection** | Dropdown of rooftops; "Start audit" button; session tied to selected rooftop |
| **Scanning** | Scanner input + manual VIN entry fallback; VIN validation; submit for lookup |
| **Scan Result** | Show status (Pass/Exception), required action, required fields; session count; "Next vehicle" or "End audit" |
| **End Audit Confirm** | Confirm/cancel end of session |
| **Session Complete** | Download CSV; "New audit" or "Finish" |

---

**Last updated:** 2026-02-25
