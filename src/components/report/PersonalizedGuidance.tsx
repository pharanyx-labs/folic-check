import { Link } from 'react-router-dom'
import type { ClassificationResult } from '../../domain/classifier/types'
import { computeGuidance, type RelevanceLevel } from '../../domain/profile/riskProfile'
import { useProfile } from '../../state/ProfileContext'

const RELEVANCE_CLASS: Record<RelevanceLevel, string> = {
  none: '',
  info: 'border-brand/40 bg-brand/5',
  caution: 'border-status-likely bg-status-likely-bg',
  watch_closely: 'border-status-contains bg-status-contains-bg',
}

export function PersonalizedGuidance({ classification }: { classification: ClassificationResult }) {
  const { activeProfile } = useProfile()
  const guidance = computeGuidance(activeProfile, classification)

  if (guidance.relevanceLevel === 'none') {
    return (
      <p className="text-sm text-ink-muted">
        <Link to="/profile" className="font-medium text-brand hover:underline">
          Set your risk profile
        </Link>{' '}
        to get personalized guidance on this product.
      </p>
    )
  }

  return (
    <div className={`rounded-md border p-4 ${RELEVANCE_CLASS[guidance.relevanceLevel]}`}>
      <p className="text-sm font-semibold text-ink">For {activeProfile.name}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink">{guidance.message}</p>
      {guidance.dailyLimitUg !== null && (
        <p className="mt-2 font-mono text-xs text-ink-muted">Reference ceiling for your profile: ~{guidance.dailyLimitUg} µg/day</p>
      )}
    </div>
  )
}
