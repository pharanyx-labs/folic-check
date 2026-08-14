import { CATEGORY_LABELS, type SafeFoodCategory, type SafeFoodStatus } from '../../domain/safeFoods/safeFoodsData'

export interface FoodListFiltersValue {
  query: string
  category: SafeFoodCategory | 'all'
  status: SafeFoodStatus | 'all'
}

const STATUS_OPTIONS: { value: SafeFoodStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'safe', label: 'Safe' },
  { value: 'risky', label: 'Likely fortified' },
  { value: 'check_label', label: 'Check the label' },
]

export function FoodListFilters({
  value,
  onChange,
}: {
  value: FoodListFiltersValue
  onChange: (next: FoodListFiltersValue) => void
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="foods-search">
        Search foods
      </label>
      <input
        id="foods-search"
        type="text"
        placeholder="Search the list…"
        value={value.query}
        onChange={(e) => onChange({ ...value, query: e.target.value })}
        className="w-full rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand sm:max-w-xs"
      />
      <select
        aria-label="Filter by category"
        value={value.category}
        onChange={(e) => onChange({ ...value, category: e.target.value as FoodListFiltersValue['category'] })}
        className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-ink"
      >
        <option value="all">All categories</option>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <select
        aria-label="Filter by status"
        value={value.status}
        onChange={(e) => onChange({ ...value, status: e.target.value as FoodListFiltersValue['status'] })}
        className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-ink"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
