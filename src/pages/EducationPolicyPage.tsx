import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { policyTimeline } from '../content/newsData'

export function EducationPolicyPage() {
  return (
    <Container className="py-10">
      <Eyebrow>Policy & science</Eyebrow>
      <h1 className="font-display text-2xl font-semibold text-ink">The fortification policy, in context</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        This page aims to lay out the timeline, the stated benefits, and the documented concerns side by side, so
        you can weigh the evidence yourself rather than take a single framing on trust.
      </p>

      <h2 className="mt-10 font-display text-lg font-semibold text-ink">Timeline</h2>
      <ol className="mt-4 space-y-0">
        {policyTimeline.map((event, i) => (
          <li key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
            <div className="flex flex-col items-center">
              <span className="flex h-3 w-3 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              {i < policyTimeline.length - 1 && <span className="mt-1 w-px flex-1 bg-line" aria-hidden="true" />}
            </div>
            <div className="-mt-1">
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-muted">{event.date}</p>
              <p className="mt-0.5 font-medium text-ink">{event.label}</p>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-muted">{event.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="font-display text-base font-semibold text-status-safe">Stated benefits</p>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-muted">
            <li>
              Folic acid taken before and during early pregnancy is well established to reduce the risk of
              neural tube defects (NTDs) such as spina bifida and anencephaly.
            </li>
            <li>
              Government modelling estimates mandatory fortification could prevent roughly 200 NTD-affected
              pregnancies per year in the UK, primarily benefiting pregnancies that were unplanned or where a
              supplement wasn&apos;t taken early enough — supplementation relies on awareness before conception,
              which fortification doesn&apos;t require.
            </li>
            <li>Over 60 countries already mandate folic acid fortification, several with multi-decade safety and outcomes data.</li>
          </ul>
        </Card>
        <Card>
          <p className="font-display text-base font-semibold text-status-contains">Documented concerns</p>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-muted">
            <li>
              High folic acid intake can mask the blood-test signs of vitamin B12 deficiency, which is more
              common in older adults — delayed diagnosis of B12 deficiency can allow neurological symptoms to
              progress.
            </li>
            <li>
              Some research has examined a possible link between high circulating unmetabolised folic acid and
              other health outcomes; the evidence here is described by SACN as inconclusive rather than settled.
            </li>
            <li>
              Removing an individual&apos;s ability to opt out of a fortified staple food is, for some, a concern in
              principle regardless of the specific health evidence.
            </li>
            <li>UK guidance advises people over 50, and those with a history of colorectal adenomas, to be mindful of total intake from fortified sources.</li>
          </ul>
        </Card>
      </div>

      <h2 className="mt-12 font-display text-lg font-semibold text-ink">Folic acid vs. natural folate</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
        &ldquo;Folate&rdquo; is the general term for vitamin B9, found naturally in leafy greens, legumes, and citrus fruit.
        &ldquo;Folic acid&rdquo; is the synthetic, more chemically stable form used in fortification and supplements, which
        the body must convert (via dihydrofolate reductase) into an active form. Natural food folate has never
        been linked to the same masking or upper-intake concerns, precisely because it is absorbed and processed
        differently and in smaller, more variable amounts.
      </p>

      <p className="mt-12 rounded-md border border-line bg-paper p-4 text-xs leading-relaxed text-ink-muted">
        This page summarizes publicly available guidance for general information only — it is not medical advice.
        For current, authoritative detail, see GOV.UK, the Food Standards Agency, and SACN&apos;s published reports.
      </p>
    </Container>
  )
}
