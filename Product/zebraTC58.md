# Zebra TC58 — Device Specification for Ikon Lot Scan

Rugged handheld for lot audits. FSM use case: scan VIN barcodes through windshield glass in all weather conditions (Dallas heat, Houston humidity). Consumer phones are not suitable; TC58 is enterprise-grade and used by FedEx/UPS for package scanning.

---

## Why the Zebra TC58?

- Rugged handheld built for outdoor, industrial use
- Dedicated barcode scanner (1D/2D)
- All-day battery
- IP68 rating (water/dust)
- 600 nits display (readable in direct sunlight)
- Temperature range: -4°F to 122°F
- Multi-touch with gloves

---

## Core Hardware (Relevant for App)

| Spec | Value |
|------|-------|
| **OS** | Android 11 or 13 |
| **Display** | 6.0" Full HD (1080 x 2160), 600 nits |
| **Touch** | Bare fingers, gloved, stylus; works with water droplets |
| **Scan engine** | SE4720 (standard) or SE55 (advanced range) |

---

## Barcode Scanning (VIN Use Case)

| Barcode Type | Range | Notes |
|--------------|-------|-------|
| 1D linear (windshield VIN) | 6–12 in through glass | Both SE4720 and SE55 |
| 2D DataMatrix (OEM tags) | 4–12 in | Both support |
| Damaged/faded | — | SE55 better |

- **SE4720:** Adequate for MVP; 1D/2D imager, ~3 ft range
- **SE55:** Better for damaged codes, up to ~40 ft
- **OCR (plain-text VIN):** Out of scope for MVP (would use 16 MP camera + ML Kit in V2)

**Integration:** DataWedge (Zebra’s barcode middleware); EMDK for advanced control.

---

## Connectivity

| Type | Details |
|------|---------|
| Cellular | 5G + 4G, nano SIM + eSIM |
| Wi‑Fi | Wi‑Fi 6E (802.11ax), dual band |
| Bluetooth | 5.2, BLE |

**Recommendation:** Prefer Wi‑Fi at lots when possible; fall back to cellular. Both support real-time API calls.

---

## Battery

| Option | Runtime | Notes |
|--------|---------|------|
| Standard (4680 mAh) | ~8–10 h real use | ~50,000 scans/charge |
| Extended (7000 mAh) | 12–15 h | Extra weight |

**Recommendation:** Standard battery for ~8‑hour shifts; one spare per device and vehicle charger between lots.

---

## Durability

| Spec | Value |
|------|-------|
| **Water/dust** | IP68 (6 ft / 30 min), IP65 (water jets) |
| **Drops** | MIL‑STD‑810H; 6 ft to concrete with boot |
| **Operating temp** | -4°F to 122°F |
| **Humidity** | 5–95% non-condensing |

**Recommendation:** Always use the protective boot.

---

## Physical

- **Size:** 6.48" × 3.04" × 0.66"
- **Weight:** ~10.3 oz (293 g) with standard battery
- **Controls:** Dual scan buttons (left/right), optional trigger handle

---

## Developer Integration

| Resource | Purpose |
|----------|---------|
| **DataWedge** | Primary method for barcode scanning in Android app |
| **EMDK for Android** | Advanced control if DataWedge is insufficient |
| **Zebra TechDocs** | Full developer docs |

**DataWedge:** Receives scanned data and delivers it to the app (e.g. via Intent or keyboard wedge).

---

## Reference Links

### Official Zebra

- [TC53/TC58 Product Spec Sheet (PDF)](https://www.zebra.com/us/en/products/mobile-computers/handheld/tc58.html)
- [TC53/TC58 Product Page](https://www.zebra.com/us/en/products/mobile-computers/handheld/tc58.html)
- [TC53/TC58 User Guide](https://www.zebra.com/us/en/support-downloads.html)
- [DataWedge Developer Guide](https://developer.zebra.com/)
- [EMDK for Android](https://developer.zebra.com/)

### Developer

- [Zebra TechDocs Portal](https://techdocs.zebra.com/)
- [Zebra Developer Community](https://developer.zebra.com/community/home)

---

**Last updated:** 2026-02-25  
**PRD reference:** Device/Hardware — Zebra TC58 (Operational Readiness §13)
