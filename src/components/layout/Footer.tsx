import { Link } from 'react-router-dom'

const EXTERNAL_LINKS = [
  { href: 'https://www.gov.uk', label: 'GOV.UK' },
  { href: 'https://www.food.gov.uk', label: 'Food Standards Agency' },
  { href: 'https://www.realbreadcampaign.org', label: 'Real Bread Campaign' },
  { href: 'https://petition.parliament.uk', label: 'UK Parliament petitions' },
  { href: 'https://world.openfoodfacts.org', label: 'Open Food Facts' },
]

export function Footer() {
  return (
    <footer className="no-print border-t border-line bg-paper">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-ink">FolicCheck</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              An independent, evidence-based tool for checking UK products against the mandatory folic acid
              fortification rules. Not affiliated with GOV.UK, the FSA, or Open Food Facts.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">Explore</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li><Link className="text-ink-muted hover:text-brand" to="/tips">Label & shopping tips</Link></li>
              <li><Link className="text-ink-muted hover:text-brand" to="/about">Policy & science</Link></li>
              <li><Link className="text-ink-muted hover:text-brand" to="/news">News & policy tracker</Link></li>
              <li><Link className="text-ink-muted hover:text-brand" to="/foods">Safe foods browser</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">Sources</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {EXTERNAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a className="text-ink-muted hover:text-brand" href={link.href} target="_blank" rel="noreferrer">
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-line pt-6 text-xs leading-relaxed text-ink-muted">
          Product data from Open Food Facts (Open Database License) and may be incomplete or lag real-world label
          changes during the fortification rollout. This site provides general information only, not medical
          advice — always check the physical product label before making a decision.
        </p>
      </div>
    </footer>
  )
}
