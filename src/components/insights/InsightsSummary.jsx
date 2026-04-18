'use client';

import { TrendingUp, DollarSign, BarChart2, Trophy } from 'lucide-react';
import InsightCard from './InsightCard';
import DonutChart from './DonutChart';
import { formatLargeAmount, formatPercent } from '@/lib/formatters';

function InsightSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 skeleton rounded" />
        <div className="h-9 w-9 skeleton rounded-xl" />
      </div>
      <div className="h-8 w-36 skeleton rounded" />
      <div className="h-3 w-24 skeleton rounded" />
    </div>
  );
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '—';
}

export default function InsightsSummary({ aggregations, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[0, 1, 2, 3].map(i => <InsightSkeleton key={i} />)}
      </div>
    );
  }

  const { total, totalSuccessAmount, successRate, topCategory } = aggregations;
  const successCount = Math.round((successRate / 100) * total);

  const cards = [
    {
      label:   'Total Transactions',
      value:   total.toLocaleString(),
      subtext: 'Loaded & matching filters',
      icon:    <TrendingUp className="w-4 h-4 text-blue-400" />,
      iconBg:  'bg-blue-500/10',
      accent:  'text-slate-100',
    },
    {
      label:   'Successful Amount',
      value:   formatLargeAmount(totalSuccessAmount),
      subtext: 'Sum of all successful txns',
      icon:    <DollarSign className="w-4 h-4 text-emerald-400" />,
      iconBg:  'bg-emerald-500/10',
      accent:  'text-emerald-400',
    },
    {
      label:   'Success Rate',
      value:   formatPercent(successRate),
      subtext: `${successCount} of ${total} succeeded`,
      icon:    <BarChart2 className="w-4 h-4 text-violet-400" />,
      iconBg:  'bg-violet-500/10',
      accent:  'text-violet-400',
      extra:   <DonutChart percentage={successRate} />,
    },
    {
      label:   'Top Category',
      value:   topCategory ? capitalize(topCategory.name) : '—',
      subtext: topCategory ? `${formatLargeAmount(topCategory.amount)} total volume` : 'No data yet',
      icon:    <Trophy className="w-4 h-4 text-amber-400" />,
      iconBg:  'bg-amber-500/10',
      accent:  'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map(card => <InsightCard key={card.label} {...card} />)}
    </div>
  );
}
