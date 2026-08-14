import { normalize } from '../../utils/text'
import { rules, scaleLikelyFortifiedConfidence } from './rules'
import type { ClassificationResult, ClassifierInput, NormalizedInput } from './types'

function toNormalizedInput(input: ClassifierInput): NormalizedInput {
  return {
    ingredientsTextNormalized: normalize(input.ingredientsText ?? ''),
    ingredientsTagsNormalized: input.ingredientsTags.map(normalize),
    categoriesTagsNormalized: input.categoriesTags.map(normalize),
    additivesTagsNormalized: input.additivesTags.map(normalize),
    countriesTagsNormalized: input.countriesTags.map(normalize),
  }
}

function hasNoIngredientData(input: ClassifierInput): boolean {
  const emptyText = !input.ingredientsText || input.ingredientsText.trim().length === 0
  const emptyTags = input.ingredientsTags.length === 0
  return emptyText && emptyTags
}

/**
 * Classifies an Open-Food-Facts-derived product for likely UK added-folic-acid content.
 * Never returns `confidence: "certain"` for anything short of a direct ingredient match —
 * this is the deliberate anti-overclaiming guarantee for health-adjacent output.
 */
export function classify(input: ClassifierInput): ClassificationResult {
  if (hasNoIngredientData(input)) {
    return {
      status: 'incomplete_data',
      confidence: 'low',
      evidence: [],
      explanation:
        'This product has no ingredients data on Open Food Facts yet, so we cannot determine folic acid status. Please check the physical label.',
    }
  }

  const normalized = toNormalizedInput(input)

  for (const tier of [0, 1, 2] as const) {
    const tierRules = rules.filter((rule) => rule.tier === tier)
    for (const rule of tierRules) {
      const evidence = rule.test(input, normalized)
      if (!evidence) continue

      let confidence = rule.confidence
      if (rule.id === 'likely-fortified-non-wholemeal-wheat-flour') {
        confidence = scaleLikelyFortifiedConfidence(input, normalized, evidence)
      }

      return {
        status: rule.status,
        confidence,
        evidence,
        explanation: rule.explain(evidence),
      }
    }
  }

  return {
    status: 'unknown',
    confidence: 'low',
    evidence: [],
    explanation:
      'We could not determine folic acid status from the available ingredients data. Please check the physical label.',
  }
}
