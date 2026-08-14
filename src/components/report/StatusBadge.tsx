import type { ClassificationStatus } from '../../domain/classifier/types'
import { STATUS_META } from './statusMeta'

export function StatusBadge({ status, className = '' }: { status: ClassificationStatus; className?: string }) {
  const meta = STATUS_META[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badgeClass} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} aria-hidden="true" />
      {meta.label}
    </span>
  )
}
