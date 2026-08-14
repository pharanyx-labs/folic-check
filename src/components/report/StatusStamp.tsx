import type { ClassificationStatus, Confidence } from '../../domain/classifier/types'
import { STATUS_META } from './statusMeta'

// A 20-point scalloped seal outline (food-inspection / mill quality-mark motif) —
// the app's signature visual. Two concentric rings, computed once as fixed SVG
// polygon points (not decorative noise), drawn with actual stroked <polygon>s rather
// than CSS border+clip-path — the latter only renders where a clipped shape happens
// to coincide with the box's straight edges, which a scalloped/star outline mostly
// doesn't, so it silently fails to render as a ring.
const OUTER_RING_POINTS =
  '50.00,4.00 61.74,13.86 77.04,12.79 80.74,27.66 93.75,35.79 88.00,50.00 93.75,64.21 80.74,72.34 77.04,87.21 61.74,86.14 50.00,96.00 38.26,86.14 22.96,87.21 19.26,72.34 6.25,64.21 12.00,50.00 6.25,35.79 19.26,27.66 22.96,12.79 38.26,13.86'
const INNER_RING_POINTS =
  '50.00,11.00 59.89,19.57 72.92,18.45 75.89,31.19 87.09,37.95 82.00,50.00 87.09,62.05 75.89,68.81 72.92,81.55 59.89,80.43 50.00,89.00 40.11,80.43 27.08,81.55 24.11,68.81 12.91,62.05 18.00,50.00 12.91,37.95 24.11,31.19 27.08,18.45 40.11,19.57'

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  certain: 'Confirmed from ingredients',
  high: 'High confidence',
  moderate: 'Moderate confidence',
  low: 'Low confidence',
}

interface StatusStampProps {
  status: ClassificationStatus
  confidence: Confidence
}

/** The report's hero moment: every product gets literally "stamped" with its verdict. */
export function StatusStamp({ status, confidence }: StatusStampProps) {
  const meta = STATUS_META[status]

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative h-36 w-36 shrink-0 -rotate-3 sm:h-40 sm:w-40 ${meta.textClass}`}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <polygon points={OUTER_RING_POINTS} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points={INNER_RING_POINTS} fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" opacity="0.6" />
        </svg>
        <div className="absolute inset-0 flex rotate-3 items-center justify-center p-7 text-center">
          <span className="font-display text-[0.8rem] font-bold uppercase leading-tight tracking-wide sm:text-sm">
            {meta.shortLabel}
          </span>
        </div>
      </div>
      <p className={`font-mono text-xs uppercase tracking-[0.1em] ${meta.textClass}`}>{CONFIDENCE_LABEL[confidence]}</p>
    </div>
  )
}
