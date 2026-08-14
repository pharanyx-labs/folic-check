import type { ClassificationStatus } from '../../domain/classifier/types'

export interface StatusMeta {
  label: string
  shortLabel: string
  description: string
  badgeClass: string
  dotClass: string
  stampClass: string
  borderClass: string
  textClass: string
}

// Tailwind's content scanner needs full literal class strings to appear verbatim in
// source — these are intentionally written out per-status rather than built with
// template-literal interpolation, which the scanner cannot see through.
export const STATUS_META: Record<ClassificationStatus, StatusMeta> = {
  safe: {
    label: 'Safe',
    shortLabel: 'SAFE',
    description: 'Not expected to contain added folic acid.',
    badgeClass: 'bg-status-safe-bg text-status-safe',
    dotClass: 'bg-status-safe',
    stampClass: 'border-status-safe text-status-safe',
    borderClass: 'border-status-safe',
    textClass: 'text-status-safe',
  },
  contains_folic_acid: {
    label: 'Contains folic acid',
    shortLabel: 'CONTAINS FOLIC ACID',
    description: 'Ingredients confirm this product has added folic acid.',
    badgeClass: 'bg-status-contains-bg text-status-contains',
    dotClass: 'bg-status-contains',
    stampClass: 'border-status-contains text-status-contains',
    borderClass: 'border-status-contains',
    textClass: 'text-status-contains',
  },
  likely_fortified: {
    label: 'Likely fortified',
    shortLabel: 'LIKELY FORTIFIED',
    description: 'Non-wholemeal wheat flour present — likely to contain added folic acid under the new UK rules.',
    badgeClass: 'bg-status-likely-bg text-status-likely',
    dotClass: 'bg-status-likely',
    stampClass: 'border-status-likely text-status-likely',
    borderClass: 'border-status-likely',
    textClass: 'text-status-likely',
  },
  unknown: {
    label: 'Unknown',
    shortLabel: 'UNKNOWN',
    description: 'Could not determine folic acid status from the available data.',
    badgeClass: 'bg-status-unknown-bg text-status-unknown',
    dotClass: 'bg-status-unknown',
    stampClass: 'border-status-unknown text-status-unknown',
    borderClass: 'border-status-unknown',
    textClass: 'text-status-unknown',
  },
  incomplete_data: {
    label: 'Incomplete data',
    shortLabel: 'NO DATA YET',
    description: 'Not enough ingredient data on file to assess this product.',
    badgeClass: 'bg-status-unknown-bg text-status-unknown',
    dotClass: 'bg-status-unknown',
    stampClass: 'border-status-unknown text-status-unknown',
    borderClass: 'border-status-unknown',
    textClass: 'text-status-unknown',
  },
}
