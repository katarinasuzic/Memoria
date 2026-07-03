import type { SearchFilter } from '@/data/constants';
import { searchBooks } from '@/services/openlibrary';
import { isTmdbConfigured, searchMovies } from '@/services/tmdb';
import { searchShows } from '@/services/tvmaze';
import type { SearchResult } from '@/services/types';

export type SearchSection = {
  key: 'book' | 'movie' | 'show';
  title: string;
  results: SearchResult[];
  /** Set when the source could not be queried (e.g. TMDB not configured). */
  unavailable?: string;
};

async function safe(fn: () => Promise<SearchResult[]>): Promise<SearchResult[]> {
  try {
    return await fn();
  } catch {
    return [];
  }
}

/**
 * Universal search across the connected media APIs. Movies come from TMDB and
 * are reported as unavailable (never faked) when TMDB is not configured.
 */
export async function universalSearch(
  query: string,
  filter: SearchFilter,
  signal?: AbortSignal,
): Promise<SearchSection[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const wantBooks = filter === 'All' || filter === 'Books';
  const wantMovies = filter === 'All' || filter === 'Movies';
  const wantShows = filter === 'All' || filter === 'TV Shows';

  const [books, shows] = await Promise.all([
    wantBooks ? safe(() => searchBooks(trimmed, signal)) : Promise.resolve([]),
    wantShows ? safe(() => searchShows(trimmed, signal)) : Promise.resolve([]),
  ]);

  const sections: SearchSection[] = [];
  if (wantBooks) sections.push({ key: 'book', title: 'Books', results: books });

  if (wantMovies) {
    if (isTmdbConfigured) {
      const movies = await safe(() => searchMovies(trimmed, signal));
      sections.push({ key: 'movie', title: 'Movies', results: movies });
    } else {
      sections.push({
        key: 'movie',
        title: 'Movies',
        results: [],
        unavailable: 'Movie database unavailable.',
      });
    }
  }

  if (wantShows) sections.push({ key: 'show', title: 'TV Shows', results: shows });

  return sections;
}
