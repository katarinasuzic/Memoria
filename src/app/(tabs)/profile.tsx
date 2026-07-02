import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Poster } from '@/components/ui/poster';
import { Rating } from '@/components/ui/rating';
import { StatusBadge } from '@/components/ui/status-badge';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { currentUser, favorites } from '@/data/mock';

const TABS = ['Activity', 'Reviews', 'Lists', 'Stats'] as const;
const FAVORITE_LABELS = ['Book', 'Movie', 'Show'];

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
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
          onPress={signOut}
          style={[styles.signOut, { top: insets.top + Spacing.two, backgroundColor: 'rgba(0,0,0,0.4)' }]}
          accessibilityLabel="Sign out"
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
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

        {tab === 'Activity' ? (
          <View style={[styles.activityRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Avatar name={name} size={40} />
            <View style={styles.activityBody}>
              <ThemedText type="smallBold">{name} rated Interstellar</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                A perfect blend of science and emotion.
              </ThemedText>
              <Rating value={5} size={13} showValue outOfTen />
            </View>
            <StatusBadge status="Watched" size="sm" />
          </View>
        ) : (
          <ThemedText type="small" themeColor="textSecondary" style={styles.emptyTab}>
            Nothing here yet.
          </ThemedText>
        )}
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
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    alignSelf: 'stretch',
    marginTop: Spacing.four,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  activityBody: {
    flex: 1,
    gap: 4,
  },
  emptyTab: {
    textAlign: 'center',
    marginTop: Spacing.six,
  },
});
