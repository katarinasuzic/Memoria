import type { SearchResult } from '@/services/types';

const SEARCH_URL = 'https://openlibrary.org/search.json';
const TRENDING_URL = 'https://openlibrary.org/trending/daily.json';

type OpenLibraryDoc = {
  key: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  cover_edition_key?: string;
  subject?: string[];
};

function coverUrl(doc: OpenLibraryDoc): string | null {
  if (doc.cover_i) {
    return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
  }
  if (doc.cover_edition_key) {
    return `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-M.jpg`;
  }
  return null;
}

function toResult(doc: OpenLibraryDoc): SearchResult {
  return {
    source: 'openlibrary',
    externalId: doc.key,
    mediaType: 'book',
    title: doc.title ?? 'Untitled',
    subtitle: doc.author_name?.[0] ?? 'Unknown author',
    coverUrl: coverUrl(doc),
    year: doc.first_publish_year ? String(doc.first_publish_year) : undefined,
    genres: doc.subject?.slice(0, 3),
  };
}

export async function searchBooks(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
  const url = `${SEARCH_URL}?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,first_publish_year,cover_i,cover_edition_key`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Open Library request failed (${res.status})`);
  }
  const data = (await res.json()) as { docs?: OpenLibraryDoc[] };
  return (data.docs ?? []).filter((d) => d.title).map(toResult);
}

export async function trendingBooks(signal?: AbortSignal): Promise<SearchResult[]> {
  const res = await fetch(TRENDING_URL, { signal });
  if (!res.ok) {
    throw new Error(`Open Library trending request failed (${res.status})`);
  }
  const data = (await res.json()) as { works?: OpenLibraryDoc[] };
  return (data.works ?? []).slice(0, 12).map(toResult);
}
