# CSV Report Schema

Specification for the standardized lot audit report (FR-006). Generated at session end for download.

---

## Column Order

Columns appear in this order. Header row uses these exact labels.

| # | Column (Header) |
|---|-----------------|
| 1 | Serial |
| 2 | Activated |
| 3 | Subscription Expires |
| 4 | First Report Date |
| 5 | Last Report Date |
| 6 | GPS Signal |
| 7 | Last Known Location |
| 8 | IP Port |
| 9 | Battery |
| 10 | Lat, Long |
| 11 | Company |
| 12 | Group |
| 13 | Notes |
| 14 | Stock |
| 15 | Vehicle name |
| 16 | VIN |
| 17 | Year, Make, Model |
| 18 | Color |
| 19 | Initial Odometer |
| 20 | Odometer |
| 21 | Last Install Odometer |
| 22 | Current Odometer |
| 23 | Vehicle Type |
| 24 | License Plate |
| 25 | Price (MSRP) |
| 26 | Installation |
| 27 | Install Date |
| 28 | Install Location |
| 29 | Installer Name |
| 30 | Starter Interrupt Installed |

---

## Field Definitions

See [data-mapping.md](./data-mapping.md) for definitions, data types, and sample values per field.

---

## Notes

- One row per scanned vehicle.
- Empty cells for missing/optional data.
- Date/time format: use Web UI format (M/D/YYYY HH:mm) or ISO 8601 per reporting standard.
- Summary section (counts, exceptions) defined separately if required.

---

**Last updated:** 2026-02-25  
**PRD reference:** FR-006, §9 In Scope (Complete audit & generate report)
