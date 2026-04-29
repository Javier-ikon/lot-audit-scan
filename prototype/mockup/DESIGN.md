---
version: alpha
name: NXTG Design System
description: Design system for the NXTG (Next Generation) product suite — a professional, data-dense platform targeting automotive and fleet management workflows.
colors:
  # Primary scale — Green theme (default)
  primary: "#1A9375"
  primary-100: "#E8F4F1"
  primary-200: "#D1E9E3"
  primary-300: "#BADFD6"
  primary-400: "#A3D4C8"
  primary-500: "#8CC9BA"
  primary-600: "#76BEAC"
  primary-700: "#5FB39E"
  primary-800: "#48A991"
  primary-900: "#319E83"
  primary-1000: "#1A9375"
  # Secondary scale — Green theme
  secondary: "#126550"
  secondary-100: "#E7F0ED"
  secondary-200: "#CFE0DC"
  secondary-300: "#B8D1CB"
  secondary-400: "#A0C1B9"
  secondary-500: "#88B2A7"
  secondary-600: "#71A396"
  secondary-700: "#599384"
  secondary-800: "#418473"
  secondary-900: "#2A7462"
  secondary-1000: "#126550"
  # Tertiary — deep forest anchor
  tertiary: "#09362B"
  # Neutral scale
  neutral-0: "#F4F4F4"
  neutral-1: "#DCDCDC"
  neutral-2: "#B4B4B4"
  neutral-3: "#B4B4B4"
  neutral-4: "#A5A5A5"
  neutral-5: "#8F8F8F"
  neutral-6: "#828282"
  neutral-7: "#666666"
  neutral-8: "#4F4F4F"
  neutral-9: "#2D2D2D"
  neutral-10: "#111111"
  neutral-white: "#F1FFFA"
  neutral-black: "#181B1E"
  # Semantic status colors
  error: "#E50C0C"
  error-75: "#F07777"
  error-50: "#F28585"
  error-25: "#F9C2C2"
  warning: "#E6B117"
  warning-75: "#ECC451"
  warning-50: "#F3D88B"
  warning-25: "#F9ECC5"
  success: "#13BF24"
  success-75: "#4ECF5B"
  success-50: "#89DF92"
  success-25: "#C4EFC8"
  # Extended palette
  teal-100: "#BFECE5"
  teal-300: "#40C6B1"
  blue-100: "#3361FF"
  blue-200: "#00476D"
  purple-100: "#6A00FF"
  orange-100: "#E64B17"
  pink-100: "#D91668"
  ltgreen-100: "#00B397"
  ltblue-100: "#17A5E6"

typography:
  # Display / Headlines
  display:
    fontFamily: Barlow
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  heading-lg:
    fontFamily: Barlow
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.25
  heading-md:
    fontFamily: Barlow
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.3
  heading-sm:
    fontFamily: Barlow
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.4
  # Body
  body-lg:
    fontFamily: Barlow
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Barlow
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Barlow
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.5
  # Labels — uppercase, wide tracking, used for metadata, section headers, button text
  label-lg:
    fontFamily: Barlow
    fontSize: 0.875rem
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.1em
  label-md:
    fontFamily: Barlow
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Barlow
    fontSize: 0.6875rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.05em

spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 64px
  gutter: 24px
  margin: 32px

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 18px
  2xl: 1.125rem
  full: 9999px

components:
  button-primary:
    backgroundColor: "{colors.primary-1000}"
    textColor: "#FFFFFF"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    height: 2.5rem
    padding: 0 1rem
  button-primary-hover:
    backgroundColor: "{colors.primary-900}"
  button-primary-active:
    backgroundColor: "{colors.secondary-1000}"
  button-primary-disabled:
    backgroundColor: "{colors.neutral-1}"
    textColor: "{colors.neutral-3}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary-1000}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    height: 2.5rem
    padding: 0 1rem
  button-secondary-hover:
    backgroundColor: "{colors.secondary-100}"
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.primary-1000}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    height: 2.5rem
    padding: 0 1rem
  button-destructive:
    backgroundColor: "{colors.error}"
    textColor: "{colors.neutral-white}"
    rounded: "{rounded.sm}"
  badge:
    backgroundColor: "{colors.secondary-1000}"
    textColor: "#FFFFFF"
    typography: "{typography.body-lg}"
    rounded: "{rounded.2xl}"
    height: 2rem
    padding: 0.25rem 0.5rem 0.25rem 0.75rem
  tooltip:
    backgroundColor: "{colors.neutral-10}"
    textColor: "#FFFFFF"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 0.5rem 0.75rem
---

# NXTG Design System

## Overview

