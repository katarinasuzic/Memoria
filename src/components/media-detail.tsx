import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Poster } from '@/components/ui/poster';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Rating } from '@/components/ui/rating';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { MediaItem } from '@/data/mock';

function DropdownPill({ label, style }: { label: string; style?: object }) {
  const theme = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: theme.backgroundElement }, style]}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
    </View>
  );
}

function ActionButton({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const theme = useTheme();
  return (
    <Pressable style={styles.action}>
      <View style={[styles.actionIcon, { backgroundColor: theme.backgroundElement }]}>
        <Ionicons name={icon} size={22} color={theme.primary} />
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function MediaDetail({ item }: { item: MediaItem }) {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isBook = item.type === 'book';
  const pct = item.progress ? item.progress.current / item.progress.total : 0;

  const actions: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = isBook
    ? [
        { icon: 'checkmark-circle-outline', label: 'Update' },
        { icon: 'create-outline', label: 'Review' },
        { icon: 'chatbox-ellipses-outline', label: 'Quote' },
        { icon: 'ellipsis-horizontal', label: 'More' },
      ]
    : [
        { icon: 'create-outline', label: 'Review' },
        { icon: 'list-outline', label: 'Episodes' },
        { icon: 'stats-chart-outline', label: 'Stats' },
        { icon: 'ellipsis-horizontal', label: 'More' },
      ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.two }]}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </Pressable>
        <Pressable style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Poster uri={item.cover} width={160} radius={Radius.lg} />
        </View>

        <ThemedText type="heading" style={styles.title}>
          {item.title}
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.center}>
          {item.subtitle}
        </ThemedText>

        <View style={styles.metaRow}>
          <Rating value={item.rating} size={16} showValue />
          <View style={[styles.dot, { backgroundColor: theme.textSecondary }]} />
          <ThemedText type="small" themeColor="textSecondary">
            {item.genres.join(', ')}
          </ThemedText>
        </View>

        <DropdownPill label={item.status ?? 'Add status'} style={styles.statusPill} />

        {!isBook ? (
          <View style={styles.selectorRow}>
            <DropdownPill label="Season 1" style={styles.flexPill} />
            <DropdownPill label="Episode 6" style={styles.flexPill} />
          </View>
        ) : null}

        {item.progress ? (
          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <ThemedText type="smallBold">Progress</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {isBook ? `${Math.round(pct * 100)}%` : `${item.progress.current} / ${item.progress.total} episodes`}
              </ThemedText>
            </View>
            <ProgressBar progress={pct} height={8} />
            <ThemedText type="small" themeColor="textSecondary">
              {item.progress.label}
            </ThemedText>
          </View>
        ) : null}

        {isBook ? (
          <View style={[styles.datesCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.dateRow}>
              <ThemedText type="small" themeColor="textSecondary">
                Started
              </ThemedText>
              <ThemedText type="smallBold">May 10, 2024</ThemedText>
            </View>
            <View style={styles.dateRow}>
              <ThemedText type="small" themeColor="textSecondary">
                Last read
              </ThemedText>
              <ThemedText type="smallBold">May 20, 2024</ThemedText>
            </View>
          </View>
        ) : (
          <View style={styles.yourRating}>
            <ThemedText type="smallBold">Your Rating</ThemedText>
            <Rating value={5} size={22} showValue outOfTen />
          </View>
        )}

        <View style={[styles.actions, { borderColor: theme.border }]}>
          {actions.map((a) => (
            <ActionButton key={a.label} icon={a.icon} label={a.label} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.seven,
    gap: Spacing.three,
  },
  hero: {
    alignItems: 'center',
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  title: {
    textAlign: 'center',
  },
  center: {
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  statusPill: {
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },
  selectorRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  flexPill: {
    flex: 1,
    justifyContent: 'space-between',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  progressBlock: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datesCard: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  yourRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.four,
    marginTop: Spacing.four,
  },
  action: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
