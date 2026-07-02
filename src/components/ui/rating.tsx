import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type RatingProps = {
  /** Rating value on a 0-5 scale. */
  value: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  /** Display the numeric value on a /10 scale (e.g. 8.5/10). */
  outOfTen?: boolean;
  onChange?: (value: number) => void;
};

export function Rating({
  value,
  max = 5,
  size = 18,
  showValue = false,
  outOfTen = false,
  onChange,
}: RatingProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.stars}>
        {Array.from({ length: max }).map((_, i) => {
          const filled = i + 1 <= Math.round(value);
          const half = !filled && i + 0.5 <= value;
          const name = filled ? 'star' : half ? 'star-half' : 'star-outline';
          const star = (
            <Ionicons name={name} size={size} color={theme.star} />
          );
          return onChange ? (
            <Pressable key={i} onPress={() => onChange(i + 1)} hitSlop={4}>
              {star}
            </Pressable>
          ) : (
            <View key={i}>{star}</View>
          );
        })}
      </View>
      {showValue ? (
        <ThemedText type="smallBold" themeColor="textSecondary">
          {outOfTen ? `${(value * 2).toFixed(1)}/10` : value.toFixed(1)}
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
