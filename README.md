# Transaction Insights Dashboard

A frontend dashboard for monitoring and analyzing financial transactions — built with **Next.js 15 (App Router)**, **JavaScript**, and **TanStack Query**.

> Live demo link — add after deployment

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+

### Install & run

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd transaction-insight-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other scripts

```bash
npm run build   # Production build
npm start       # Serve the production build locally
npm run lint    # Run ESLint
```

No environment variables are required. The app fetches directly from the public MockAPI endpoint.

---

## Features

| Feature | Detail |
|---|---|
| Infinite scrolling | `IntersectionObserver` sentinel triggers 300px before the bottom |
| Debounced search | 400ms debounce — server-side via `?search=` param |
| Client-side filters | Status, category, date range — applied in-memory, zero extra requests |
| Aggregated insights | Total transactions, successful amount, success rate, top category |
| Skeleton loading | CSS shimmer on initial page load |
| Loading states | Bottom spinner while fetching next page, "all loaded" indicator at end |
| Error & empty states | Retry button on API failure, contextual empty messages |

---

## Architecture

### Folder structure

```
src/
├── app/
│   ├── layout.jsx              # Root layout — mounts QueryProvider and fonts
│   ├── page.jsx                # Dashboard page — orchestrator only, no business logic
│   └── globals.css             # Tailwind base + shimmer skeleton utility
│
├── constants/
│   └── index.js                # PAGE_SIZE, STATUS_OPTIONS, CATEGORY_COLORS — single source of truth
│
├── lib/
│   ├── api.js                  # Fetch function — builds URL params, throws on error
│   └── formatters.js           # Pure functions: formatAmount, formatDate, formatLargeAmount, formatPercent
│
├── hooks/
│   ├── useDebounce.js          # Generic debounce — delays value propagation by N ms
│   ├── useFilters.js           # All filter state in one place — returns filters, updateFilter, clearAll
│   ├── useTransactions.js      # useInfiniteQuery wrapper — pagination + search
│   └── useAggregations.js      # useFilteredTransactions + useAggregations — both are pure useMemo hooks
│
├── providers/
│   └── QueryProvider.jsx       # QueryClient setup — staleTime, refetchOnWindowFocus off
│
└── components/
    ├── ui/                     # Atomic, shared across features
    │   ├── StatusBadge.jsx
    │   ├── CategoryBadge.jsx
    │   └── Spinner.jsx
    │
    ├── insights/
    │   ├── DonutChart.jsx      # SVG donut — renders success rate circle
    │   ├── InsightCard.jsx     # Single metric card layout
    │   └── InsightsSummary.jsx # Builds cards array, maps to InsightCard
    │
    ├── filters/
    │   ├── SearchInput.jsx     # Controlled text input with clear button
    │   ├── MultiSelect.jsx     # Click-outside dropdown with checkboxes
    │   ├── DateRangePicker.jsx # Two date inputs
    │   ├── FilterChips.jsx     # Active filter pills + result count
    │   └── FilterBar.jsx       # Composes all filter components
    │
    └── transactions/
        ├── TransactionSkeleton.jsx
        ├── TransactionCard.jsx     # Avatar, name, amount, badges
        └── TransactionList.jsx     # Infinite scroll logic, error/empty states
```

### Data flow

```
page.jsx
  │
  ├── useFilters()               → filters, updateFilter, clearAll
  ├── useDebounce(filters.search)→ debouncedSearch (sent to API)
  ├── useTransactions(search)    → pages of raw transactions from API
  │     └── data.pages.flat()   → allTransactions[]
  ├── useFilteredTransactions()  → filteredTransactions[] (client-side)
  └── useAggregations()          → { total, totalSuccessAmount, successRate, topCategory }
```

`page.jsx` passes derived data down to `InsightsSummary`, `FilterBar`, and `TransactionList` as props. No global state — everything is co-located in the page orchestrator.

---

## Design Decisions

### 1. Server-side search, client-side filters

