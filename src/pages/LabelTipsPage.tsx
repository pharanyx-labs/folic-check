import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'

const PHRASES = [
  { phrase: '"Fortified wheat flour"', meaning: 'The standard UK label wording — this flour is required to contain added folic acid (plus the pre-existing calcium, iron, niacin and thiamin).' },
  { phrase: '"Wheat flour" (unqualified)', meaning: 'Almost always non-wholemeal — treat the same as fortified wheat flour once compliance is in force.' },
  { phrase: '"Wholemeal wheat flour" / "100% wholemeal"', meaning: 'Exempt from the mandatory fortification rule — this is the phrase to look for if you want to avoid added folic acid.' },
  { phrase: '"Stoneground wholemeal"', meaning: 'Still wholemeal, still exempt — the milling method doesn’t change the exemption.' },
  { phrase: 'Rice / corn / gluten-free / buckwheat / gram flour', meaning: 'Not wheat flour at all, so entirely outside the scope of this rule regardless of processing.' },
  { phrase: '"Semolina" / "durum wheat"', meaning: 'Wheat-derived — treat with the same caution as non-wholemeal wheat flour unless labelled wholemeal.' },
]

const SHOPPING_TIPS = [
  'Check the ingredients list, not the front-of-pack marketing — "artisan," "stoneground," or "traditional" are not the same as "wholemeal."',
  'Own-brand and budget ranges often switch formulations at different times than premium ranges during the transition — check each product individually rather than assuming a whole range is consistent.',
  'Imported products (e.g. from outside the UK) are not covered by this UK-specific rule, so labelling conventions and folic acid content may differ.',
  'Organic non-wholemeal flour is NOT exempt from the mandate — "organic" alone does not tell you whether a product contains added folic acid.',
  'Small mills producing under the regulatory threshold may be exempt — if in doubt, contact the miller or manufacturer directly.',
  'During the rollout (Autumn 2025 → 13 Dec 2026), the same product may or may not yet be reformulated — a "likely fortified" verdict here reflects the direction of travel, not a guarantee for every batch.',
]

export function LabelTipsPage() {
  return (
    <Container className="py-10">
      <Eyebrow>Practical guide</Eyebrow>
      <h1 className="font-display text-2xl font-semibold text-ink">Label & shopping tips</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        UK ingredients lists use fairly consistent, regulated wording. Learning to recognise a handful of phrases
        is the fastest way to check a product yourself, with or without this site.
      </p>

      <div className="mt-8 space-y-3">
        {PHRASES.map((item) => (
          <Card key={item.phrase} className="sm:flex sm:items-start sm:gap-4">
            <p className="font-mono text-sm font-medium text-ink sm:w-72 sm:shrink-0">{item.phrase}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted sm:mt-0">{item.meaning}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-12 font-display text-lg font-semibold text-ink">Shopping strategy during the transition</h2>
      <ul className="mt-4 space-y-3">
        {SHOPPING_TIPS.map((tip) => (
          <li key={tip} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
            {tip}
          </li>
        ))}
      </ul>
    </Container>
  )
}
