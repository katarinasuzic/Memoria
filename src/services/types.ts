import type { Status } from '@/components/ui/status-badge';
import type { MediaType, ReviewType } from '@/data/constants';

/** A normalized result from any external media API (Open Library, TMDB, TVMaze). */
export type SearchResult = {
  source: 'openlibrary' | 'tmdb' | 'tvmaze';
  externalId: string;
  mediaType: MediaType;
  title: string;
  subtitle: string;
  coverUrl: string | null;
  year?: string;
  genres?: string[];
};

/** A row in the user's library (mirrors public.library_items). */
export type LibraryItem = {
  id: string;
  user_id: string;
  media_type: MediaType;
  source: string | null;
  external_id: string;
  title: string;
  subtitle: string | null;
  cover_url: string | null;
  status: Status;
  rating: number | null;
  review: string | null;
  review_type: ReviewType | null;
  spoiler: boolean;
  is_favorite: boolean;
  progress_current: number | null;
  progress_total: number | null;
  genres: string[] | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Payload used when saving a search result into the library. */
export type NewLibraryItem = {
  media_type: MediaType;
  source: string;
  external_id: string;
  title: string;
  subtitle: string | null;
  cover_url: string | null;
  status: Status;
  rating: number | null;
  review: string | null;
  review_type: ReviewType | null;
  spoiler: boolean;
  genres?: string[] | null;
};
