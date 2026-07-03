import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/contexts/auth-context';
import {
  addLibraryItem,
  fetchLibrary,
  fetchLibraryItem,
  fetchProfile,
  removeLibraryItem,
  toggleFavorite,
} from '@/services/library';
import { computeStats } from '@/services/stats';
import type { NewLibraryItem } from '@/services/types';

const LIBRARY_KEY = ['library'];

export function useLibrary() {
  const { session } = useAuth();
  return useQuery({
    queryKey: LIBRARY_KEY,
    queryFn: fetchLibrary,
    enabled: session != null,
  });
}

export function useLibraryItem(id: string) {
  const { session } = useAuth();
  return useQuery({
    queryKey: ['library-item', id],
    queryFn: () => fetchLibraryItem(id),
    enabled: session != null && Boolean(id),
  });
}

export function useProfile() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: session != null,
  });
}

export function useStats() {
  const library = useLibrary();
  return {
    ...library,
    stats: library.data ? computeStats(library.data) : null,
  };
}

export function useAddToLibrary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewLibraryItem) => addLibraryItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIBRARY_KEY });
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: boolean }) => toggleFavorite(id, value),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: LIBRARY_KEY });
      queryClient.invalidateQueries({ queryKey: ['library-item', id] });
    },
  });
}

export function useRemoveFromLibrary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeLibraryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIBRARY_KEY });
    },
  });
}
