'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export default function MultiSelect({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = value =>
    onChange(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value]
    );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={clsx(
          'flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all',
          selected.length > 0
            ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
        )}
      >
        {label}
        {selected.length > 0 && (
          <span className="w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {selected.length}
          </span>
        )}
        <ChevronDown className={clsx('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 min-w-[160px] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-fade-in">
          {options.map(opt => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className="accent-blue-500 w-3.5 h-3.5"
              />
              <span className="text-sm text-slate-200 capitalize">{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
