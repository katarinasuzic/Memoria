import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Poster } from '@/components/ui/poster';
import { SEARCH_FILTERS, MEDIA_ICON, type SearchFilter, type MediaType } from '@/data/constants';
import { Radius, Spacing } from '@/constants/theme';
import { useUniversalSearch } from '@/hooks/use-search';
import { useTheme } from '@/hooks/use-theme';

export default function DiscoverScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilter>('All');
  const { data: sections, isFetching, isError } = useUniversalSearch(query, filter);

  const hasQuery = query.trim().length >= 2;
  const totalResults = sections?.reduce((sum, s) => sum + s.results.length, 0) ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <ThemedText type="title">Discover</ThemedText>

        <View style={[styles.searchBar, { backgroundColor: theme.backgroundElement }]}>
          <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
          <TextInput
            placeholder="Search books, movies and TV shows..."
            placeholderTextColor={theme.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            style={[styles.searchInput, { color: theme.text }]}
          />
          {isFetching ? <ActivityIndicator color={theme.primary} /> : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {SEARCH_FILTERS.map((f) => (
            <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>

        {!hasQuery ? (
          <EmptyState
            icon="compass-outline"
            title="Search everything"
            description="Find real books, movies and TV shows to add to your library."
          />
        ) : isError ? (
          <EmptyState icon="cloud-offline-outline" title="Search failed" description="Please check your connection and try again." />
        ) : (
          <View style={styles.sections}>
            {sections?.map((section) => (
              <View key={section.key} style={styles.searchSection}>
                <ThemedText type="sectionTitle" style={styles.searchSectionTitle}>
                  {section.title}
                </ThemedText>
                {section.unavailable ? (
                  <View style={[styles.unavailable, { backgroundColor: theme.backgroundElement }]}>
                    <Ionicons name="film-outline" size={18} color={theme.textSecondary} />
                    <ThemedText type="small" themeColor="textSecondary">
                      {section.unavailable}
                    </ThemedText>
                  </View>
                ) : section.results.length === 0 ? (
                  <ThemedText type="small" themeColor="textSecondary">
                    No {section.title.toLowerCase()} found.
                  </ThemedText>
                ) : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
                    {section.results.slice(0, 12).map((r) => (
                      <View key={`${r.source}-${r.externalId}`} style={styles.railItem}>
                        {r.coverUrl ? (
                          <Poster uri={r.coverUrl} width={110} />
                        ) : (
                          <View style={[styles.railNoCover, { backgroundColor: theme.backgroundElement }]}>
                            <Ionicons name={MEDIA_ICON[section.key as MediaType]} size={24} color={theme.textSecondary} />
                          </View>
                        )}
                        <ThemedText type="smallBold" numberOfLines={1} style={styles.railTitle}>
                          {r.title}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                          {r.subtitle}
                        </ThemedText>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
            ))}
            {totalResults === 0 && !isFetching && sections && sections.every((s) => !s.unavailable) ? (
              <EmptyState icon="sad-outline" title="No results" description={`Nothing found for “${query.trim()}”.`} />
            ) : null}
          </View>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    height: '100%',
  },
  filters: {
    gap: Spacing.two,
    paddingRight: Spacing.four,
  },
  sections: {
    gap: Spacing.five,
  },
  searchSection: {
    gap: Spacing.three,
  },
  searchSectionTitle: {},
  unavailable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Radius.md,
  },
  rail: {
    gap: Spacing.four,
    paddingRight: Spacing.four,
  },
  railItem: {
    width: 110,
    gap: Spacing.one,
  },
  railNoCover: {
    width: 110,
    aspectRatio: 2 / 3,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  railTitle: {
    marginTop: Spacing.two,
  },
});
