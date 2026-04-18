export const BASE_URL =
  'https://696e0139d7bacd2dd7155c6a.mockapi.io/barter-tech/transactions';

export const PAGE_SIZE = 15;

export const STATUS_OPTIONS = [
  { label: 'Success', value: 'success' },
  { label: 'Failed',  value: 'failed'  },
];

export const CATEGORY_COLORS = {
  withdrawal: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  deposit:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  transfer:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  payment:    'bg-purple-500/10 text-purple-400 border-purple-500/20',
  refund:     'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

export const DEFAULT_CATEGORY_COLOR = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
