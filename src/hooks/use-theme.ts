/**
 * Memoria is dark-only by design, so the theme hook always returns the dark
 * palette. Kept as a hook so screens/components have a single source of truth
 * and we can revisit multi-theme support later without touching call sites.
 */

import { Colors } from '@/constants/theme';

export function useTheme() {
  return Colors.dark;
}
