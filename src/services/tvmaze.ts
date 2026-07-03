import type { SearchResult } from '@/services/types';

const SEARCH_URL = 'https://api.tvmaze.com/search/shows';

type TvMazeShow = {
  id: number;
  name: string;
  premiered?: string | null;
  genres?: string[];
  image?: { medium?: string; original?: string } | null;
  network?: { name?: string } | null;
  webChannel?: { name?: string } | null;
};

function toResult(show: TvMazeShow): SearchResult {
  const year = show.premiered ? show.premiered.slice(0, 4) : undefined;
  const network = show.network?.name ?? show.webChannel?.name;
  return {
    source: 'tvmaze',
    externalId: String(show.id),
    mediaType: 'show',
    title: show.name,
    subtitle: network ? `${network}${year ? ` · ${year}` : ''}` : (year ?? 'TV Show'),
    coverUrl: show.image?.medium ?? show.image?.original ?? null,
    year,
    genres: show.genres?.slice(0, 3),
  };
}

export async function searchShows(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
  const url = `${SEARCH_URL}?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`TVMaze request failed (${res.status})`);
  }
  const data = (await res.json()) as { show: TvMazeShow }[];
  return data.map((entry) => toResult(entry.show));
}
