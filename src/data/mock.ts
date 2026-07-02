import type { Status } from '@/components/ui/status-badge';

export type MediaType = 'book' | 'movie' | 'show';

export type MediaItem = {
  id: string;
  type: MediaType;
  title: string;
  subtitle: string;
  cover: string;
  rating: number; // 0-5
  genres: string[];
  status?: Status;
  progress?: { current: number; total: number; label: string };
};

const cover = (seed: string) => `https://picsum.photos/seed/${seed}/300/450`;

export const currentUser = {
  name: 'Kale',
  handle: '@kale.reader',
  bio: 'Just a person who collects memories through books, movies and shows.',
  stats: { following: 128, followers: 342, ratings: '1.2K' },
};

export const books: MediaItem[] = [
  {
    id: 'way-of-kings',
    type: 'book',
    title: 'The Way of Kings',
    subtitle: 'Brandon Sanderson',
    cover: cover('wayofkings'),
    rating: 4.8,
    genres: ['Fantasy'],
    status: 'Reading',
    progress: { current: 684, total: 1014, label: 'Page 684 of 1014' },
  },
  {
    id: 'night-circus',
    type: 'book',
    title: 'The Night Circus',
    subtitle: 'Erin Morgenstern',
    cover: cover('nightcircus'),
    rating: 4.3,
    genres: ['Fantasy', 'Romance'],
    status: 'Want to Read',
  },
  {
    id: 'cerulean-sea',
    type: 'book',
    title: 'The House in the Cerulean Sea',
    subtitle: 'TJ Klune',
    cover: cover('cerulean'),
    rating: 4.6,
    genres: ['Fantasy'],
    status: 'Read',
  },
];

export const movies: MediaItem[] = [
  {
    id: 'dune',
    type: 'movie',
    title: 'Dune',
    subtitle: '2021',
    cover: cover('dune'),
    rating: 4.5,
    genres: ['Sci-Fi', 'Adventure'],
    status: 'Watched',
  },
  {
    id: 'dune-two',
    type: 'movie',
    title: 'Dune: Part Two',
    subtitle: '2024',
    cover: cover('dunetwo'),
    rating: 4.8,
    genres: ['Sci-Fi'],
    status: 'Want to Read',
  },
];

export const shows: MediaItem[] = [
  {
    id: 'arcane',
    type: 'show',
    title: 'Arcane',
    subtitle: '2021 - 2024',
    cover: cover('arcane'),
    rating: 4.9,
    genres: ['Animation', 'Action'],
    status: 'Watching',
    progress: { current: 6, total: 9, label: 'Season 1, Episode 6' },
  },
  {
    id: 'the-bear',
    type: 'show',
    title: 'The Bear',
    subtitle: 'TV Show',
    cover: cover('thebear'),
    rating: 4.7,
    genres: ['Drama', 'Comedy'],
    status: 'Watching',
  },
];

export const allMedia: MediaItem[] = [...books, ...movies, ...shows];

export function getMediaById(id: string): MediaItem | undefined {
  return allMedia.find((m) => m.id === id);
}

export const recommended: MediaItem[] = [movies[0], books[1], shows[1]];

export const friendsActivity = [
  { id: 'f1', name: 'Sara', action: 'finished', title: 'Fourth Wing', rating: 5, time: '2h' },
  { id: 'f2', name: 'Milos', action: 'watched', title: 'Interstellar', rating: 5, time: '5h' },
  { id: 'f3', name: 'Lena', action: 'reviewed', title: 'The Hunger Games', rating: 4, time: '1d' },
];

export const trending = [
  { rank: 1, item: books[2], rating: 4.6 },
  { rank: 2, item: movies[1], rating: 4.8 },
  { rank: 3, item: shows[1], rating: 4.7 },
];

export const recentSearches = ['The Hobbit', 'Interstellar', 'Arcane', 'Brandon Sanderson'];

export const favorites: MediaItem[] = [books[0], movies[0], shows[0]];

export const searchFilters = ['All', 'Books', 'Movies', 'TV Shows', 'People'] as const;
