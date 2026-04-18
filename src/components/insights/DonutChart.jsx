export default function DonutChart({ percentage }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90" aria-hidden="true">
      <circle cx="28" cy="28" r={radius} fill="none" stroke="#1e293b" strokeWidth="6" />
      <circle
        cx="28" cy="28" r={radius}
        fill="none" stroke="#22c55e" strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}
