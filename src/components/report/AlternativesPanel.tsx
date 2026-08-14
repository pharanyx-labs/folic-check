import { findAlternatives } from '../../domain/safeFoods/findAlternatives'

export function AlternativesPanel({ productName }: { productName: string | null }) {
  const alternatives = findAlternatives(productName)
  if (alternatives.length === 0) return null

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-muted">Consider instead</p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {alternatives.map((entry) => (
          <li key={entry.id} className="rounded-md border border-line bg-paper p-3">
            <p className="text-sm font-medium text-ink">{entry.name}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{entry.note}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
