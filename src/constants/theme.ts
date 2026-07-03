/**
 * Memoria design system.
 *
 * Dark-first theme based on the UI/UX concept: clean, minimal, content-focused.
 * Palette, typography (Poppins headings / Inter body) and radii live here.
 */

import '@/global.css';

import { Platform } from 'react-native';

/** Raw brand palette from the design concept. */
export const Palette = {
  purple: '#8B5CF6',
  purpleDark: '#7C3AED',
  cyan: '#22D3EE',
  amber: '#F59E0B',
  green: '#10B981',
  pink: '#EC4899',
  red: '#EF4444',
  gray950: '#0B1120',
  gray900: '#111827',
  gray800: '#1F2937',
  gray700: '#374151',
  gray600: '#4B5563',
  gray400: '#9CA3AF',
  gray200: '#E5E7EB',
  white: '#FFFFFF',
} as const;

/** Semantic dark theme used across the app. */
const dark = {
  primary: Palette.purple,
  primaryDark: Palette.purpleDark,
  accent: Palette.cyan,
  amber: Palette.amber,
  green: Palette.green,
  pink: Palette.pink,
  danger: Palette.red,

  background: Palette.gray900,
  backgroundElement: Palette.gray800,
  backgroundSelected: Palette.gray700,
  surface: Palette.gray800,
  surfaceElevated: '#26324a',
  border: Palette.gray700,

  text: Palette.gray200,
  textSecondary: Palette.gray400,
  textInverse: Palette.gray900,
  onPrimary: Palette.white,

  star: Palette.amber,
} as const;

/**
 * We keep `light`/`dark` keys for API compatibility with the themed
 * primitives, but the app is intentionally dark-only per the design.
 */
export const Colors = {
  light: dark,
  dark,
} as const;

export type ThemeColor = keyof typeof dark;

export const Fonts = {
  heading: 'Poppins_600SemiBold',
  headingBold: 'Poppins_700Bold',
  headingMedium: 'Poppins_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  mono: Platform.select({ ios: 'ui-monospace', default: 'monospace' }) as string,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
  seven: 48,
  eight: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 88, android: 72, default: 72 });
export const MaxContentWidth = 720;
