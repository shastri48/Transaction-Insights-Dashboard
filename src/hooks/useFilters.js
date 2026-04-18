import { useState, useCallback } from 'react';

const DEFAULT_FILTERS = {
  search:     '',
  statuses:   [],
  categories: [],
  dateFrom:   '',
  dateTo:     '',
};

export function useFilters() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearAll = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const hasActiveFilters =
    filters.search ||
    filters.statuses.length > 0 ||
    filters.categories.length > 0 ||
    filters.dateFrom ||
    filters.dateTo;

  return { filters, updateFilter, clearAll, hasActiveFilters };
}
