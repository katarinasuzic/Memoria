import { Ionicons } from '@expo/vector-icons';

import type { Status } from '@/components/ui/status-badge';

export type MediaType = 'book' | 'movie' | 'show';

export type ReviewType = 'Quick Thought' | 'Full Review' | 'Spoiler Review';
export type Platform = 'Netflix' | 'Disney+' | 'Max' | 'Prime Video' | 'Cinema' | 'TV' | 'Other';
export type Edition = 'Paperback' | 'Hardcover' | 'Ebook' | 'Audiobook';
export type ListVisibility = 'Public' | 'Friends Only' | 'Private';

export type MediaItem = {
  id: string;
  type: MediaType;
  title: string;
  subtitle: string;
  cover: string;
  /** 0-5 for books, 0-10 for movies/shows. */
  rating: number;
  genres: string[];
  status?: Status;
  progress?: { current: number; total: number; label: string };
  // Book
  edition?: Edition;
  own?: boolean;
  pages?: number;
  // Movie / TV
  platform?: Platform;
  watchDate?: string;
  seasons?: number;
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
    edition: 'Hardcover',
    own: true,
    pages: 1014,
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
    edition: 'Paperback',
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
    edition: 'Ebook',
    own: true,
  },
];

export const movies: MediaItem[] = [
  {
    id: 'dune',
    type: 'movie',
    title: 'Dune',
    subtitle: '2021',
    cover: cover('dune'),
    rating: 9.0,
    genres: ['Sci-Fi', 'Adventure'],
    status: 'Watched',
    platform: 'Max',
    watchDate: 'Mar 2, 2024',
  },
  {
    id: 'dune-two',
    type: 'movie',
    title: 'Dune: Part Two',
    subtitle: '2024',
    cover: cover('dunetwo'),
    rating: 9.6,
    genres: ['Sci-Fi'],
    status: 'Want to Watch',
    platform: 'Cinema',
  },
];

export const shows: MediaItem[] = [
  {
    id: 'arcane',
    type: 'show',
    title: 'Arcane',
    subtitle: '2021 - 2024',
    cover: cover('arcane'),
    rating: 9.8,
    genres: ['Animation', 'Action'],
    status: 'Watching',
    progress: { current: 6, total: 9, label: 'Season 1, Episode 6' },
    platform: 'Netflix',
    seasons: 2,
  },
  {
    id: 'the-bear',
    type: 'show',
    title: 'The Bear',
    subtitle: 'TV Show',
    cover: cover('thebear'),
    rating: 9.4,
    genres: ['Drama', 'Comedy'],
    status: 'Up to Date',
    platform: 'Disney+',
    seasons: 3,
  },
];

export const allMedia: MediaItem[] = [...books, ...movies, ...shows];

export function getMediaById(id: string): MediaItem | undefined {
  return allMedia.find((m) => m.id === id);
}

export function detailHref(item: MediaItem): string {
  return `/${item.type}/${item.id}`;
}

export const recommended: MediaItem[] = [movies[0], books[1], shows[1]];

export type FeedActivity = {
  id: string;
  name: string;
  action: string;
  title: string;
  mediaType: MediaType;
  rating: number;
  time: string;
  likes: number;
  comments: number;
};

export const friendsActivity: FeedActivity[] = [
  { id: 'f1', name: 'Sara', action: 'finished', title: 'Fourth Wing', mediaType: 'book', rating: 5, time: '2h', likes: 12, comments: 3 },
  { id: 'f2', name: 'Milos', action: 'watched', title: 'Interstellar', mediaType: 'movie', rating: 5, time: '5h', likes: 24, comments: 5 },
  { id: 'f3', name: 'Lena', action: 'finished Season 2 of', title: 'Arcane', mediaType: 'show', rating: 5, time: '1d', likes: 41, comments: 8 },
];

export const feedFilters = ['Everyone', 'Friends', 'Books', 'Movies', 'TV'] as const;

