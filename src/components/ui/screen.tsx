import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ScreenProps = ViewProps & {
  /** Wrap the content in a ScrollView. Defaults to `false`. */
  scroll?: boolean;
  /** Safe-area edges to apply. Defaults to all edges. */
  edges?: readonly Edge[];
};

export function Screen({
  children,
  style,
  scroll = false,
  edges = ['top', 'bottom', 'left', 'right'],
  ...rest
}: ScreenProps) {
  const theme = useTheme();

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, style]}
      keyboardShouldPersistTaps="handled"
      {...rest}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, style]} {...rest}>
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
});
