'use client';

import { SlidersHorizontal } from 'lucide-react';
import SearchInput from './SearchInput';
import MultiSelect from './MultiSelect';
import DateRangePicker from './DateRangePicker';
import FilterChips from './FilterChips';
import { STATUS_OPTIONS } from '@/constants';

export default function FilterBar({
  filters,
  updateFilter,
  clearAll,
  hasActiveFilters,
  availableCategories,
  totalLoaded,
  totalFiltered,
}) {
  const categoryOptions = availableCategories.map(c => ({ label: c, value: c }));

  return (
    <div className="mb-5 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={filters.search}
          onChange={v => updateFilter('search', v)}
        />

        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />

          <MultiSelect
            label="Status"
            options={STATUS_OPTIONS}
            selected={filters.statuses}
            onChange={v => updateFilter('statuses', v)}
          />

          <MultiSelect
            label="Category"
            options={categoryOptions}
            selected={filters.categories}
            onChange={v => updateFilter('categories', v)}
          />

          <DateRangePicker
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            onFromChange={v => updateFilter('dateFrom', v)}
            onToChange={v => updateFilter('dateTo', v)}
          />

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="px-3 py-2 text-xs text-rose-400 border border-rose-500/30 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <FilterChips
        filters={filters}
        updateFilter={updateFilter}
        totalLoaded={totalLoaded}
        totalFiltered={totalFiltered}
      />
    </div>
  );
}
