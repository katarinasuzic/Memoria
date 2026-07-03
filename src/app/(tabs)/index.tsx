import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Poster } from '@/components/ui/poster';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StatusBadge } from '@/components/ui/status-badge';
import { IN_PROGRESS_STATUSES, MEDIA_ICON } from '@/data/constants';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useLibrary, useProfile } from '@/hooks/use-library';
import { useTheme } from '@/hooks/use-theme';
import type { LibraryItem } from '@/services/types';

function LibraryRow({ item }: { item: LibraryItem }) {
  const theme = useTheme();
  const router = useRouter();
  const pct =
    item.progress_current != null && item.progress_total
      ? item.progress_current / item.progress_total
      : null;

  return (
    <Card padded={false} onPress={() => router.push(`/item/${item.id}` as never)}>
      <View style={styles.row}>
        {item.cover_url ? (
          <Poster uri={item.cover_url} width={56} radius={Radius.sm} />
        ) : (
          <View style={[styles.noCover, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons name={MEDIA_ICON[item.media_type]} size={20} color={theme.textSecondary} />
          </View>
        )}
        <View style={styles.rowBody}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {item.title}
          </ThemedText>
          {item.subtitle ? (
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
              {item.subtitle}
            </ThemedText>
          ) : null}
          {pct != null ? (
            <View style={styles.progress}>
              <View style={styles.progressBarWrap}>
                <ProgressBar progress={pct} />
              </View>
              <ThemedText type="small" themeColor="textSecondary">
                {Math.round(pct * 100)}%
              </ThemedText>
            </View>
          ) : (
            <View style={styles.badgeWrap}>
              <StatusBadge status={item.status} size="sm" />
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

function Section({ title, items }: { title: string; items: LibraryItem[] }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.section}>
      <ThemedText type="sectionTitle" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      <View style={styles.sectionList}>
        {items.map((item) => (
          <LibraryRow key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: library, isLoading } = useLibrary();

  const displayName = profile?.display_name ?? profile?.username ?? user?.email?.split('@')[0] ?? 'there';

  const items = library ?? [];
  const reading = items.filter((i) => i.media_type === 'book' && IN_PROGRESS_STATUSES.includes(i.status));
  const watching = items.filter((i) => i.media_type !== 'book' && IN_PROGRESS_STATUSES.includes(i.status));
  const recent = items.slice(0, 5);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar name={displayName} size={46} />
            <View>
              <ThemedText type="small" themeColor="textSecondary">
                Welcome back,
              </ThemedText>
              <ThemedText type="subtitle" style={styles.name}>
                {displayName} 👋
              </ThemedText>
            </View>
          </View>
          <Pressable
            style={[styles.bell, { backgroundColor: theme.backgroundElement }]}
            accessibilityLabel="Notifications"
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={20} color={theme.text} />
          </Pressable>
        </View>

        {isLoading ? (
          <ActivityIndicator color={theme.primary} style={styles.loader} />
        ) : items.length === 0 ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="sparkles-outline"
              title="Start your library"
              description="Track the books, movies and shows you love. Add your first story to begin."
            />
            <Pressable
              onPress={() => router.push('/add')}
              style={[styles.cta, { backgroundColor: theme.primary }]}
            >
              <Ionicons name="add" size={20} color={theme.onPrimary} />
              <ThemedText type="smallBold" style={{ color: theme.onPrimary, fontSize: 15 }}>
                Add a story
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <>
            <Section title="Continue Reading" items={reading} />
            <Section title="Continue Watching" items={watching} />
            <Section title="Recently Added" items={recent} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.six,
    paddingBottom: Spacing.seven,
    gap: Spacing.five,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  name: {
    marginTop: -2,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginTop: Spacing.seven,
  },
  emptyWrap: {
    marginTop: Spacing.six,
    alignItems: 'center',
    gap: Spacing.four,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.five,
    height: 50,
    borderRadius: Radius.md,
  },
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {},
  sectionList: {
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  noCover: {
    width: 56,
    height: 84,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.one,
  },
  progress: {
    marginTop: Spacing.two,
    gap: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarWrap: {
    flex: 1,
  },
  badgeWrap: {
    marginTop: Spacing.two,
  },
});
