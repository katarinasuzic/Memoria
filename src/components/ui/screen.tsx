import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ScreenProps = ViewProps & {
  /** Wrap the content in a ScrollView. Defaults to `false`. */
  scroll?: boolean;
  /** Safe-area edges to apply. Defaults to all edges. */
  edges?: readonly Edge[];
  /** Apply default horizontal + vertical padding. Defaults to `true`. */
  padded?: boolean;
  /** Extra bottom padding (e.g. to clear the tab bar). */
  contentBottomInset?: number;
};

export function Screen({
  children,
  style,
  scroll = false,
  edges = ['top', 'left', 'right'],
  padded = true,
  contentBottomInset = 0,
  ...rest
}: ScreenProps) {
  const theme = useTheme();

  const contentStyle = [
    padded && styles.padded,
    { paddingBottom: contentBottomInset },
    style,
  ];

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.grow, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          {...rest}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, contentStyle]} {...rest}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  grow: {
    flexGrow: 1,
  },
  padded: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },
});
