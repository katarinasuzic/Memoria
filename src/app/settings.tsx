import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';

type Item = { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string };

const SECTIONS: { title: string; items: Item[] }[] = [
  {
    title: 'Preferences',
    items: [
      { icon: 'color-palette-outline', label: 'Theme', value: 'Dark' },
      { icon: 'notifications-outline', label: 'Notifications' },
      { icon: 'albums-outline', label: 'Media Preferences' },
      { icon: 'language-outline', label: 'Language', value: 'English' },
    ],
  },
  {
    title: 'Account',
    items: [
      { icon: 'lock-closed-outline', label: 'Privacy' },
      { icon: 'link-outline', label: 'Connected Accounts' },
    ],
  },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.two, borderColor: theme.border }]}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </Pressable>
        <ThemedText type="sectionTitle">Settings</ThemedText>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              {section.title.toUpperCase()}
            </ThemedText>
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {section.items.map((item, i) => (
                <View
                  key={item.label}
                  style={[
                    styles.row,
                    i < section.items.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: theme.border,
                    },
                  ]}
                >
                  <Ionicons name={item.icon} size={20} color={theme.primary} />
                  <ThemedText type="default" style={styles.rowLabel}>
                    {item.label}
                  </ThemedText>
                  {item.value ? (
                    <ThemedText type="small" themeColor="textSecondary">
                      {item.value}
                    </ThemedText>
                  ) : null}
                  <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                </View>
              ))}
            </View>
          </View>
        ))}

        <ThemedText type="small" themeColor="textSecondary" style={styles.account}>
          Signed in as {user?.email ?? 'guest'}
        </ThemedText>

        <Pressable
          onPress={signOut}
          style={[styles.signOut, { borderColor: theme.danger }]}
        >
          <Ionicons name="log-out-outline" size={18} color={theme.danger} />
          <ThemedText type="smallBold" style={{ color: theme.danger }}>
            Sign out
          </ThemedText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.five,
  },
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {
    letterSpacing: 1,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.four,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    paddingVertical: Spacing.four,
  },
  rowLabel: {
    flex: 1,
  },
  account: {
    textAlign: 'center',
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    paddingVertical: Spacing.four,
  },
});
