'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AlertCircle, RefreshCw, Inbox, CheckCircle2 } from 'lucide-react';
import TransactionCard from './TransactionCard';
import TransactionSkeleton from './TransactionSkeleton';
import Spinner from '@/components/ui/Spinner';

export default function TransactionList({
  transactions,
  isLoading,
  isError,
  error,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  allTransactionsCount,
}) {
  const sentinelRef = useRef(null);

  const onIntersect = useCallback(([entry]) => {
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    // rootMargin pushes the trigger point 300px above the bottom — loads before user reaches end
    const observer = new IntersectionObserver(onIntersect, { rootMargin: '0px 0px 300px 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect]);

  if (isLoading) {
    return (
      <div className="space-y-2.5">
        {Array.from({ length: 8 }).map((_, i) => <TransactionSkeleton key={i} />)}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 bg-rose-500/10 rounded-2xl mb-4">
          <AlertCircle className="w-10 h-10 text-rose-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200">Failed to load transactions</h3>
        <p className="text-sm text-slate-500 mt-1 mb-5 max-w-xs">{error?.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 bg-slate-800 rounded-2xl mb-4">
          <Inbox className="w-10 h-10 text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-300">No transactions found</h3>
        <p className="text-sm text-slate-500 mt-1">
          {allTransactionsCount > 0 ? 'Try adjusting your filters' : 'No transactions available'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {transactions.map((tx, i) => (
        <TransactionCard key={tx.id} transaction={tx} index={i} />
      ))}

      {/* Sentinel — watched by IntersectionObserver */}
      <div ref={sentinelRef} aria-hidden="true" />

      {isFetchingNextPage && <Spinner label="Loading more transactions…" />}

      {!hasNextPage && !isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 py-6 text-slate-600">
          <CheckCircle2 className="w-4 h-4 text-slate-700" />
          <span className="text-sm">All transactions loaded</span>
        </div>
      )}
    </div>
  );
}
