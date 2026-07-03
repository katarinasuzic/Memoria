import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type SearchBarProps = TextInputProps & {
  showMic?: boolean;
};

export function SearchBar({ showMic = true, style, ...rest }: SearchBarProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
      <TextInput
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text }, style]}
        {...rest}
      />
      {showMic ? <Ionicons name="mic-outline" size={20} color={theme.primary} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    height: 48,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    height: '100%',
  },
});
