import { useMemo } from 'react';

export function useFilteredTransactions(transactions, filters) {
  return useMemo(() => {
    return transactions.filter(tx => {
      if (filters.statuses.length > 0) {
        const status = tx.status ? 'success' : 'failed';
        if (!filters.statuses.includes(status)) return false;
      }

      if (filters.categories.length > 0 && !filters.categories.includes(tx.category)) {
        return false;
      }

      if (filters.dateFrom && new Date(tx.createdAt) < new Date(filters.dateFrom)) {
        return false;
      }

      if (filters.dateTo && new Date(tx.createdAt) > new Date(`${filters.dateTo}T23:59:59`)) {
        return false;
      }

      return true;
    });
  }, [transactions, filters]);
}

export function useAggregations(transactions) {
  return useMemo(() => {
    const total = transactions.length;

    if (total === 0) {
      return { total: 0, totalSuccessAmount: 0, successRate: 0, topCategory: null };
    }

    const successful = transactions.filter(tx => tx.status);

    const totalSuccessAmount = successful.reduce(
      (sum, tx) => sum + (parseFloat(tx.amount) || 0), 0
    );

    const successRate = (successful.length / total) * 100;

    const byCategory = transactions.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + (parseFloat(tx.amount) || 0);
      return acc;
    }, {});

    const [topName, topAmount] = Object.entries(byCategory).sort(([, a], [, b]) => b - a)[0] ?? [];

    return {
      total,
      totalSuccessAmount,
      successRate,
      topCategory: topName ? { name: topName, amount: topAmount } : null,
    };
  }, [transactions]);
}
