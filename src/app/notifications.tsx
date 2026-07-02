import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { notifications, type AppNotification } from '@/data/mock';

const COLOR_MAP: Record<AppNotification['color'], string> = {
  purple: Palette.purple,
  green: Palette.green,
  cyan: Palette.cyan,
  amber: Palette.amber,
  pink: Palette.pink,
};

export default function NotificationsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
        <ThemedText type="sectionTitle">Notifications</ThemedText>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.map((n) => (
          <Pressable
            key={n.id}
            style={[
              styles.row,
              {
                backgroundColor: n.unread ? theme.surface : 'transparent',
                borderColor: theme.border,
              },
            ]}
          >
            <View style={[styles.icon, { backgroundColor: COLOR_MAP[n.color] + '22' }]}>
              <Ionicons name={n.icon} size={20} color={COLOR_MAP[n.color]} />
            </View>
            <View style={styles.body}>
              <ThemedText type="default">{n.text}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {n.time}
              </ThemedText>
            </View>
            {n.unread ? <View style={[styles.dot, { backgroundColor: theme.pink }]} /> : null}
          </Pressable>
        ))}
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
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
