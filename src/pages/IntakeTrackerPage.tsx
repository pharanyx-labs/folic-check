import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { cumulativeIntake, entriesForDay } from '../domain/intake/intakeLog'
import { dailyLimitUg } from '../domain/profile/riskProfile'
import { useIntakeLog } from '../state/IntakeLogContext'
import { useProfile } from '../state/ProfileContext'

export function IntakeTrackerPage() {
  const { entries, removeEntry, clearAll } = useIntakeLog()
  const { activeProfile } = useProfile()
  const today = entriesForDay(entries)
  const totals = cumulativeIntake(today)
  const limit = dailyLimitUg(activeProfile)

  return (
    <Container className="py-10">
      <Eyebrow>Daily tracker</Eyebrow>
      <h1 className="font-display text-2xl font-semibold text-ink">Your folic acid intake today</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Log products from a report page to see an estimated running total. Estimates use the standard UK
        fortification level, not a lab measurement of the specific product.
      </p>

      <Card className="mt-6">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-muted">Estimated today</p>
        <p className="mt-1 font-display text-3xl font-semibold text-ink">
          ~{totals.knownTotalUg} µg
          {totals.hasUnknownEntries && (
            <span className="ml-2 text-sm font-normal text-ink-muted">+ some unknown-amount entries</span>
          )}
        </p>
        {limit !== null ? (
          <p className="mt-1 text-sm text-ink-muted">Your profile&apos;s reference ceiling is ~{limit} µg/day.</p>
        ) : (
          <p className="mt-1 text-sm text-ink-muted">
            Set your{' '}
            <Link to="/profile" className="text-brand hover:underline">
              risk profile
            </Link>{' '}
            to see this against a personal reference ceiling.
          </p>
        )}
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-muted">Today&apos;s log ({today.length})</p>
        {entries.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear all history
          </Button>
        )}
      </div>

      {today.length === 0 ? (
        <p className="mt-3 rounded-md border border-dashed border-line px-4 py-6 text-center text-sm text-ink-muted">
          Nothing logged today. Look up a product and use &ldquo;Add to tracker&rdquo; on its report.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-surface">
          {today.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{entry.productName}</p>
                <p className="text-xs text-ink-muted">
                  {entry.productWeightGrams} g
                  {entry.estimatedFolicAcidUg !== null ? ` · ~${entry.estimatedFolicAcidUg} µg` : ' · amount unknown'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                className="text-sm text-ink-muted hover:text-status-contains"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </Container>
  )
}
