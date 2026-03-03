# Ikon Lot Scan — Prototype

React Native (Expo) prototype for the lot audit app. Screen flow per [Product/app-flow.md](../Product/app-flow.md).

## E2E Tests (Playwright)

Validate the app flow and rooftop dropdown via Playwright:

```bash
# One-time: install browsers (required on first run)
npx playwright install

# Start the web app (in one terminal)
npm run web

# Run E2E tests (in another terminal; reuses server on :8081)
npm run test:e2e
```

Tests live in `e2e/`:
- **rooftop-dropdown.spec.ts** — Dropdown behavior (trigger, modal, selection)
- **app-flow.spec.ts** — Login → Rooftop → Scan → Result, End audit

## Flow

1. **Login** → SSO placeholder → Rooftop Selection
2. **Rooftop Selection** → Pick rooftop, Start audit → Scanning
3. **Scanning** → Enter VIN (17 chars) or scan → Scan Result
4. **Scan Result** → Next vehicle → Scanning, or End audit → End Audit Confirm
5. **End Audit Confirm** → Confirm or cancel
6. **Session Complete** → Download CSV, New audit, or Finish

## Run

```bash
cd prototype
npm start
# Then press i (iOS) or a (Android), or scan QR with Expo Go
```

## Structure

- `src/screens/` — Screen components
- `src/navigation/` — Stack navigator and types
- `src/types/` — Scan result types
- `src/constants.ts` — Mock rooftops
