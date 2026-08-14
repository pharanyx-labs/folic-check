import type { ClassificationStatus } from '../classifier/types'

export interface IntakeLogEntry {
  id: string
  timestampMs: number
  productName: string
  barcode: string | null
  classificationStatus: ClassificationStatus
  estimatedFolicAcidUg: number | null
  productWeightGrams: number
}

export function createLogEntry(entry: Omit<IntakeLogEntry, 'id' | 'timestampMs'>): IntakeLogEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestampMs: Date.now(),
    ...entry,
  }
}

function isSameDay(a: number, b: number): boolean {
  const dateA = new Date(a)
  const dateB = new Date(b)
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  )
}

export function entriesForDay(entries: IntakeLogEntry[], dayTimestampMs: number = Date.now()): IntakeLogEntry[] {
  return entries.filter((entry) => isSameDay(entry.timestampMs, dayTimestampMs))
}

/**
 * Sums only entries with a known estimate. Returns `knownTotalUg: 0` (not null) when
 * there are no estimable entries, but always reports `hasUnknownEntries` separately so
 * the UI can show "at least X µg, plus N products of unknown amount" rather than
 * implying the total is complete.
 */
export function cumulativeIntake(entries: IntakeLogEntry[]): {
  knownTotalUg: number
  hasUnknownEntries: boolean
  entryCount: number
} {
  let knownTotalUg = 0
  let hasUnknownEntries = false
  for (const entry of entries) {
    if (entry.estimatedFolicAcidUg === null) {
      hasUnknownEntries = true
    } else {
      knownTotalUg += entry.estimatedFolicAcidUg
    }
  }
  return { knownTotalUg, hasUnknownEntries, entryCount: entries.length }
}
