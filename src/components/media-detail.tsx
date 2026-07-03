import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Poster } from '@/components/ui/poster';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Rating } from '@/components/ui/rating';
import { StatusBadge } from '@/components/ui/status-badge';
import { RATING_SCALE } from '@/data/constants';
import { Radius, Spacing } from '@/constants/theme';
import { useRemoveFromLibrary, useToggleFavorite } from '@/hooks/use-library';
import { useTheme } from '@/hooks/use-theme';
import type { LibraryItem } from '@/services/types';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.dateRow}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="smallBold">{value}</ThemedText>
    </View>
  );
}

export function MediaDetail({ item }: { item: LibraryItem }) {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toggleFavorite = useToggleFavorite();
  const removeItem = useRemoveFromLibrary();
  const [revealSpoiler, setRevealSpoiler] = useState(false);

  const scale = RATING_SCALE[item.media_type];
  const pct =
    item.progress_current != null && item.progress_total
      ? item.progress_current / item.progress_total
      : null;

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const handleRemove = () => {
    removeItem.mutate(item.id, { onSuccess: goBack });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.two }]}>
        <Pressable
          onPress={goBack}
          style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </Pressable>
        <Pressable
          onPress={() => toggleFavorite.mutate({ id: item.id, value: !item.is_favorite })}
          style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}
          accessibilityLabel="Toggle favorite"
        >
          <Ionicons
            name={item.is_favorite ? 'heart' : 'heart-outline'}
            size={20}
            color={item.is_favorite ? theme.pink : theme.text}
          />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          {item.cover_url ? (
            <Poster uri={item.cover_url} width={160} radius={Radius.lg} />
          ) : (
            <View style={[styles.noCover, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="image-outline" size={40} color={theme.textSecondary} />
            </View>
          )}
        </View>

        <ThemedText type="heading" style={styles.center}>
          {item.title}
        </ThemedText>
        {item.subtitle ? (
          <ThemedText type="default" themeColor="textSecondary" style={styles.center}>
            {item.subtitle}
          </ThemedText>
        ) : null}

        <View style={styles.metaRow}>
          {item.rating != null ? (
            <Rating value={item.rating} scale={scale} size={16} showValue />
          ) : (
            <ThemedText type="small" themeColor="textSecondary">
              No rating
            </ThemedText>
          )}
          {item.genres && item.genres.length > 0 ? (
            <>
              <View style={[styles.dot, { backgroundColor: theme.textSecondary }]} />
              <ThemedText type="small" themeColor="textSecondary">
                {item.genres.slice(0, 2).join(', ')}
              </ThemedText>
            </>
          ) : null}
        </View>

        <View style={styles.statusWrap}>
          <StatusBadge status={item.status} />
        </View>

        {pct != null ? (
          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <ThemedText type="smallBold">Progress</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {Math.round(pct * 100)}%
              </ThemedText>
            </View>
            <ProgressBar progress={pct} height={8} />
          </View>
        ) : null}

        {item.started_at || item.finished_at ? (
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {item.started_at ? <InfoRow label="Started" value={item.started_at} /> : null}
            {item.finished_at ? <InfoRow label="Finished" value={item.finished_at} /> : null}
          </View>
        ) : null}

        {item.review ? (
          <View style={styles.reviewBlock}>
            <View style={styles.reviewHeader}>
              <ThemedText type="sectionTitle">
                {item.review_type ?? 'Review'}
              </ThemedText>
              {item.spoiler ? (
                <View style={styles.spoilerTag}>
                  <Ionicons name="warning-outline" size={14} color={theme.amber} />
                  <ThemedText type="small" style={{ color: theme.amber }}>
                    Spoiler
                  </ThemedText>
                </View>
              ) : null}
            </View>
            {item.spoiler && !revealSpoiler ? (
              <Pressable
                onPress={() => setRevealSpoiler(true)}
                style={[styles.spoilerHidden, { backgroundColor: theme.backgroundElement }]}
              >
                <ThemedText type="small" themeColor="textSecondary">
                  Spoiler hidden — tap to reveal
                </ThemedText>
              </Pressable>
            ) : (
              <ThemedText type="default" themeColor="textSecondary">
                {item.review}
              </ThemedText>
            )}
          </View>
        ) : null}

        <Pressable
          onPress={handleRemove}
          disabled={removeItem.isPending}
          style={[styles.removeButton, { borderColor: theme.danger }]}
        >
          <Ionicons name="trash-outline" size={18} color={theme.danger} />
          <ThemedText type="smallBold" style={{ color: theme.danger }}>
            Remove from library
          </ThemedText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.seven,
    gap: Spacing.three,
  },
  hero: {
    alignItems: 'center',
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  noCover: {
    width: 160,
    aspectRatio: 2 / 3,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  statusWrap: {
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  progressBlock: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewBlock: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spoilerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  spoilerHidden: {
    borderRadius: Radius.md,
    padding: Spacing.four,
    alignItems: 'center',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    paddingVertical: Spacing.four,
    marginTop: Spacing.five,
  },
});
