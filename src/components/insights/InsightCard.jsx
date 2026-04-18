export default function InsightCard({ label, value, subtext, icon, iconBg, accent, extra }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors duration-200 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <div className={`p-2 rounded-xl ${iconBg}`}>{icon}</div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <p className={`text-2xl font-bold tracking-tight ${accent}`}>{value}</p>
          <p className="text-xs text-slate-500 mt-1">{subtext}</p>
        </div>
        {extra}
      </div>
    </div>
  );
}
