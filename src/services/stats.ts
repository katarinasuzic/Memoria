import type { Status } from '@/components/ui/status-badge';
import type { MediaType } from '@/data/constants';
import type { LibraryItem } from '@/services/types';

export type LibraryStats = {
  total: number;
  counts: Record<MediaType, number>;
  byStatus: { status: Status; count: number }[];
  averageRating: Record<MediaType, number | null>;
  topGenres: { genre: string; count: number }[];
};

export function computeStats(items: LibraryItem[]): LibraryStats {
  const counts: Record<MediaType, number> = { book: 0, movie: 0, show: 0 };
  const statusMap = new Map<Status, number>();
  const ratingSum: Record<MediaType, number> = { book: 0, movie: 0, show: 0 };
  const ratingCount: Record<MediaType, number> = { book: 0, movie: 0, show: 0 };
  const genreMap = new Map<string, number>();

  for (const item of items) {
    counts[item.media_type] += 1;
    statusMap.set(item.status, (statusMap.get(item.status) ?? 0) + 1);
    if (item.rating != null) {
      ratingSum[item.media_type] += item.rating;
      ratingCount[item.media_type] += 1;
    }
    for (const genre of item.genres ?? []) {
      genreMap.set(genre, (genreMap.get(genre) ?? 0) + 1);
    }
  }

  const averageRating: Record<MediaType, number | null> = {
    book: ratingCount.book ? ratingSum.book / ratingCount.book : null,
    movie: ratingCount.movie ? ratingSum.movie / ratingCount.movie : null,
    show: ratingCount.show ? ratingSum.show / ratingCount.show : null,
  };

  const byStatus = Array.from(statusMap.entries())
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  const topGenres = Array.from(genreMap.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return { total: items.length, counts, byStatus, averageRating, topGenres };
}
