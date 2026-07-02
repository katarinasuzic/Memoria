import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
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
  friendsActivity,
  recommended,
  shows,
  type MediaItem,
} from '@/data/mock';

function ContinueCard({ item }: { item: MediaItem }) {
  const theme = useTheme();
  const router = useRouter();
  const pct = item.progress ? item.progress.current / item.progress.total : 0;
  const href = item.type === 'book' ? `/book/${item.id}` : `/show/${item.id}`;

  return (
    <Card padded={false} onPress={() => router.push(href as never)}>
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
  const displayName = user?.email?.split('@')[0] ?? currentUser.name;

  return (
    <Screen padded={false} edges={['top', 'left', 'right']}>
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
          >
            <Ionicons name="notifications-outline" size={20} color={theme.text} />
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
          <SectionHeader title="Friends Activity" onAction={() => {}} />
          <Card>
            {friendsActivity.map((f, i) => (
              <View
                key={f.id}
                style={[
                  styles.friendRow,
                  i < friendsActivity.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: theme.border,
                  },
                ]}
              >
                <Avatar name={f.name} size={40} />
                <View style={styles.friendBody}>
                  <ThemedText type="smallBold" numberOfLines={1}>
                    {f.name} {f.action}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                    {f.title}
                  </ThemedText>
                </View>
                <View style={styles.friendMeta}>
                  <Rating value={f.rating} size={12} />
                  <ThemedText type="small" themeColor="textSecondary">
                    {f.time}
                  </ThemedText>
                </View>
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Recommended for You" onAction={() => {}} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rail}
          >
            {recommended.map((item) => {
              const href = item.type === 'book' ? `/book/${item.id}` : `/show/${item.id}`;
              return (
                <View key={item.id} style={styles.railItem}>
                  <Poster uri={item.cover} width={128} onPress={() => router.push(href as never)} />
                  <ThemedText type="smallBold" numberOfLines={1} style={styles.railTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                    {item.subtitle}
                  </ThemedText>
                </View>
              );
            })}
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
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  friendBody: {
    flex: 1,
    gap: 2,
  },
  friendMeta: {
    alignItems: 'flex-end',
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
