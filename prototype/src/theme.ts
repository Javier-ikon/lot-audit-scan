/**
 * NXTG Design System — runtime tokens (canonical)
 *
 * Single source of truth for design tokens used by both the production
 * prototype (src/screens) and the mockup harness (mockup/*.mockup.tsx).
 *
 * Spec lives in prototype/mockup/DESIGN.md — keep this file in sync.
 * Do NOT introduce raw hex values in screen files; reference these tokens.
 */

import { Platform, TextStyle } from 'react-native';

// ── Colors ────────────────────────────────────────────────────────────────
export const colors = {
  // Primary scale — Green theme (default)
  primary: '#1A9375',
  primary100: '#E8F4F1',
  primary200: '#D1E9E3',
  primary300: '#BADFD6',
  primary800: '#48A991',
  primary900: '#319E83',
  primary1000: '#1A9375',

  // Secondary scale — Green theme
  secondary: '#126550',
  secondary100: '#E7F0ED',
  secondary900: '#2A7462',
  secondary1000: '#126550',

  // Tertiary — deep forest anchor
  tertiary: '#09362B',

  // Neutral scale
  neutral0: '#F4F4F4',
  neutral1: '#DCDCDC',
  neutral2: '#B4B4B4',
  neutral3: '#B4B4B4',
  neutral4: '#A5A5A5',
  neutral5: '#8F8F8F',
  neutral6: '#828282',
  neutral7: '#666666',
  neutral8: '#4F4F4F',
  neutral9: '#2D2D2D',
  neutral10: '#111111',
  neutralWhite: '#F1FFFA',
  neutralBlack: '#181B1E',
  white: '#FFFFFF',

  // Semantic status
  error: '#E50C0C',
  error75: '#F07777',
  error50: '#F28585',
  error25: '#F9C2C2',
  warning: '#E6B117',
  warning75: '#ECC451',
  warning50: '#F3D88B',
  warning25: '#F9ECC5',
  success: '#13BF24',
  success75: '#4ECF5B',
  success50: '#89DF92',
  success25: '#C4EFC8',

  // Extended palette (data viz / categorical)
  teal100: '#BFECE5',
  teal300: '#40C6B1',
  blue100: '#3361FF',
  blue200: '#00476D',
  purple100: '#6A00FF',
  orange100: '#E64B17',
  pink100: '#D91668',
  ltgreen100: '#00B397',
  ltblue100: '#17A5E6',
} as const;

// ── Spacing (4px base) ────────────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 64,
  gutter: 24,
  margin: 32,
} as const;

// ── Radius ────────────────────────────────────────────────────────────────
export const radius = {
  none: 0,
  sm: 4,   // default — buttons, inputs, cards, code blocks
  md: 8,   // tooltips
  lg: 12,
  xl: 18,  // pills / badges / filter tags (rounded.2xl in spec)
  full: 9999,
} as const;

// ── Typography ────────────────────────────────────────────────────────────
const FONT = 'Barlow, system-ui, -apple-system, sans-serif';

export const typography = {
  fontFamily: FONT,
  display:    { fontFamily: FONT, fontSize: 32, fontWeight: '700', lineHeight: 38, letterSpacing: -0.3 } as TextStyle,
  headingLg:  { fontFamily: FONT, fontSize: 24, fontWeight: '600', lineHeight: 30 } as TextStyle,
  headingMd:  { fontFamily: FONT, fontSize: 20, fontWeight: '600', lineHeight: 26 } as TextStyle,
  headingSm:  { fontFamily: FONT, fontSize: 16, fontWeight: '600', lineHeight: 22 } as TextStyle,
  bodyLg:     { fontFamily: FONT, fontSize: 16, fontWeight: '400', lineHeight: 26 } as TextStyle,
  bodyMd:     { fontFamily: FONT, fontSize: 14, fontWeight: '400', lineHeight: 22 } as TextStyle,
  bodySm:     { fontFamily: FONT, fontSize: 12, fontWeight: '400', lineHeight: 18 } as TextStyle,
  labelLg:    { fontFamily: FONT, fontSize: 14, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' } as TextStyle,
  labelMd:    { fontFamily: FONT, fontSize: 12, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase' } as TextStyle,
  labelSm:    { fontFamily: FONT, fontSize: 11, fontWeight: '500', letterSpacing: 0.55, textTransform: 'uppercase' } as TextStyle,
} as const;

// ── Semantic font color tokens ────────────────────────────────────────────
export const fontColor = {
  primary:   colors.neutral10,
  secondary: colors.neutral7,
  tertiary:  colors.neutral5,
  inactive:  colors.neutral3,
  onDark:    colors.white,
} as const;

// ── Web-only: load Barlow from Google Fonts on first import ───────────────
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const ID = 'barlow-font-link';
  if (!document.getElementById(ID)) {
    const link = document.createElement('link');
    link.id = ID;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Barlow:wght@100;200;300;400;500;600;700;800;900&display=swap';
    document.head.appendChild(link);
  }
}
