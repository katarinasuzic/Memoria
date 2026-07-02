import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Palette, Radius, Spacing } from '@/constants/theme';

export type Status =
  // Books
  | 'Want to Read'
  | 'Reading'
  | 'Read'
  | 'Re-reading'
  // Movies / TV
  | 'Want to Watch'
  | 'Watching'
  | 'Watched'
  | 'Up to Date'
  | 'Completed'
  | 'Paused'
  | 'Rewatching'
  // Shared
  | 'DNF';

const STATUS_COLORS: Record<Status, string> = {
  'Want to Read': Palette.pink,
  Reading: Palette.purple,
  Read: Palette.green,
  'Re-reading': Palette.cyan,
  'Want to Watch': Palette.pink,
  Watching: Palette.purple,
  Watched: Palette.green,
  'Up to Date': Palette.cyan,
  Completed: Palette.green,
  Paused: Palette.amber,
  Rewatching: Palette.cyan,
  DNF: Palette.gray600,
};

export type StatusBadgeProps = {
  status: Status;
  size?: 'sm' | 'md';
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const color = STATUS_COLORS[status] ?? Palette.gray600;

  return (
    <View
      style={[styles.badge, { backgroundColor: color, paddingVertical: size === 'sm' ? 3 : 5 }]}
    >
      <ThemedText type="smallBold" style={[styles.text, { fontSize: size === 'sm' ? 11 : 12 }]}>
        {status}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
  },
  text: {
    color: '#0B1120',
  },
});