export const trending = [
  { rank: 1, item: books[2], rating: 4.6 },
  { rank: 2, item: movies[1], rating: 9.6 },
  { rank: 3, item: shows[1], rating: 9.4 },
];

export const recentSearches = ['The Hobbit', 'Interstellar', 'Arcane', 'Brandon Sanderson'];

export const favorites: MediaItem[] = [books[0], movies[0], shows[0]];

export const searchFilters = ['All', 'Books', 'Movies', 'TV Shows', 'People'] as const;

export const upcomingEpisodes = [
  { id: 'u1', show: 'Severance', cover: cover('severance'), label: 'S2 · Episode 4', date: 'Tomorrow' },
  { id: 'u2', show: 'The Last of Us', cover: cover('lastofus'), label: 'S2 · Episode 1', date: 'Fri' },
];

export type Review = {
  id: string;
  media: string;
  mediaType: MediaType;
  type: ReviewType;
  text: string;
  rating: number;
  time: string;
  likes: number;
  comments: number;
  spoiler?: boolean;
};

export const reviews: Review[] = [
  {
    id: 'r1',
    media: 'Interstellar',
    mediaType: 'movie',
    type: 'Full Review',
    text: 'A perfect blend of science and emotion. The score alone earns a full point.',
    rating: 10,
    time: '2d',
    likes: 34,
    comments: 6,
  },
  {
    id: 'r2',
    media: 'The Way of Kings',
    mediaType: 'book',
    type: 'Quick Thought',
    text: 'Slow start, but the back half is pure magic. Bridge Four forever.',
    rating: 5,
    time: '1w',
    likes: 18,
    comments: 2,
  },
  {
    id: 'r3',
    media: 'Arcane',
    mediaType: 'show',
    type: 'Spoiler Review',
    text: 'That mid-season finale changes everything about Jinx and Vi...',
    rating: 10,
    time: '3w',
    likes: 52,
    comments: 11,
    spoiler: true,
  },
];

export type CustomList = {
  id: string;
  title: string;
  count: number;
  visibility: ListVisibility;
  covers: string[];
};

export const customLists: CustomList[] = [
  {
    id: 'l1',
    title: 'Best Fantasy Books',
    count: 24,
    visibility: 'Public',
    covers: [cover('wayofkings'), cover('nightcircus'), cover('cerulean')],
  },
  {
    id: 'l2',
    title: 'Comfort Shows',
    count: 9,
    visibility: 'Friends Only',
    covers: [cover('arcane'), cover('thebear'), cover('severance')],
  },
  {
    id: 'l3',
    title: 'Favorites of 2026',
    count: 15,
    visibility: 'Private',
    covers: [cover('dune'), cover('dunetwo'), cover('lastofus')],
  },
];

export type Quote = { id: string; text: string; source: string; type: MediaType };

export const quotes: Quote[] = [
  { id: 'q1', text: 'Life before death. Strength before weakness. Journey before destination.', source: 'The Way of Kings', type: 'book' },
  { id: 'q2', text: "We're not the same. I'm a monster.", source: 'Arcane', type: 'show' },
];

export type AppNotification = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: 'purple' | 'green' | 'cyan' | 'amber' | 'pink';
  text: string;
  time: string;
  unread: boolean;
};

export const notifications: AppNotification[] = [
  { id: 'n1', icon: 'person-add', color: 'purple', text: 'Sara started following you.', time: '10m', unread: true },
  { id: 'n2', icon: 'heart', color: 'pink', text: 'Milos liked your review of Interstellar.', time: '1h', unread: true },
  { id: 'n3', icon: 'chatbubble-ellipses', color: 'cyan', text: 'Lena commented: "Totally agree!"', time: '3h', unread: true },
  { id: 'n4', icon: 'checkmark-done', color: 'green', text: 'Sara finished The Lost Hero — a book you recommended.', time: '1d', unread: false },
  { id: 'n5', icon: 'tv', color: 'amber', text: 'New episode of Arcane is out now.', time: '2d', unread: false },
];
