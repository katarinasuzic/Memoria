import type { SearchResult } from '@/services/types';

/**
 * TMDB movie client.
 *
 * Requires an API key. Supports either a v3 API key (`EXPO_PUBLIC_TMDB_API_KEY`)
 * or a v4 read access token (`EXPO_PUBLIC_TMDB_ACCESS_TOKEN`). When neither is
 * configured, {@link isTmdbConfigured} is `false` and callers should show a
 * "Movie database unavailable." empty state instead of any placeholder data.
 */
const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const ACCESS_TOKEN = process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

export const isTmdbConfigured = Boolean(API_KEY || ACCESS_TOKEN);

export class TmdbUnavailableError extends Error {
  constructor(message = 'Movie database unavailable.') {
    super(message);
    this.name = 'TmdbUnavailableError';
  }
}

type TmdbMovie = {
  id: number;
  title?: string;
  release_date?: string;
  poster_path?: string | null;
  genre_ids?: number[];
};

function toResult(movie: TmdbMovie): SearchResult {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : undefined;
  return {
    source: 'tmdb',
    externalId: String(movie.id),
    mediaType: 'movie',
    title: movie.title ?? 'Untitled',
    subtitle: year ?? 'Movie',
    coverUrl: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null,
    year,
  };
}

async function tmdbFetch(path: string, params: Record<string, string>, signal?: AbortSignal) {
  if (!isTmdbConfigured) {
    throw new TmdbUnavailableError();
  }

  const search = new URLSearchParams(params);
  const headers: Record<string, string> = { accept: 'application/json' };
  if (ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
  } else if (API_KEY) {
    search.set('api_key', API_KEY);
  }

  const res = await fetch(`${BASE_URL}${path}?${search.toString()}`, { headers, signal });
  if (res.status === 401) {
    throw new TmdbUnavailableError('Movie database unavailable — TMDB authentication failed.');
  }
  if (!res.ok) {
    throw new TmdbUnavailableError(`Movie database unavailable (${res.status}).`);
  }
  return res.json();
}

export async function searchMovies(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
  const data = (await tmdbFetch('/search/movie', {
    query,
    include_adult: 'false',
    language: 'en-US',
    page: '1',
  }, signal)) as { results?: TmdbMovie[] };
  return (data.results ?? []).map(toResult);
}

export async function trendingMovies(signal?: AbortSignal): Promise<SearchResult[]> {
  const data = (await tmdbFetch('/trending/movie/week', { language: 'en-US' }, signal)) as {
    results?: TmdbMovie[];
  };
  return (data.results ?? []).slice(0, 12).map(toResult);
}
