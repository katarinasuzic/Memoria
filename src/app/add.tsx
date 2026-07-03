import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Poster } from '@/components/ui/poster';
import { Rating } from '@/components/ui/rating';
import type { Status } from '@/components/ui/status-badge';
import { Palette, Radius, Spacing } from '@/constants/theme';
import {
  MEDIA_ICON,
  MEDIA_LABEL,
  RATING_SCALE,
  REVIEW_TYPES,
  STATUS_OPTIONS,
  type MediaType,
  type ReviewType,
  type SearchFilter,
} from '@/data/constants';
import { useAddToLibrary } from '@/hooks/use-library';
import { useUniversalSearch } from '@/hooks/use-search';
import { useTheme } from '@/hooks/use-theme';
import type { SearchResult } from '@/services/types';

const TYPE_COLORS: Record<MediaType, string> = {
  book: Palette.purple,
  movie: Palette.amber,
  show: Palette.cyan,
};

const FILTER_FOR_TYPE: Record<MediaType, SearchFilter> = {
  book: 'Books',
  movie: 'Movies',
  show: 'TV Shows',
};

export default function AddModal() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [type, setType] = useState<MediaType | null>(null);
  const [selected, setSelected] = useState<SearchResult | null>(null);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            if (selected) setSelected(null);
            else if (type) setType(null);
            else close();
          }}
          hitSlop={8}
          style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}
        >
          <Ionicons name={type || selected ? 'arrow-back' : 'close'} size={20} color={theme.text} />
        </Pressable>
        <ThemedText type="sectionTitle">
          {selected ? 'Log it' : type ? `Add a ${MEDIA_LABEL[type]}` : 'Add to Memoria'}
        </ThemedText>
        <View style={styles.iconButton} />
      </View>

      {!type ? (
        <TypeStep onSelect={setType} />
      ) : !selected ? (
        <SearchStep type={type} onSelect={setSelected} />
      ) : (
        <LogStep type={type} item={selected} onDone={close} />
      )}
    </View>
  );
}

