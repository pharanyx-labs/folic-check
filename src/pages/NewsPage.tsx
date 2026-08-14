import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { newsData } from '../content/newsData'

export function NewsPage() {
  return (
    <Container className="py-10">
      <Eyebrow>Staying current</Eyebrow>
      <h1 className="font-display text-2xl font-semibold text-ink">News & policy tracker</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Key milestones and public discussion around the fortification rollout. This list is curated periodically,
        not live — always check the linked source for the current, authoritative detail.
      </p>

      <div className="mt-8 space-y-3">
        {newsData.map((item) => (
          <Card key={item.id}>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-muted">{item.date}</p>
            <a href={item.href} target="_blank" rel="noreferrer" className="mt-1 block font-display text-base font-semibold text-ink hover:text-brand">
              {item.title} ↗
            </a>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.summary}</p>
          </Card>
        ))}
      </div>
    </Container>
  )
}
