import { X } from 'lucide-react';

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-full">
      {label}
      <button onClick={onRemove} className="text-slate-500 hover:text-slate-300 transition-colors ml-0.5">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

export default function FilterChips({ filters, updateFilter, totalLoaded, totalFiltered }) {
  const removeStatus   = s => updateFilter('statuses', filters.statuses.filter(v => v !== s));
  const removeCategory = c => updateFilter('categories', filters.categories.filter(v => v !== c));
  const clearDates     = () => { updateFilter('dateFrom', ''); updateFilter('dateTo', ''); };

  const hasDateFilter = filters.dateFrom || filters.dateTo;

  if (!filters.statuses.length && !filters.categories.length && !hasDateFilter && !totalLoaded) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.statuses.map(s => (
        <Chip key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} onRemove={() => removeStatus(s)} />
      ))}
      {filters.categories.map(c => (
        <Chip key={c} label={c.charAt(0).toUpperCase() + c.slice(1)} onRemove={() => removeCategory(c)} />
      ))}
      {hasDateFilter && (
        <Chip
          label={`${filters.dateFrom || '…'} → ${filters.dateTo || '…'}`}
          onRemove={clearDates}
        />
      )}

      {totalLoaded > 0 && (
        <span className="ml-auto text-xs text-slate-500">
          Showing{' '}
          <span className="text-slate-300 font-medium">{totalFiltered.toLocaleString()}</span>
          {' '}of{' '}
          <span className="text-slate-300 font-medium">{totalLoaded.toLocaleString()}</span>
          {' '}loaded
        </span>
      )}
    </div>
  );
}
