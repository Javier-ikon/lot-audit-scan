/**
 * NXTG Design System — re-export shim.
 *
 * The canonical source of these tokens is prototype/src/theme.ts, so the
 * production prototype and the mockup harness consume the same runtime values.
 *
 * Kept here so existing `import { ... } from './theme'` paths in *.mockup.tsx
 * files continue to work without churn.
 */

export { colors, spacing, radius, typography, fontColor } from '../src/theme';