function TypeStep({ onSelect }: { onSelect: (t: MediaType) => void }) {
  const theme = useTheme();
  const types: MediaType[] = ['book', 'movie', 'show'];
  const descriptions: Record<MediaType, string> = {
    book: 'Search Open Library',
    movie: 'Search TMDB',
    show: 'Search TVMaze',
  };

  return (
    <View style={styles.stepBody}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
        What do you want to add?
      </ThemedText>
      {types.map((t) => (
        <Pressable
          key={t}
          onPress={() => onSelect(t)}
          style={({ pressed }) => [
            styles.option,
            { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <View style={[styles.optionIcon, { backgroundColor: TYPE_COLORS[t] + '22' }]}>
            <Ionicons name={MEDIA_ICON[t]} size={24} color={TYPE_COLORS[t]} />
          </View>
          <View style={styles.optionBody}>
            <ThemedText type="smallBold" style={{ fontSize: 16 }}>
              {MEDIA_LABEL[t]}s
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {descriptions[t]}
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </Pressable>
      ))}
    </View>
  );
}

function SearchStep({
  type,
  onSelect,
}: {
  type: MediaType;
  onSelect: (item: SearchResult) => void;
}) {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const { data: sections, isFetching } = useUniversalSearch(query, FILTER_FOR_TYPE[type]);
  const section = sections?.[0];

  return (
    <View style={styles.searchBody}>
      <View style={[styles.searchBar, { backgroundColor: theme.backgroundElement }]}>
        <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
        <TextInput
          autoFocus
          placeholder={`Search ${MEDIA_LABEL[type].toLowerCase()}s...`}
          placeholderTextColor={theme.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          style={[styles.searchInput, { color: theme.text }]}
        />
        {isFetching ? <ActivityIndicator color={theme.primary} /> : null}
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.results}
      >
        {section?.unavailable ? (
          <EmptyState icon="film-outline" title="Movie database unavailable." description={section.unavailable} />
        ) : query.trim().length < 2 ? (
          <EmptyState icon="search-outline" title={`Search ${MEDIA_LABEL[type].toLowerCase()}s`} description="Type at least 2 characters to search." />
        ) : section && section.results.length === 0 && !isFetching ? (
          <EmptyState icon="sad-outline" title="No results" description={`No ${MEDIA_LABEL[type].toLowerCase()}s found for “${query.trim()}”.`} />
        ) : (
          section?.results.map((r) => (
            <Pressable
              key={`${r.source}-${r.externalId}`}
              onPress={() => onSelect(r)}
              style={({ pressed }) => [styles.resultRow, { opacity: pressed ? 0.7 : 1 }]}
            >
              {r.coverUrl ? (
                <Poster uri={r.coverUrl} width={46} radius={Radius.sm} />
              ) : (
                <View style={[styles.resultNoCover, { backgroundColor: theme.backgroundElement }]}>
                  <Ionicons name={MEDIA_ICON[type]} size={18} color={theme.textSecondary} />
                </View>
              )}
              <View style={styles.resultBody}>
                <ThemedText type="smallBold" numberOfLines={1}>
                  {r.title}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                  {r.subtitle}
                </ThemedText>
              </View>
              <Ionicons name="add-circle" size={24} color={theme.primary} />
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function LogStep({
  type,
  item,
  onDone,
}: {
  type: MediaType;
  item: SearchResult;
  onDone: () => void;
}) {
  const theme = useTheme();
  const addToLibrary = useAddToLibrary();
  const scale = RATING_SCALE[type];

  const [status, setStatus] = useState<Status>(STATUS_OPTIONS[type][0]);
  const [rating, setRating] = useState<number | null>(null);
  const [reviewType, setReviewType] = useState<ReviewType>('Quick Thought');
  const [review, setReview] = useState('');
  const [spoiler, setSpoiler] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    setError(null);
    addToLibrary.mutate(
      {
        media_type: type,
        source: item.source,
        external_id: item.externalId,
        title: item.title,
        subtitle: item.subtitle,
        cover_url: item.coverUrl,
        status,
        rating,
        review: review.trim() ? review.trim() : null,
        review_type: review.trim() ? reviewType : null,
        spoiler,
        genres: item.genres ?? null,
      },
      {
        onSuccess: onDone,
        onError: (e) => setError(e instanceof Error ? e.message : 'Could not save. Please try again.'),
      },
    );
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.logBody}
    >
      <View style={styles.logHeader}>
        {item.coverUrl ? (
          <Poster uri={item.coverUrl} width={64} radius={Radius.sm} />
        ) : (
          <View style={[styles.resultNoCover, { width: 64, height: 96, backgroundColor: theme.backgroundElement }]}>
            <Ionicons name={MEDIA_ICON[type]} size={22} color={theme.textSecondary} />
          </View>
        )}
        <View style={styles.logHeaderBody}>
          <ThemedText type="subtitle" numberOfLines={2}>
            {item.title}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {item.subtitle}
          </ThemedText>
        </View>
      </View>

      <ThemedText type="smallBold">Status</ThemedText>
      <View style={styles.chips}>
        {STATUS_OPTIONS[type].map((s) => (
          <Chip key={s} label={s} selected={status === s} onPress={() => setStatus(s)} />
        ))}
      </View>

      <View style={styles.ratingRow}>
        <ThemedText type="smallBold">Rating (optional)</ThemedText>
        {rating != null ? (
          <Pressable onPress={() => setRating(null)} hitSlop={8}>
            <ThemedText type="small" themeColor="textSecondary">
              Clear
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
      <Rating value={rating ?? 0} scale={scale} size={30} onChange={setRating} showValue={rating != null} />

      <ThemedText type="smallBold">Review (optional)</ThemedText>
      <View style={styles.chips}>
        {REVIEW_TYPES.map((t) => (
          <Chip key={t} label={t} selected={reviewType === t} onPress={() => setReviewType(t)} />
        ))}
      </View>
      <TextInput
        placeholder="What did you think?"
        placeholderTextColor={theme.textSecondary}
        value={review}
        onChangeText={setReview}
        multiline
        style={[styles.reviewInput, { backgroundColor: theme.backgroundElement, color: theme.text, borderColor: theme.border }]}
      />
      <View style={[styles.spoilerRow, { borderColor: theme.border }]}>
        <View style={styles.spoilerLabel}>
          <Ionicons name="warning-outline" size={16} color={theme.amber} />
          <ThemedText type="smallBold">Contains spoilers</ThemedText>
        </View>
        <Pressable
          onPress={() => setSpoiler((s) => !s)}
          style={[styles.toggle, { backgroundColor: spoiler ? theme.primary : theme.backgroundSelected }]}
        >
          <View style={[styles.toggleKnob, { alignSelf: spoiler ? 'flex-end' : 'flex-start' }]} />
        </Pressable>
      </View>

      {error ? (
        <ThemedText type="small" style={{ color: theme.danger }}>
          {error}
        </ThemedText>
      ) : null}

      <Pressable
        onPress={save}
        disabled={addToLibrary.isPending}
        style={[styles.saveButton, { backgroundColor: theme.primary, opacity: addToLibrary.isPending ? 0.6 : 1 }]}
      >
        {addToLibrary.isPending ? (
          <ActivityIndicator color={theme.onPrimary} />
        ) : (
          <ThemedText type="smallBold" style={{ color: theme.onPrimary, fontSize: 15 }}>
            Save to library
          </ThemedText>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBody: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  subtitle: {
    marginBottom: Spacing.two,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBody: {
    flex: 1,
    gap: 2,
  },
  searchBody: {
    flex: 1,
    paddingHorizontal: Spacing.four,
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
  results: {
    paddingVertical: Spacing.four,
    gap: Spacing.three,
    flexGrow: 1,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  resultNoCover: {
    width: 46,
    height: 69,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBody: {
    flex: 1,
    gap: 2,
  },
  logBody: {
    padding: Spacing.four,
    gap: Spacing.three,
    paddingBottom: Spacing.seven,
  },
  logHeader: {
    flexDirection: 'row',
    gap: Spacing.four,
    marginBottom: Spacing.two,
  },
  logHeaderBody: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.one,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },
  reviewInput: {
    minHeight: 90,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    textAlignVertical: 'top',
  },
  spoilerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  spoilerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: Radius.full,
    padding: 3,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
});
