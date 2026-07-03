import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import type { SearchFilter } from '@/data/constants';
import { universalSearch } from '@/services/search';

function useDebounced<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useUniversalSearch(query: string, filter: SearchFilter) {
  const debouncedQuery = useDebounced(query.trim());

  const result = useQuery({
    queryKey: ['search', debouncedQuery, filter],
    queryFn: ({ signal }) => universalSearch(debouncedQuery, filter, signal),
    enabled: debouncedQuery.length >= 2,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  return { ...result, debouncedQuery, isTyping: query.trim() !== debouncedQuery };
}
