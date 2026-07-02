import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { StatusBadge, type Status } from '@/components/ui/status-badge';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Summary = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const SUMMARY: Summary[] = [
  { label: 'Books read', value: '42', icon: 'book', color: Palette.purple },
  { label: 'Movies', value: '87', icon: 'film', color: Palette.amber },
  { label: 'TV Shows', value: '23', icon: 'tv', color: Palette.cyan },
  { label: 'Ratings', value: '1.2K', icon: 'star', color: Palette.green },
];

const GOALS = [
  { label: 'Reading goal', current: 42, total: 60, color: Palette.purple },
  { label: 'Watch goal', current: 110, total: 150, color: Palette.cyan },
];

const BY_STATUS: { status: Status; count: number }[] = [
  { status: 'Read', count: 42 },
  { status: 'Reading', count: 3 },
  { status: 'Watched', count: 87 },
  { status: 'Watching', count: 2 },
  { status: 'Want to Read', count: 15 },
  { status: 'DNF', count: 4 },
];

export default function StatsScreen() {
  const theme = useTheme();

  return (
    <Screen padded={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ThemedText type="title">Stats</ThemedText>

        <View style={styles.grid}>
          {SUMMARY.map((s) => (
            <Card key={s.label} style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: s.color + '22' }]}>
                <Ionicons name={s.icon} size={20} color={s.color} />
              </View>
              <ThemedText type="title" style={styles.summaryValue}>
                {s.value}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {s.label}
              </ThemedText>
            </Card>
          ))}
        </View>

        <Card>
          <ThemedText type="sectionTitle" style={styles.cardTitle}>
            2026 Goals
          </ThemedText>
          <View style={styles.goals}>
            {GOALS.map((g) => (
              <View key={g.label} style={styles.goal}>
                <View style={styles.goalHeader}>
                  <ThemedText type="smallBold">{g.label}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {g.current} / {g.total}
                  </ThemedText>
                </View>
                <ProgressBar progress={g.current / g.total} color={g.color} height={8} />
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <ThemedText type="sectionTitle" style={styles.cardTitle}>
            By Status
          </ThemedText>
          <View style={styles.statusList}>
            {BY_STATUS.map((s) => (
              <View
                key={s.status}
                style={[styles.statusRow, { borderColor: theme.border }]}
              >
                <StatusBadge status={s.status} size="sm" />
                <ThemedText type="smallBold" themeColor="textSecondary">
                  {s.count}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.seven,
    gap: Spacing.four,
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
  goals: {
    gap: Spacing.four,
  },
  goal: {
    gap: Spacing.two,
  },
  goalHeader: {
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
});
