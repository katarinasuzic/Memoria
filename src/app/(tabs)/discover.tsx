import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { Poster } from '@/components/ui/poster';
import { Rating } from '@/components/ui/rating';
import { Screen } from '@/components/ui/screen';
import { SearchBar } from '@/components/ui/search-bar';
import { SectionHeader } from '@/components/ui/section-header';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { detailHref, recentSearches, searchFilters, trending } from '@/data/mock';

export default function DiscoverScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('All');

  return (
    <Screen padded={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <ThemedText type="title">Discover</ThemedText>

        <SearchBar
          placeholder="Search for anything..."
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {searchFilters.map((f) => (
            <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.recentHeader}>
            <ThemedText type="sectionTitle">Recent Searches</ThemedText>
            <Pressable hitSlop={8}>
              <ThemedText type="link" themeColor="textSecondary">
                Clear
              </ThemedText>
            </Pressable>
          </View>
          <View style={styles.recentChips}>
            {recentSearches.map((s) => (
              <View key={s} style={[styles.recentChip, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="small">{s}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Trending This Week" onAction={() => {}} />
          <View style={styles.trendingList}>
            {trending.map(({ rank, item, rating }) => {
              return (
                <Pressable
                  key={item.id}
                  style={styles.trendingRow}
                  onPress={() => router.push(detailHref(item) as never)}
                >
                  <ThemedText type="heading" style={{ color: theme.textSecondary, width: 26 }}>
                    {rank}
                  </ThemedText>
                  <Poster uri={item.cover} width={44} radius={Radius.sm} />
                  <View style={styles.trendingBody}>
                    <ThemedText type="smallBold" numberOfLines={1}>
                      {item.title}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                      {item.subtitle}
                    </ThemedText>
                  </View>
                  <Rating value={rating} scale={item.type === 'book' ? 5 : 10} size={13} showValue />
                </Pressable>
              );
            })}
          </View>
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
    gap: Spacing.four,
  },
  filters: {
    gap: Spacing.two,
    paddingRight: Spacing.four,
  },
  section: {
    gap: Spacing.three,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  recentChip: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  trendingList: {
    gap: Spacing.four,
  },
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  trendingBody: {
    flex: 1,
    gap: 2,
  },
});
