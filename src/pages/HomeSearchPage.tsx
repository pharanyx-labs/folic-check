import { Link } from 'react-router-dom'
import { SearchBar } from '../components/search/SearchBar'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { StatusBadge } from '../components/report/StatusBadge'
import type { ClassificationStatus } from '../domain/classifier/types'

const STATUS_KEY: ClassificationStatus[] = ['safe', 'likely_fortified', 'contains_folic_acid', 'unknown', 'incomplete_data']

const QUICK_LINKS = [
  { to: '/foods', title: 'Browse safe foods', description: 'A searchable list of naturally safe and likely-fortified foods, by category.' },
  { to: '/tips', title: 'Label & shopping tips', description: 'The exact phrases to look for on ingredients lists, and transition-period caveats.' },
  { to: '/about', title: 'Policy & science', description: 'The fortification timeline, the stated benefits, and the documented concerns.' },
]

export function HomeSearchPage() {
  return (
    <div className="py-10 sm:py-16">
      <Container>
        <Eyebrow>UK folic acid fortification checker</Eyebrow>
        <h1 className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          Check whether a product likely contains added folic acid.
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted">
          Search by product name, or scan a barcode in-store. We read the real ingredients list from Open Food
          Facts and show you exactly what drove the verdict — evidence, not just a colour.
        </p>

        <div className="mt-8 max-w-2xl">
          <SearchBar autoFocus />
        </div>

        <div className="mt-8 flex max-w-2xl flex-wrap gap-2">
          {STATUS_KEY.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              <Card className="h-full transition-colors hover:border-brand">
                <p className="font-display text-base font-semibold text-ink">{link.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{link.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  )
}
