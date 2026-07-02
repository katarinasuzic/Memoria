import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Option = {
  key: string;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const OPTIONS: Option[] = [
  { key: 'book', label: 'Books', description: 'Track your reading', icon: 'book', color: Palette.purple },
  { key: 'movie', label: 'Movies', description: 'Track your movies', icon: 'film', color: Palette.amber },
  { key: 'show', label: 'TV Shows', description: 'Track your shows', icon: 'tv', color: Palette.cyan },
];

export default function AddModal() {
  const theme = useTheme();
  const router = useRouter();

  const close = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={close} accessibilityLabel="Dismiss" />
      <SafeAreaView edges={['bottom']} style={[styles.sheet, { backgroundColor: theme.background }]}>
        <View style={styles.handle} />
        <View style={styles.headerRow}>
          <ThemedText type="heading">What do you want to add?</ThemedText>
          <Pressable onPress={close} hitSlop={8} style={[styles.close, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons name="close" size={20} color={theme.text} />
          </Pressable>
        </View>
        <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
          Choose a type
        </ThemedText>

        <View style={styles.options}>
          {OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              onPress={close}
              style={({ pressed }) => [
                styles.option,
                { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View style={[styles.optionIcon, { backgroundColor: opt.color + '22' }]}>
                <Ionicons name={opt.icon} size={24} color={opt.color} />
              </View>
              <View style={styles.optionBody}>
                <ThemedText type="smallBold" style={{ fontSize: 16 }}>
                  {opt.label}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {opt.description}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.five,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: '#4B5563',
    marginBottom: Spacing.four,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginBottom: Spacing.three,
  },
  options: {
    gap: Spacing.three,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBody: {
    flex: 1,
    gap: 2,
  },
});
