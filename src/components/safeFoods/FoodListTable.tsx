import { CATEGORY_LABELS, type SafeFoodEntry, type SafeFoodStatus } from '../../domain/safeFoods/safeFoodsData'

const STATUS_STYLE: Record<SafeFoodStatus, { label: string; badgeClass: string; dotClass: string }> = {
  safe: { label: 'Safe', badgeClass: 'bg-status-safe-bg text-status-safe', dotClass: 'bg-status-safe' },
  risky: { label: 'Likely fortified', badgeClass: 'bg-status-contains-bg text-status-contains', dotClass: 'bg-status-contains' },
  check_label: { label: 'Check the label', badgeClass: 'bg-status-likely-bg text-status-likely', dotClass: 'bg-status-likely' },
}

export function FoodListTable({ entries }: { entries: SafeFoodEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-line px-4 py-6 text-center text-sm text-ink-muted">
        No foods match your filters.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
      {entries.map((entry) => {
        const style = STATUS_STYLE[entry.status]
        return (
          <li key={entry.id} className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-ink">{entry.name}</p>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${style.badgeClass}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dotClass}`} aria-hidden="true" />
                  {style.label}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-ink-muted">{entry.note}</p>
              <p className="mt-0.5 font-mono text-xs uppercase tracking-wide text-ink-muted/80">
                {CATEGORY_LABELS[entry.category]}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
