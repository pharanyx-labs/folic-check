import type { ClassificationStatus, Confidence } from '../../domain/classifier/types'
import { STATUS_META } from './statusMeta'

// A 20-point scalloped seal outline (food-inspection / mill quality-mark motif) —
// the app's signature visual. Computed once as a fixed polygon, not decorative noise.
const SEAL_CLIP_PATH =
  'polygon(50.00% 0.00%, 62.98% 10.06%, 79.39% 9.55%, 83.98% 25.31%, 97.55% 34.55%, 92.00% 50.00%, 97.55% 65.45%, 83.98% 74.69%, 79.39% 90.45%, 62.98% 89.94%, 50.00% 100.00%, 37.02% 89.94%, 20.61% 90.45%, 16.02% 74.69%, 2.45% 65.45%, 8.00% 50.00%, 2.45% 34.55%, 16.02% 25.31%, 20.61% 9.55%, 37.02% 10.06%)'

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
      <div className="relative h-36 w-36 shrink-0 -rotate-3 sm:h-40 sm:w-40">
        <div className={`absolute inset-0 border-[3px] ${meta.borderClass}`} style={{ clipPath: SEAL_CLIP_PATH }} />
        <div className={`absolute inset-[9%] border ${meta.borderClass} opacity-50`} style={{ clipPath: SEAL_CLIP_PATH }} />
        <div className="absolute inset-0 flex rotate-3 items-center justify-center p-7 text-center">
          <span className={`font-display text-[0.8rem] font-bold uppercase leading-tight tracking-wide sm:text-sm ${meta.textClass}`}>
            {meta.shortLabel}
          </span>
        </div>
      </div>
      <p className={`font-mono text-xs uppercase tracking-[0.1em] ${meta.textClass}`}>{CONFIDENCE_LABEL[confidence]}</p>
    </div>
  )
}
