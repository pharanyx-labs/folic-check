import type { ClassificationResult, EvidenceField } from '../../domain/classifier/types'

const FIELD_LABEL: Record<EvidenceField, string> = {
  ingredients_text: 'Ingredients',
  ingredients_tags: 'Ingredient tag',
  categories_tags: 'Category',
  additives_tags: 'Additive',
  countries_tags: 'Country',
}

export function EvidencePanel({ classification }: { classification: ClassificationResult }) {
  return (
    <div className="rounded-md border border-line bg-paper p-4">
      <p className="text-sm leading-relaxed text-ink">{classification.explanation}</p>
      {classification.evidence.length > 0 && (
        <div className="mt-3 space-y-1.5 border-t border-line pt-3">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-muted">Why we think this</p>
          <ul className="space-y-1">
            {classification.evidence.map((evidence, i) => (
              <li key={`${evidence.ruleId}-${i}`} className="flex flex-wrap items-baseline gap-2 text-sm">
                <span className="rounded bg-line/50 px-1.5 py-0.5 font-mono text-xs text-ink-muted">
                  {FIELD_LABEL[evidence.field]}
                </span>
                <span className="font-mono text-ink">&ldquo;{evidence.matchedText}&rdquo;</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
