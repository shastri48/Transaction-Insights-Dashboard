'use client';

import { useMemo } from 'react';
import { Activity } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { useFilteredTransactions, useAggregations } from '@/hooks/useAggregations';
import { useDebounce } from '@/hooks/useDebounce';
import { useFilters } from '@/hooks/useFilters';
import InsightsSummary from '@/components/insights/InsightsSummary';
import FilterBar from '@/components/filters/FilterBar';
import TransactionList from '@/components/transactions/TransactionList';

export default function DashboardPage() {
  const { filters, updateFilter, clearAll, hasActiveFilters } = useFilters();
  const debouncedSearch = useDebounce(filters.search);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useTransactions(debouncedSearch);

  const allTransactions = useMemo(() => data?.pages.flat() ?? [], [data]);
  const filteredTransactions = useFilteredTransactions(allTransactions, filters);
  const aggregations = useAggregations(filteredTransactions);

  const availableCategories = useMemo(
    () => [...new Set(allTransactions.map(tx => tx.category))].sort(),
    [allTransactions]
  );

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Transaction Insights
            </h1>
          </div>
          <p className="text-sm text-slate-500 ml-[52px]">
            Monitor, filter, and analyze your financial transactions in real time
          </p>
        </header>

        <InsightsSummary aggregations={aggregations} isLoading={isLoading} />

        <FilterBar
          filters={filters}
          updateFilter={updateFilter}
          clearAll={clearAll}
          hasActiveFilters={hasActiveFilters}
          availableCategories={availableCategories}
          totalLoaded={allTransactions.length}
          totalFiltered={filteredTransactions.length}
        />

        {!isLoading && (
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Transactions
            </h2>
            {filteredTransactions.length > 0 && (
              <span className="text-xs text-slate-600">
                {filteredTransactions.length.toLocaleString()} result
                {filteredTransactions.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        <TransactionList
          transactions={filteredTransactions}
          isLoading={isLoading}
          isError={isError}
          error={error}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          allTransactionsCount={allTransactions.length}
        />

      </div>
    </main>
  );
}
