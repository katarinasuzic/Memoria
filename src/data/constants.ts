import type { Status } from '@/components/ui/status-badge';

export type MediaType = 'book' | 'movie' | 'show';
export type ReviewType = 'Quick Thought' | 'Full Review' | 'Spoiler Review';

export const MEDIA_LABEL: Record<MediaType, string> = {
  book: 'Book',
  movie: 'Movie',
  show: 'TV Show',
};

/** Selectable statuses per media type (from the product vision). */
export const STATUS_OPTIONS: Record<MediaType, Status[]> = {
  book: ['Want to Read', 'Reading', 'Read', 'Re-reading', 'DNF'],
  movie: ['Want to Watch', 'Watching', 'Watched', 'Rewatching', 'DNF'],
  show: ['Want to Watch', 'Watching', 'Up to Date', 'Completed', 'Paused', 'Rewatching', 'DNF'],
};

/** Statuses that represent "in progress" for Home's continue sections. */
export const IN_PROGRESS_STATUSES: Status[] = ['Reading', 'Watching', 'Re-reading', 'Rewatching'];

export const REVIEW_TYPES: ReviewType[] = ['Quick Thought', 'Full Review', 'Spoiler Review'];

/** Native rating scale per media type. */
export const RATING_SCALE: Record<MediaType, 5 | 10> = {
  book: 5,
  movie: 10,
  show: 10,
};

export const SEARCH_FILTERS = ['All', 'Books', 'Movies', 'TV Shows'] as const;
export type SearchFilter = (typeof SEARCH_FILTERS)[number];

export const MEDIA_ICON: Record<MediaType, 'book' | 'film' | 'tv'> = {
  book: 'book',
  movie: 'film',
  show: 'tv',
};