**Search** is included in the TanStack Query `queryKey` as `['transactions', search]`. When the search term changes, the key changes — TanStack Query automatically discards cached pages and restarts from page 1. No manual reset logic required.

**Status, category, and date range** filters are applied client-side inside `useFilteredTransactions`. They don't trigger API calls, which means:
- Toggling a filter is instant — no spinner, no refetch
- All aggregations update immediately as the filtered view changes

### 2. Hook-per-concern

Each hook has a single job:

| Hook | Responsibility |
|---|---|
| `useDebounce` | Delay value propagation |
| `useFilters` | Own and expose filter state |
| `useTransactions` | Configure and call `useInfiniteQuery` |
| `useFilteredTransactions` | Filter the flat transaction list |
| `useAggregations` | Derive summary metrics from filtered data |

`page.jsx` composes them — it contains no business logic of its own.

### 3. Aggregations via `useMemo`

`useAggregations` runs a single pass over `filteredTransactions`:
- Counts total and successful entries
- Accumulates per-category totals with `reduce`
- Sorts once to find the top category

Because it's wrapped in `useMemo`, it only recomputes when the `filteredTransactions` array reference changes — not on every render.

### 4. Infinite scroll with `IntersectionObserver`

A sentinel `<div>` is placed at the bottom of the transaction list. An `IntersectionObserver` watches it with `rootMargin: '0px 0px 300px 0px'`, which fires the callback 300px before the sentinel enters the viewport. This gives the API enough time to respond before the user reaches the end — the scroll feels seamless.

### 5. Constants as a single source of truth

`src/constants/index.js` owns `PAGE_SIZE`, `STATUS_OPTIONS`, and `CATEGORY_COLORS`. Nothing is hardcoded across multiple files — changing the page size or adding a new category style is a one-line edit.

---

## Trade-offs Considered

### Client-side vs server-side filtering

**Chosen:** client-side for status, category, and date range.

**Why:** MockAPI doesn't support multi-value or range query params. Filtering client-side gives instant feedback with no extra network requests.

**Accepted cost:** When a strict filter is active, the visible list may be short even though more unfiltered pages exist. The `IntersectionObserver` mitigates this — because the sentinel stays visible when few rows match, it keeps triggering `fetchNextPage` automatically until enough matching results are loaded or all pages are exhausted.

---

### No TypeScript

**Chosen:** Plain JavaScript with JSDoc-style prop awareness via `jsconfig.json` path aliases.

**Why:** The assignment spec listed JavaScript as acceptable and the focus is on architecture, not type ceremony. All interfaces are implicitly documented by the shape of API responses and the constants file.

**Accepted cost:** No compile-time type safety. Mitigated by keeping each function small and single-purpose.

---

### `status` modeled as boolean

**Chosen:** Keep the raw API shape (`status: true/false`) and map it at the display layer.

**Why:** Avoids a transformation pass over every fetched page. `StatusBadge` and `useFilteredTransactions` both handle `true → success` / `false → failed` inline.

**Accepted cost:** `pending` state is not representable with this model. If the API ever adds a third status value, both the filter and the badge would need updating.

---

### `unoptimized` on `next/image` for avatars

**Chosen:** Pass `unoptimized` to bypass Next.js image optimization for avatar URLs.

**Why:** Avatar URLs come from external CDNs (`cdn.jsdelivr.net`, etc.) and the full domain list isn't known at build time. Attempting to optimize them through Next.js would require an exhaustive `remotePatterns` list and would still fail for any unlisted CDN.

**Accepted cost:** Avatar images are not resized or cached by Next.js. For a real product, avatars would be proxied through a known CDN or stored internally.

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| Next.js | 15 | App Router, file-based routing, `next/font`, `next/image` |
| React | 19 | UI rendering |
| TanStack Query | v5 | `useInfiniteQuery`, caching, retry, stale-while-revalidate |
| Tailwind CSS | 3 | Utility-first styling, dark theme |
| lucide-react | latest | Icon set |
| clsx | 2 | Conditional className joining |