NXTG (Next Generation) is a **professional, data-dense platform** for automotive and fleet management workflows. The design language is clean, structured, and utilitarian — optimized for operators and analysts who need to scan large volumes of structured data quickly and act with confidence.

The visual identity conveys **technical authority and clarity**. It avoids decoration in favor of information density, using color purposefully to signal state and hierarchy rather than for aesthetics. The overall feel is institutional and trustworthy, with just enough softness to remain approachable in day-to-day use.

The system supports **two brand themes** — **Green** (default) and **Blue** — each sharing the same typographic and spacing foundation while swapping the primary, secondary, and tertiary color scales. All components reference CSS custom properties (`--primary-*`, `--secondary-*`) so themes are applied globally via a `data-theme` attribute on the root element.

## Colors

The palette is built around a structured 10-step scale for primary, secondary, and tertiary hues, paired with a neutral gray scale and a set of semantic status colors.

- **Primary (#1A9375 — Green theme):** The brand action color. Used for primary buttons, active states, focus rings, and key interactive elements. The full 100–1000 scale allows subtle tonal layering within surfaces.
- **Secondary (#126550 — Green theme):** A deeper complement to primary. Used for hover/active states on primary buttons, badge backgrounds, and secondary interactive surfaces.
- **Tertiary (#09362B):** The deepest anchor tone. Used for high-contrast backgrounds, dark overlays, and brand header gradients.
- **Neutral (0–10):** A true gray ramp from near-white (`#F4F4F4`) to near-black (`#111111`). Font colors, borders, disabled states, and surface fills all draw from this scale. `neutral-10` is the primary text color; `neutral-7` is secondary text; `neutral-5` is tertiary/placeholder text; `neutral-3` is disabled/inactive text.
- **Status colors:** A semantic set for feedback states — `error` (red), `warning` (yellow), `success` (green) — each with 100/75/50/25 opacity tiers for backgrounds, borders, and text.
- **Extended palette:** Teal, blue, purple, orange, pink, ltgreen, ltblue are available for data visualization, tags, and categorical color coding (e.g., `DataTag` component).

## Typography

All typography uses a single typeface: **Barlow** (Google Fonts), loaded via `next/font` with weights 100–700. Its condensed proportions and strong numerals make it well-suited for dense data interfaces.

- **Display / Headlines:** Bold (600–700) at larger sizes for page titles and section anchors.
- **Body:** Regular (400) at 14–16px for readable content, descriptions, and helper text.
- **Labels:** Bold (600–700) with wide letter-spacing (`0.05–0.1em`) and uppercase transforms. Used for button text, section labels, metadata fields, and all UI chrome text. The uppercase + tracking treatment is the primary visual signal for interactive/structural text vs. content text.

Type sizing follows a compact scale appropriate for a data-dense UI, avoiding large display sizes in favor of efficient use of vertical space.

## Layout

The layout follows a **content-first, sidebar-anchored** model. Pages consist of a fixed sidebar navigation and a scrollable main content area. No maximum content width is enforced at the design system level — consumer applications set their own constraints.

Spacing uses a **4px base unit** with a standard scale: `xs` (4px), `sm` (8px), `md` (16px), `lg` (24px), `xl` (32px), `2xl` (64px). Internal component padding typically uses `sm`/`md`; section gaps use `lg`/`xl`.

Component groups and surfaces use consistent internal padding of `24px` (lg) to create visual breathing room within containers. Horizontal gutters are `24px`; page margins are `32px`.

## Elevation & Depth

Depth is conveyed through **tonal layering** rather than heavy drop shadows. Background surfaces use `neutral-0` (`#F4F4F4`); content cards and panels sit on `white` (`#FFFFFF`); secondary containers use `neutral-1` (`#DCDCDC`). This three-layer tonal stack creates clear hierarchy without shadow.

Shadows are used sparingly and only for floating elements:
- **Tooltips:** No box shadow; dark fill provides sufficient contrast.
- **Modals / Dropdowns:** Subtle ambient shadow `box-shadow: -2px -2px 24px 2px rgba(0,0,0,0.2)` to lift overlays above the page.
- **Map markers:** Inner shadow `0px 0px 12px 0px rgba(0,0,0,0.15) inset, 0px 4px 4px 0px rgba(0,0,0,0.25)` for tactile depth on geo elements.

Borders (`border-container-stroke` = `neutral-1`) are the primary tool for defining surface edges.

## Shapes

The shape language is **consistently minimal**. All interactive elements and containers use a **4px corner radius** (`rounded.sm`) — buttons, inputs, cards, code blocks. This provides just enough softness to feel modern while projecting the rigid precision expected of a data platform.

Exceptions are intentional and semantic:
- **Pills / Badges / Filter Tags:** `1.125rem` (`rounded.2xl`) to signal removability or chip-style selection.
- **Tooltips:** `8px` (`rounded.md`) for a slightly softer floating surface.
- **Avatars / Icons in circular contexts:** `9999px` (`rounded.full`).

Never mix sharp corners and pill shapes within the same component group.

## Components

### Buttons

Four styles define the full interaction hierarchy:

- **Primary:** Filled `primary-1000` background, white uppercase text. The single strongest call to action per view. Hover brightens; active shifts to `secondary-1000`.
- **Secondary:** Transparent with a `primary-1000` border. Used for confirmatory or secondary actions alongside a primary button.
- **Tertiary:** No border, no fill. Used for low-emphasis actions, inline triggers, and overflow menus. Shows a `secondary-100` hover fill.
- **Link:** Identical styling to tertiary; used when the action navigates rather than mutates.

Three sizes: `large` (48px), `standard` (40px), `small` (36px). All sizes use `px-4` horizontal padding and full-uppercase Barlow Bold text with wide tracking.

**Destructive variant:** Available on primary, secondary, and tertiary. Swaps color to `error` red. Use only for irreversible delete/remove actions.

Disabled state uses `neutral-1` background and `neutral-3` text across all styles. Never apply opacity to a disabled button — use the explicit token values.

### Badges

Removable selection chips. `secondary-1000` background, white text, `1.125rem` radius, fixed `32px` height. Always paired with a close icon for removal. Do not use badges for read-only labels — use `FilterTag` or `DataTag` instead.

### Inputs & TextAreas

Outlined inputs with `neutral-1` borders. Focus ring uses `primary-1000`. Error state uses `error` ring and red helper text. Label text uses `label-md` style above the field. Helper/error text uses `body-sm` below the field.

### Checkboxes & Toggles

Checkboxes use `primary-1000` fill when checked. Toggles use the same primary fill for the active state with a white thumb. Both include an indeterminate/loading state via the `BaseCheckbox` / `BaseToggle` primitives.

### Tooltips

Dark fill (`#111111`), white `body-md` text, `8px` radius, `8px 12px` padding, max-width `320px`. Positioned via `@floating-ui/react`. Arrow inherits the dark fill color. No entry animation — appear immediately on hover/focus.

### Progress & ProgressBar

`Progress` renders a circular spinner or arc; `ProgressBar` renders a linear track. Both use `primary-1000` as the fill color. Unfilled track uses `neutral-1`.

### DataTag

Categorical colored tags for classifying data records. Color is set via a `color` prop mapped to the extended palette (`teal`, `blue`, `purple`, `orange`, etc.). Text is always white or near-black depending on the palette entry for sufficient contrast.

### FilterTag

Selectable filter chips with a toggled active state. Inactive: neutral border, neutral text. Active: `primary-1000` border and text (or filled variant). Used in filter bars and faceted search UIs.

### EmptyState

Centered illustration + headline + body text + optional CTA button. Use whenever a list, table, or data surface has zero records. Never leave an empty surface without an EmptyState.

### Rating

Star-based rating component. Filled stars use `warning` yellow (`#E6B117`). Supports read-only and interactive modes.

### Loading

Spinner overlay or inline indicator. Uses `primary-1000` color. Full-page loading states use a centered spinner with no background dimming.

### Modal

Overlay with `box-shadow` lift, `4px` radius, white background. Focus trap and `Escape` dismissal are required. Always includes a close button in the top-right corner.

## Do's and Don'ts

- **Do** use `primary` buttons for the single most important action per screen. Never place two primary buttons side by side.
- **Do** draw all text colors from the `font.*` semantic tokens (`font-primary`, `font-secondary`, `font-tertiary`, `font-inactive`) rather than raw neutral values.
- **Do** use status colors (`error`, `warning`, `success`) exclusively for feedback — never for decoration.
- **Do** apply uppercase + tracking to all button text and label-style UI chrome to maintain visual hierarchy.
- **Do** use the `data-theme` attribute to switch between `blue` and `green` themes at the root — never override primary/secondary variables inline.
- **Don't** use raw hex colors in components. Reference Tailwind tokens or CSS custom properties.
- **Don't** mix pill-shaped and sharp-cornered elements in the same component group.
- **Don't** use more than two font weights on a single screen section.
- **Don't** add decorative shadows to static surfaces — reserve shadows for floating/overlay elements.
- **Don't** show an empty data surface without an `EmptyState` component.
- **Don't** use the extended palette (teal, purple, orange, etc.) for primary UI actions — reserve them for data categorization and visualization only.
