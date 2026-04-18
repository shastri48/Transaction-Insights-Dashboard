import { BASE_URL, PAGE_SIZE } from '@/constants';

export async function fetchTransactions({ page, search, limit = PAGE_SIZE }) {
  const params = new URLSearchParams({ page, limit });
  if (search?.trim()) params.set('search', search.trim());

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

  return res.json();
}
