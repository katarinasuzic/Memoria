import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Palette, Radius, Spacing } from '@/constants/theme';

export type Status = 'Read' | 'Reading' | 'Watched' | 'Watching' | 'Want to Read' | 'DNF';

const STATUS_COLORS: Record<Status, string> = {
  Read: Palette.green,
  Reading: Palette.purple,
  Watched: Palette.cyan,
  Watching: Palette.amber,
  'Want to Read': Palette.pink,
  DNF: Palette.gray600,
};

export type StatusBadgeProps = {
  status: Status;
  size?: 'sm' | 'md';
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const color = STATUS_COLORS[status];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color, paddingVertical: size === 'sm' ? 3 : 5 },
      ]}
    >
      <ThemedText
        type="smallBold"
        style={[styles.text, { fontSize: size === 'sm' ? 11 : 12 }]}
      >
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
