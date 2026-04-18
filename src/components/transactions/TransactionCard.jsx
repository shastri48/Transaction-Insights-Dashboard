'use client';

import Image from 'next/image';
import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { formatAmount, formatDate } from '@/lib/formatters';

export default function TransactionCard({ transaction: tx, index }) {
  return (
    <div
      className="group bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-600 hover:bg-slate-800/50 transition-all duration-200 animate-slide-up"
      style={{ animationDelay: `${Math.min(index * 25, 250)}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Avatar with status dot */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-slate-700 group-hover:ring-slate-600 transition-all bg-slate-700">
            <Image
              src={tx.avatar}
              alt={tx.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
            tx.status ? 'bg-emerald-500' : 'bg-rose-500'
          }`} />
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-100 truncate text-sm">{tx.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            <span className="text-slate-400 font-mono">#{tx.id}</span>
            {' · '}
            {formatDate(tx.createdAt)}
          </p>
        </div>

        {/* Amount + badges */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className={`font-bold text-base tabular-nums ${
            tx.status ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {tx.status ? '+' : '-'}{formatAmount(tx.amount, tx.currency)}
          </span>
          <div className="flex items-center gap-1.5">
            <CategoryBadge category={tx.category} />
            <StatusBadge status={tx.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
