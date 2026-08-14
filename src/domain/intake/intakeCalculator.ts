import type { ClassificationResult } from '../classifier/types'

/** UK mandatory fortification level: 250 µg of folic acid per 100 g of non-wholemeal wheat flour. */
export const FORTIFICATION_UG_PER_100G_FLOUR = 250

/**
 * Typical proportion of a finished product's weight that is flour, used to translate a
 * serving of a *product* (e.g. bread, pasta) into an estimated flour-equivalent weight.
 * These are broad, published-recipe-derived approximations, not per-product lab data —
 * always hedged in the UI as an estimate.
 */
export const TYPICAL_FLOUR_SHARE: Record<string, number> = {
  bread: 0.55,
  pasta: 0.75,
  pizza_base: 0.5,
  cake: 0.35,
  biscuits: 0.4,
  pastry: 0.55,
  cereal: 0.7,
  flour: 1,
}

export interface IntakeEstimateInput {
  classification: ClassificationResult
  productWeightGrams: number
  flourShare?: number
}

export interface IntakeEstimate {
  estimatedFolicAcidUg: number | null
  basis: 'certain' | 'estimated' | 'not_applicable'
  explanation: string
}

/**
 * Estimates µg of added folic acid in a serving. Only produces a number when the
 * classification indicates folic acid is actually present — a "safe" or "unknown"
 * product always yields `estimatedFolicAcidUg: null`, never a fabricated estimate.
 */
export function estimateIntake(input: IntakeEstimateInput): IntakeEstimate {
  const { classification, productWeightGrams, flourShare = TYPICAL_FLOUR_SHARE.flour } = input

  if (classification.status === 'safe' || classification.status === 'unknown' || classification.status === 'incomplete_data') {
    return {
      estimatedFolicAcidUg: null,
      basis: 'not_applicable',
      explanation:
        classification.status === 'safe'
          ? 'This product is not classified as containing added folic acid, so no intake is estimated.'
          : 'Folic acid status is unconfirmed, so no intake estimate can be given.',
    }
  }

  const flourGrams = productWeightGrams * flourShare
  const estimatedUg = (flourGrams / 100) * FORTIFICATION_UG_PER_100G_FLOUR

  return {
    estimatedFolicAcidUg: Math.round(estimatedUg),
    basis: classification.status === 'contains_folic_acid' ? 'estimated' : 'estimated',
    explanation:
      'Estimated from the standard UK fortification level (250 µg per 100 g of non-wholemeal wheat flour) and a typical flour share for this product type — not a lab measurement of this specific product.',
  }
}
