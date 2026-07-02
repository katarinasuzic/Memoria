import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Poster } from '@/components/ui/poster';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Rating } from '@/components/ui/rating';
import { Screen } from '@/components/ui/screen';
import { SectionHeader } from '@/components/ui/section-header';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';
import {
  books,
  currentUser,
  detailHref,
  feedFilters,
  friendsActivity,
  recommended,
  shows,
  upcomingEpisodes,
  type MediaItem,
} from '@/data/mock';

function ContinueCard({ item }: { item: MediaItem }) {
  const theme = useTheme();
  const router = useRouter();
  const pct = item.progress ? item.progress.current / item.progress.total : 0;

  return (
    <Card padded={false} onPress={() => router.push(detailHref(item) as never)}>
      <View style={styles.continueRow}>
        <Poster uri={item.cover} width={64} radius={Radius.sm} />
        <View style={styles.continueBody}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {item.title}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            {item.subtitle}
          </ThemedText>
          <View style={styles.continueProgress}>
            <ProgressBar progress={pct} />
            <View style={styles.continueMeta}>
              <ThemedText type="small" themeColor="textSecondary">
                {item.progress?.label}
              </ThemedText>
              <ThemedText type="smallBold" style={{ color: theme.primary }}>
                {Math.round(pct * 100)}%
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [feedFilter, setFeedFilter] = useState<string>('Everyone');
  const displayName = user?.email?.split('@')[0] ?? currentUser.name;

  return (
    <Screen padded={false} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
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
            <View style={[styles.bellDot, { backgroundColor: theme.pink }]} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Continue Reading" onAction={() => {}} />
          <ContinueCard item={books[0]} />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Continue Watching" onAction={() => {}} />
          <ContinueCard item={shows[0]} />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Upcoming Episodes" onAction={() => {}} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
            {upcomingEpisodes.map((ep) => (
              <Card key={ep.id} padded={false} style={styles.upcomingCard}>
                <View style={styles.upcomingRow}>
                  <Poster uri={ep.cover} width={44} radius={Radius.sm} />
                  <View style={styles.upcomingBody}>
                    <ThemedText type="smallBold" numberOfLines={1}>
                      {ep.show}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {ep.label}
                    </ThemedText>
                    <ThemedText type="smallBold" style={{ color: theme.primary }}>
                      {ep.date}
                    </ThemedText>
                  </View>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Friends Activity" onAction={() => {}} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {feedFilters.map((f) => (
              <Chip key={f} label={f} selected={feedFilter === f} onPress={() => setFeedFilter(f)} />
            ))}
          </ScrollView>
          <View style={styles.feed}>
            {friendsActivity.map((f) => (
              <Card key={f.id}>
                <View style={styles.feedHeader}>
                  <Avatar name={f.name} size={40} />
                  <View style={styles.feedBody}>
                    <ThemedText type="smallBold" numberOfLines={2}>
                      {f.name} {f.action} {f.title}
                    </ThemedText>
                    <View style={styles.feedMeta}>
                      <Rating value={f.rating} size={12} />
                      <ThemedText type="small" themeColor="textSecondary">
                        · {f.time}
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <View style={[styles.feedActions, { borderTopColor: theme.border }]}>
                  <View style={styles.feedAction}>
                    <Ionicons name="heart-outline" size={18} color={theme.textSecondary} />
                    <ThemedText type="small" themeColor="textSecondary">
                      {f.likes}
                    </ThemedText>
                  </View>
                  <View style={styles.feedAction}>
                    <Ionicons name="chatbubble-outline" size={17} color={theme.textSecondary} />
                    <ThemedText type="small" themeColor="textSecondary">
                      {f.comments}
                    </ThemedText>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Recommended for You" onAction={() => {}} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
            {recommended.map((item) => (
              <View key={item.id} style={styles.railItem}>
                <Poster uri={item.cover} width={128} onPress={() => router.push(detailHref(item) as never)} />
                <ThemedText type="smallBold" numberOfLines={1} style={styles.railTitle}>
                  {item.title}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                  {item.subtitle}
                </ThemedText>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
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
  bellDot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  section: {
    gap: 0,
  },
  continueRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  continueBody: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.one,
  },
  continueProgress: {
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  continueMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filters: {
    gap: Spacing.two,
    paddingRight: Spacing.four,
    marginBottom: Spacing.three,
  },
  feed: {
    gap: Spacing.three,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  feedBody: {
    flex: 1,
    gap: 2,
  },
  feedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  feedActions: {
    flexDirection: 'row',
    gap: Spacing.five,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
  },
  feedAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  upcomingCard: {
    width: 220,
    padding: Spacing.three,
  },
  upcomingRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
  },
  upcomingBody: {
    flex: 1,
    gap: 2,
  },
  rail: {
    gap: Spacing.four,
    paddingRight: Spacing.four,
  },
  railItem: {
    width: 128,
    gap: Spacing.one,
  },
  railTitle: {
    marginTop: Spacing.two,
  },
});
