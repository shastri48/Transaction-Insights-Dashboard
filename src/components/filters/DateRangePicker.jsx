export default function DateRangePicker({ dateFrom, dateTo, onFromChange, onToChange }) {
  const inputClass =
    'px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all [color-scheme:dark]';

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="date"
        value={dateFrom}
        onChange={e => onFromChange(e.target.value)}
        className={inputClass}
        title="From date"
      />
      <span className="text-slate-600 text-sm">—</span>
      <input
        type="date"
        value={dateTo}
        onChange={e => onToChange(e.target.value)}
        className={inputClass}
        title="To date"
      />
    </div>
  );
}
