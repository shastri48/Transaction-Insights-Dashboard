import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '@/constants';

export default function CategoryBadge({ category }) {
  const style = CATEGORY_COLORS[category] ?? DEFAULT_CATEGORY_COLOR;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${style}`}>
      {category}
    </span>
  );
}
