import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Poster } from '@/components/ui/poster';
import { Rating } from '@/components/ui/rating';
import { StatusBadge } from '@/components/ui/status-badge';
import { MEDIA_ICON, RATING_SCALE } from '@/data/constants';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useLibrary, useProfile } from '@/hooks/use-library';
import { useTheme } from '@/hooks/use-theme';
import type { LibraryItem } from '@/services/types';

const TABS = ['Activity', 'Reviews', 'Lists', 'Stats'] as const;

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: library, isLoading } = useLibrary();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Activity');

  const items = library ?? [];
  const name = profile?.display_name ?? profile?.username ?? user?.email?.split('@')[0] ?? 'You';
  const handle = profile?.username ? `@${profile.username}` : (user?.email ?? '');
  const favorites = items.filter((i) => i.is_favorite);
  const reviewed = items.filter((i) => i.review);
  const ratingsCount = items.filter((i) => i.rating != null).length;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <View style={styles.banner}>
        <View style={[styles.bannerFill, { backgroundColor: theme.primaryDark }]} />
        <Pressable
          onPress={() => router.push('/settings')}
          style={[styles.gear, { top: insets.top + Spacing.two, backgroundColor: 'rgba(0,0,0,0.4)' }]}
          accessibilityLabel="Settings"
        >
          <Ionicons name="settings-outline" size={20} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.avatarWrap}>
          <Avatar name={name} uri={profile?.avatar_url ?? undefined} size={92} />
        </View>
        <ThemedText type="heading">{name}</ThemedText>
        {handle ? (
          <ThemedText type="small" themeColor="textSecondary">
            {handle}
          </ThemedText>
        ) : null}
        {profile?.bio ? (
          <ThemedText type="default" themeColor="textSecondary" style={styles.bio}>
            {profile.bio}
          </ThemedText>
        ) : null}

        <View style={[styles.stats, { borderColor: theme.border }]}>
          <Stat label="Following" value="0" />
          <Stat label="Followers" value="0" />
          <Stat label="Ratings" value={String(ratingsCount)} />
        </View>

        <View style={styles.section}>
          <ThemedText type="sectionTitle" style={styles.sectionTitle}>
            Favorites
          </ThemedText>
          {favorites.length === 0 ? (
            <ThemedText type="small" themeColor="textSecondary">
              No favorites yet. Tap the heart on an item to add one.
            </ThemedText>
          ) : (
            <View style={styles.favorites}>
              {favorites.slice(0, 3).map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.favorite}
                  onPress={() => router.push(`/item/${item.id}` as never)}
                >
                  {item.cover_url ? (
                    <Poster uri={item.cover_url} width={96} />
                  ) : (
                    <View style={[styles.favNoCover, { backgroundColor: theme.backgroundElement }]}>
                      <Ionicons name={MEDIA_ICON[item.media_type]} size={22} color={theme.textSecondary} />
                    </View>
                  )}
                  <ThemedText type="smallBold" numberOfLines={1} style={styles.favTitle}>
                    {item.title}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={[styles.tabs, { borderColor: theme.border }]}>
          {TABS.map((t) => (
            <Pressable key={t} style={styles.tab} onPress={() => setTab(t)}>
              <ThemedText type="smallBold" style={{ color: tab === t ? theme.primary : theme.textSecondary }}>
                {t}
              </ThemedText>
              {tab === t ? <View style={[styles.tabUnderline, { backgroundColor: theme.primary }]} /> : null}
            </Pressable>
          ))}
        </View>

        <View style={styles.tabContent}>
          {isLoading ? (
            <ActivityIndicator color={theme.primary} style={{ marginTop: Spacing.five }} />
          ) : tab === 'Activity' ? (
            items.length === 0 ? (
              <EmptyTab text="No activity yet. Add something to your library." />
            ) : (
              items.slice(0, 8).map((item) => <ActivityCard key={item.id} item={item} onPress={() => router.push(`/item/${item.id}` as never)} />)
            )
          ) : tab === 'Reviews' ? (
            reviewed.length === 0 ? (
              <EmptyTab text="No reviews yet." />
            ) : (
              reviewed.map((item) => <ReviewCard key={item.id} item={item} />)
            )
          ) : tab === 'Lists' ? (
            <EmptyTab text="Custom lists are coming soon." />
          ) : (
            <Pressable
              onPress={() => router.push('/stats')}
              style={[styles.linkRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <Ionicons name="stats-chart" size={22} color={theme.primary} />
              <ThemedText type="smallBold" style={{ flex: 1 }}>
                View your full statistics
              </ThemedText>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function ActivityCard({ item, onPress }: { item: LibraryItem; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Card padded={false} onPress={onPress}>
      <View style={styles.activityRow}>
        {item.cover_url ? (
          <Poster uri={item.cover_url} width={44} radius={Radius.sm} />
        ) : (
          <View style={[styles.activityNoCover, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons name={MEDIA_ICON[item.media_type]} size={18} color={theme.textSecondary} />
          </View>
        )}
        <View style={styles.activityBody}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {item.title}
          </ThemedText>
          {item.rating != null ? (
            <Rating value={item.rating} scale={RATING_SCALE[item.media_type]} size={12} showValue />
          ) : null}
        </View>
        <StatusBadge status={item.status} size="sm" />
      </View>
    </Card>
  );
}

function ReviewCard({ item }: { item: LibraryItem }) {
  const theme = useTheme();
  return (
    <Card>
      <View style={styles.reviewHeader}>
        <ThemedText type="smallBold" numberOfLines={1} style={{ flex: 1 }}>
          {item.title}
        </ThemedText>
        {item.rating != null ? (
          <Rating value={item.rating} scale={RATING_SCALE[item.media_type]} size={12} showValue />
        ) : null}
      </View>
      {item.review_type ? (
        <View style={[styles.reviewTag, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="small" themeColor="textSecondary">
            {item.review_type}
          </ThemedText>
        </View>
      ) : null}
      <ThemedText type="small" themeColor={item.spoiler ? 'textSecondary' : 'text'} style={styles.reviewText}>
        {item.spoiler ? 'Spoiler hidden — open the item to reveal.' : item.review}
      </ThemedText>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="subtitle">{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

function EmptyTab({ text }: { text: string }) {
  return (
    <ThemedText type="small" themeColor="textSecondary" style={styles.emptyTab}>
      {text}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.seven,
  },
  banner: {
    height: 120,
  },
  bannerFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  gear: {
    position: 'absolute',
    right: Spacing.four,
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: Spacing.four,
    marginTop: -46,
    alignItems: 'center',
  },
  avatarWrap: {
    borderRadius: Radius.full,
    borderWidth: 4,
    borderColor: '#111827',
    marginBottom: Spacing.three,
  },
  bio: {
    textAlign: 'center',
    marginTop: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    marginTop: Spacing.four,
    paddingVertical: Spacing.four,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  section: {
    alignSelf: 'stretch',
    marginTop: Spacing.five,
    gap: Spacing.three,
  },
  sectionTitle: {},
  favorites: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  favorite: {
    flex: 1,
    maxWidth: '32%',
  },
  favNoCover: {
    width: 96,
    aspectRatio: 2 / 3,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favTitle: {
    marginTop: Spacing.two,
  },
  tabs: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: Spacing.five,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: Spacing.three,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -StyleSheet.hairlineWidth,
    height: 2,
    width: '60%',
    borderRadius: Radius.full,
  },
  tabContent: {
    alignSelf: 'stretch',
    marginTop: Spacing.four,
    gap: Spacing.three,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  activityNoCover: {
    width: 44,
    height: 66,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityBody: {
    flex: 1,
    gap: Spacing.one,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  reviewTag: {
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: 3,
    marginTop: Spacing.two,
  },
  reviewText: {
    marginTop: Spacing.two,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    alignSelf: 'stretch',
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  emptyTab: {
    textAlign: 'center',
    marginTop: Spacing.five,
  },
});
