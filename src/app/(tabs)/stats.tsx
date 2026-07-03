import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { MEDIA_ICON, RATING_SCALE } from '@/data/constants';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useStats } from '@/hooks/use-library';
import { useTheme } from '@/hooks/use-theme';

const TYPE_COLOR = { book: Palette.purple, movie: Palette.amber, show: Palette.cyan } as const;

export default function StatsScreen() {
  const theme = useTheme();
  const { stats, isLoading } = useStats();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ThemedText type="title">Statistics</ThemedText>

        {isLoading ? (
          <ActivityIndicator color={theme.primary} style={styles.loader} />
        ) : !stats || stats.total === 0 ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="stats-chart-outline"
              title="No statistics yet"
              description="Add books, movies and shows to your library and your stats will appear here."
            />
          </View>
        ) : (
          <>
            <View style={styles.grid}>
              {(['book', 'movie', 'show'] as const).map((t) => (
                <Card key={t} style={styles.summaryCard}>
                  <View style={[styles.summaryIcon, { backgroundColor: TYPE_COLOR[t] + '22' }]}>
                    <Ionicons name={MEDIA_ICON[t]} size={20} color={TYPE_COLOR[t]} />
                  </View>
                  <ThemedText type="title" style={styles.summaryValue}>
                    {stats.counts[t]}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {t === 'book' ? 'Books' : t === 'movie' ? 'Movies' : 'TV Shows'}
                  </ThemedText>
                </Card>
              ))}
              <Card style={styles.summaryCard}>
                <View style={[styles.summaryIcon, { backgroundColor: Palette.green + '22' }]}>
                  <Ionicons name="library" size={20} color={Palette.green} />
                </View>
                <ThemedText type="title" style={styles.summaryValue}>
                  {stats.total}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Total tracked
                </ThemedText>
              </Card>
            </View>

            <Card>
              <ThemedText type="sectionTitle" style={styles.cardTitle}>
                Average Rating
              </ThemedText>
              <View style={styles.avgList}>
                {(['book', 'movie', 'show'] as const).map((t) => (
                  <View key={t} style={styles.avgRow}>
                    <ThemedText type="smallBold" themeColor="textSecondary">
                      {t === 'book' ? 'Books' : t === 'movie' ? 'Movies' : 'TV Shows'}
                    </ThemedText>
                    <ThemedText type="smallBold">
                      {stats.averageRating[t] != null
                        ? `${stats.averageRating[t]!.toFixed(1)}${RATING_SCALE[t] === 10 ? '/10' : '/5'}`
                        : '—'}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </Card>

            {stats.byStatus.length > 0 ? (
              <Card>
                <ThemedText type="sectionTitle" style={styles.cardTitle}>
                  By Status
                </ThemedText>
                <View style={styles.statusList}>
                  {stats.byStatus.map((s) => (
                    <View key={s.status} style={styles.statusRow}>
                      <StatusBadge status={s.status} size="sm" />
                      <ThemedText type="smallBold" themeColor="textSecondary">
                        {s.count}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </Card>
            ) : null}

            {stats.topGenres.length > 0 ? (
              <Card>
                <ThemedText type="sectionTitle" style={styles.cardTitle}>
                  Top Genres
                </ThemedText>
                <View style={styles.genreWrap}>
                  {stats.topGenres.map((g) => (
                    <View key={g.genre} style={[styles.genreChip, { backgroundColor: theme.backgroundElement }]}>
                      <ThemedText type="small">{g.genre}</ThemedText>
                      <ThemedText type="smallBold" themeColor="textSecondary">
                        {g.count}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </Card>
            ) : null}
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
    gap: Spacing.four,
  },
  loader: {
    marginTop: Spacing.seven,
  },
  emptyWrap: {
    marginTop: Spacing.six,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  summaryCard: {
    flexGrow: 1,
    flexBasis: '46%',
    gap: Spacing.two,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  summaryValue: {
    fontSize: 26,
    lineHeight: 32,
  },
  cardTitle: {
    marginBottom: Spacing.four,
  },
  avgList: {
    gap: Spacing.three,
  },
  avgRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusList: {
    gap: Spacing.three,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  genreWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  genreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
});
