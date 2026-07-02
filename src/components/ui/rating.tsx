import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type RatingProps = {
  /** Rating value in its native scale (see `scale`). */
  value: number;
  /** Native scale of `value`: 5 for books, 10 for movies/TV. Defaults to 5. */
  scale?: 5 | 10;
  size?: number;
  showValue?: boolean;
  onChange?: (value: number) => void;
};

const STAR_COUNT = 5;

export function Rating({ value, scale = 5, size = 18, showValue = false, onChange }: RatingProps) {
  const theme = useTheme();
  // Normalise the native value to a 0-5 star scale for display.
  const stars = value / (scale / STAR_COUNT);

  return (
    <View style={styles.container}>
      <View style={styles.stars}>
        {Array.from({ length: STAR_COUNT }).map((_, i) => {
          const filled = i + 1 <= Math.round(stars);
          const half = !filled && i + 0.5 <= stars;
          const name = filled ? 'star' : half ? 'star-half' : 'star-outline';
          const star = <Ionicons name={name} size={size} color={theme.star} />;
          return onChange ? (
            <Pressable key={i} onPress={() => onChange((i + 1) * (scale / STAR_COUNT))} hitSlop={4}>
              {star}
            </Pressable>
          ) : (
            <View key={i}>{star}</View>
          );
        })}
      </View>
      {showValue ? (
        <ThemedText type="smallBold" themeColor="textSecondary">
          {value.toFixed(1)}
          {scale === 10 ? '/10' : ''}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
});
