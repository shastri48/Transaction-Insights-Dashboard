import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchTransactions } from '@/lib/api';
import { PAGE_SIZE } from '@/constants';

export function useTransactions(search) {
  return useInfiniteQuery({
    queryKey: ['transactions', search],
    queryFn: ({ pageParam = 1 }) => fetchTransactions({ page: pageParam, search }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length + 1,
    initialPageParam: 1,
    staleTime: 60_000,
    retry: 2,
  });
}
