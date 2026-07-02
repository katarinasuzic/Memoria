import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Poster } from '@/components/ui/poster';
import { Rating } from '@/components/ui/rating';
import { StatusBadge } from '@/components/ui/status-badge';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { currentUser, customLists, favorites, quotes, reviews } from '@/data/mock';

const TABS = ['Activity', 'Reviews', 'Lists', 'Stats'] as const;
const FAVORITE_LABELS = ['Book', 'Movie', 'Show'];

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Activity');

  const email = user?.email;
  const name = email ? email.split('@')[0] : currentUser.name;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <View style={styles.banner}>
        <Image source={{ uri: 'https://picsum.photos/seed/memorianebula/800/400' }} style={styles.bannerImage} contentFit="cover" />
        <View style={[styles.bannerScrim, { backgroundColor: theme.background }]} />
        <Pressable
          onPress={() => router.push('/settings')}
          style={[styles.signOut, { top: insets.top + Spacing.two, backgroundColor: 'rgba(0,0,0,0.4)' }]}
          accessibilityLabel="Settings"
        >
          <Ionicons name="settings-outline" size={20} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.avatarWrap}>
          <Avatar name={name} size={92} />
        </View>
        <ThemedText type="heading">{name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {email ?? currentUser.handle}
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.bio}>
          {currentUser.bio}
        </ThemedText>

        <View style={[styles.stats, { borderColor: theme.border }]}>
          <Stat label="Following" value={String(currentUser.stats.following)} />
          <Stat label="Followers" value={String(currentUser.stats.followers)} />
          <Stat label="Ratings" value={currentUser.stats.ratings} />
        </View>

        <View style={styles.section}>
          <ThemedText type="sectionTitle" style={styles.sectionTitle}>
            Favorite
          </ThemedText>
          <View style={styles.favorites}>
            {favorites.map((item, i) => (
              <View key={item.id} style={styles.favorite}>
                <Poster uri={item.cover} width={96} />
                <ThemedText type="small" themeColor="textSecondary" style={styles.favLabel}>
                  {FAVORITE_LABELS[i]}
                </ThemedText>
                <ThemedText type="smallBold" numberOfLines={1} style={styles.favTitle}>
                  {item.title}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.tabs, { borderColor: theme.border }]}>
          {TABS.map((t) => (
            <Pressable key={t} style={styles.tab} onPress={() => setTab(t)}>
              <ThemedText
                type="smallBold"
                style={{ color: tab === t ? theme.primary : theme.textSecondary }}
              >
                {t}
              </ThemedText>
              {tab === t ? <View style={[styles.tabUnderline, { backgroundColor: theme.primary }]} /> : null}
            </Pressable>
          ))}
        </View>

        <View style={styles.tabContent}>
          {tab === 'Activity' ? (
            <View style={[styles.activityRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Avatar name={name} size={40} />
              <View style={styles.activityBody}>
                <ThemedText type="smallBold">{name} rated Interstellar</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  A perfect blend of science and emotion.
                </ThemedText>
                <Rating value={10} scale={10} size={13} showValue />
              </View>
              <StatusBadge status="Watched" size="sm" />
            </View>
          ) : null}

          {tab === 'Reviews'
            ? reviews.map((r) => (
                <Card key={r.id}>
                  <View style={styles.reviewHeader}>
                    <ThemedText type="smallBold">{r.media}</ThemedText>
                    <Rating value={r.rating} scale={r.mediaType === 'book' ? 5 : 10} size={12} showValue />
                  </View>
                  <View style={styles.reviewTypeRow}>
                    <View style={[styles.reviewTag, { backgroundColor: theme.backgroundElement }]}>
                      <ThemedText type="small" themeColor="textSecondary">
                        {r.type}
                      </ThemedText>
                    </View>
                    {r.spoiler ? <Ionicons name="warning-outline" size={14} color={theme.amber} /> : null}
                  </View>
                  <ThemedText type="small" themeColor={r.spoiler ? 'textSecondary' : 'text'} style={styles.reviewText}>
                    {r.spoiler ? 'Spoiler hidden — tap to reveal.' : r.text}
                  </ThemedText>
                  <View style={[styles.reviewFooter, { borderTopColor: theme.border }]}>
                    <View style={styles.reviewStat}>
                      <Ionicons name="heart-outline" size={15} color={theme.textSecondary} />
                      <ThemedText type="small" themeColor="textSecondary">
                        {r.likes}
                      </ThemedText>
                    </View>
                    <View style={styles.reviewStat}>
                      <Ionicons name="chatbubble-outline" size={14} color={theme.textSecondary} />
                      <ThemedText type="small" themeColor="textSecondary">
                        {r.comments}
                      </ThemedText>
                    </View>
                    <ThemedText type="small" themeColor="textSecondary">
                      · {r.time}
                    </ThemedText>
                  </View>
                </Card>
              ))
            : null}

          {tab === 'Lists' ? (
            <>
              {customLists.map((l) => (
                <Card key={l.id} padded={false}>
                  <View style={styles.listRow}>
                    <View style={styles.listCovers}>
                      {l.covers.slice(0, 3).map((c, i) => (
                        <Poster key={i} uri={c} width={38} radius={Radius.sm} style={{ marginLeft: i === 0 ? 0 : -14 }} />
                      ))}
                    </View>
                    <View style={styles.listBody}>
                      <ThemedText type="smallBold">{l.title}</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {l.count} items · {l.visibility}
                      </ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                  </View>
                </Card>
              ))}
              <ThemedText type="sectionTitle" style={styles.quotesTitle}>
                Favorite Quotes
              </ThemedText>
              {quotes.map((q) => (
                <Card key={q.id}>
                  <ThemedText type="default" style={styles.quoteText}>
                    “{q.text}”
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.quoteSource}>
                    — {q.source}
                  </ThemedText>
                </Card>
              ))}
            </>
          ) : null}

          {tab === 'Stats' ? (
            <Pressable
              onPress={() => router.push('/stats')}
              style={[styles.activityRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <Ionicons name="stats-chart" size={22} color={theme.primary} />
              <ThemedText type="smallBold" style={{ flex: 1 }}>
                View your full statistics
              </ThemedText>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </ScrollView>
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

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.seven,
  },
  banner: {
    height: 140,
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
  },
  bannerScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    opacity: 0.9,
  },
  signOut: {
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
  },
  sectionTitle: {
    marginBottom: Spacing.three,
  },
  favorites: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  favorite: {
    flex: 1,
  },
  favLabel: {
    marginTop: Spacing.two,
  },
  favTitle: {
    marginTop: 2,
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
    alignSelf: 'stretch',
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  activityBody: {
    flex: 1,
    gap: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  reviewTag: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: 3,
  },
  reviewText: {
    marginTop: Spacing.two,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
  },
  reviewStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  listCovers: {
    flexDirection: 'row',
  },
  listBody: {
    flex: 1,
    gap: 2,
  },
  quotesTitle: {
    marginTop: Spacing.three,
  },
  quoteText: {
    fontStyle: 'italic',
  },
  quoteSource: {
    marginTop: Spacing.two,
  },
});
