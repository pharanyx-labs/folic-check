import type { ClassificationResult, ClassificationStatus, Confidence } from '../classifier/types'

export interface RecipeIngredientResult {
  ingredientName: string
  classification: ClassificationResult
}

export interface RecipeRiskResult {
  status: ClassificationStatus
  confidence: Confidence
  flaggedIngredients: RecipeIngredientResult[]
  explanation: string
}

const CONFIDENCE_RANK: Record<Confidence, number> = { low: 0, moderate: 1, high: 2, certain: 3 }

function strongestConfidence(results: RecipeIngredientResult[]): Confidence {
  return results.reduce<Confidence>(
    (best, r) => (CONFIDENCE_RANK[r.classification.confidence] > CONFIDENCE_RANK[best] ? r.classification.confidence : best),
    'low',
  )
}

function weakestConfidence(results: RecipeIngredientResult[]): Confidence {
  return results.reduce<Confidence>(
    (worst, r) => (CONFIDENCE_RANK[r.classification.confidence] < CONFIDENCE_RANK[worst] ? r.classification.confidence : worst),
    'certain',
  )
}

/**
 * Aggregates per-ingredient classifications into one recipe-level verdict. Priority:
 * any confirmed folic acid beats any likely-fortified, which beats any unconfirmed
 * ingredient, which beats an all-safe verdict — a recipe is only as safe as its
 * least-certain ingredient.
 */
export function aggregateRecipeRisk(ingredients: RecipeIngredientResult[]): RecipeRiskResult {
  if (ingredients.length === 0) {
    return {
      status: 'incomplete_data',
      confidence: 'low',
      flaggedIngredients: [],
      explanation: 'No ingredients added yet.',
    }
  }

  const containsFolicAcid = ingredients.filter((i) => i.classification.status === 'contains_folic_acid')
  if (containsFolicAcid.length > 0) {
    return {
      status: 'contains_folic_acid',
      confidence: strongestConfidence(containsFolicAcid),
      flaggedIngredients: containsFolicAcid,
      explanation: `Confirmed added folic acid from: ${containsFolicAcid.map((i) => i.ingredientName).join(', ')}.`,
    }
  }

  const likelyFortified = ingredients.filter((i) => i.classification.status === 'likely_fortified')
  if (likelyFortified.length > 0) {
    return {
      status: 'likely_fortified',
      confidence: strongestConfidence(likelyFortified),
      flaggedIngredients: likelyFortified,
      explanation: `Likely added folic acid from: ${likelyFortified.map((i) => i.ingredientName).join(', ')}. UK fortification is rolling out through 13 Dec 2026.`,
    }
  }

  const uncertain = ingredients.filter(
    (i) => i.classification.status === 'unknown' || i.classification.status === 'incomplete_data',
  )
  if (uncertain.length > 0) {
    return {
      status: 'unknown',
      confidence: 'low',
      flaggedIngredients: uncertain,
      explanation: `Folic acid status could not be confirmed for: ${uncertain.map((i) => i.ingredientName).join(', ')}. This recipe can't be marked fully safe until those are checked.`,
    }
  }

  return {
    status: 'safe',
    confidence: weakestConfidence(ingredients),
    flaggedIngredients: [],
    explanation: 'Every ingredient is classified as safe (wholemeal or non-wheat flour, or no wheat-based ingredients).',
  }
}
