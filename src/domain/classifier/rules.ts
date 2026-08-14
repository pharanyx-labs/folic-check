import { includesAnyPhrase, normalize } from '../../utils/text'
import { analyzeFlour, EXACT_FORTIFIED_PHRASE } from './flourAnalysis'
import type { Evidence, NormalizedInput, Rule } from './types'

const DIRECT_FOLIC_ACID_PHRASES = ['folic acid', 'vitamin b9', 'pteroylglutamic acid']
const DIRECT_FOLIC_ACID_TAGS = ['en:folic-acid', 'en:vitamin-b9']

const UK_COUNTRY_TAG = 'en:united-kingdom'

const UK_FLOUR_RISK_CATEGORY_TAGS = [
  'en:breads',
  'en:wheat-breads',
  'en:white-breads',
  'en:cereals',
  'en:breakfast-cereals',
  'en:pastas',
  'en:biscuits',
  'en:cakes',
  'en:flours',
  'en:wheat-flours',
  'en:crackers',
  'en:pastries',
  'en:pizzas',
]

/**
 * Ordered, tiered rule list — the file expected to change as UK fortification
 * phrasing/rollout evolves through the 13 Dec 2026 compliance deadline. Rules are
 * grouped by tier and the classifier stops at the first tier that produces a match.
 */
export const rules: Rule[] = [
  {
    id: 'direct-folic-acid-mention',
    tier: 0,
    status: 'contains_folic_acid',
    confidence: 'certain',
    description: 'Ingredients text or tags explicitly name folic acid / vitamin B9 / its INN chemical name.',
    test: (input, normalized) => {
      const evidence: Evidence[] = []
      const textMatch = includesAnyPhrase(input.ingredientsText ?? '', DIRECT_FOLIC_ACID_PHRASES)
      if (textMatch) {
        evidence.push({ ruleId: 'direct-folic-acid-mention', matchedText: textMatch, field: 'ingredients_text' })
      }
      const tagMatch = normalized.ingredientsTagsNormalized.find((tag) =>
        DIRECT_FOLIC_ACID_TAGS.some((known) => tag.includes(known.replace('en:', ''))),
      )
      if (tagMatch) {
        evidence.push({ ruleId: 'direct-folic-acid-mention', matchedText: tagMatch, field: 'ingredients_tags' })
      }
      return evidence.length > 0 ? evidence : null
    },
    explain: (evidence) =>
      `Ingredients explicitly list "${evidence[0].matchedText}" — this product contains added folic acid.`,
  },

  {
    id: 'safe-wholemeal-or-non-wheat-flour',
    tier: 1,
    status: 'safe',
    confidence: 'high',
    description: 'Every flour/semolina ingredient mentioned is either wholemeal wheat or a non-wheat flour.',
    test: (input) => {
      if (!input.ingredientsText) return null
      const mentions = analyzeFlour(input.ingredientsText)
      if (mentions.length === 0) return null
      const hasRiskyFlour = mentions.some((m) => m.kind === 'non_wholemeal_wheat')
      if (hasRiskyFlour) return null
      return mentions.map((m) => ({
        ruleId: 'safe-wholemeal-or-non-wheat-flour',
        matchedText: m.matchedText,
        field: 'ingredients_text' as const,
      }))
    },
    explain: (evidence) =>
      `Ingredients only mention wholemeal wheat and/or non-wheat flour ("${evidence
        .map((e) => e.matchedText)
        .join('", "')}") — these are exempt from the UK mandatory folic acid fortification rule.`,
  },

  {
    id: 'safe-no-wheat-indicators',
    tier: 1,
    status: 'safe',
    confidence: 'moderate',
    description: 'Ingredients text is present and non-empty but contains no wheat, flour, or folic acid wording at all.',
    test: (input) => {
      if (!input.ingredientsText) return null
      const normalizedText = normalize(input.ingredientsText)
      if (normalizedText.length === 0) return null
      if (/\bflour\b|\bwheat\b|semolina/.test(normalizedText)) return null
      return [{ ruleId: 'safe-no-wheat-indicators', matchedText: input.ingredientsText, field: 'ingredients_text' }]
    },
    explain: () =>
      'Ingredients list does not mention wheat, flour, or folic acid — this product is not a likely fortification vehicle, though always check the physical label.',
  },

  {
    id: 'likely-fortified-non-wholemeal-wheat-flour',
    tier: 2,
    status: 'likely_fortified',
    confidence: 'moderate',
    description:
      'Contains non-wholemeal wheat flour; confidence is scaled by how strongly the product is tied to the UK market.',
    test: (input) => {
      if (!input.ingredientsText) return null
      const mentions = analyzeFlour(input.ingredientsText)
      const riskyMentions = mentions.filter((m) => m.kind === 'non_wholemeal_wheat')
      if (riskyMentions.length === 0) return null
      return riskyMentions.map((m) => ({
        ruleId: 'likely-fortified-non-wholemeal-wheat-flour',
        matchedText: m.matchedText,
        field: 'ingredients_text' as const,
      }))
    },
    explain: (evidence) => {
      const exactPhrase = evidence.some((e) => e.matchedText === EXACT_FORTIFIED_PHRASE)
      if (exactPhrase) {
        return `Ingredients state "${EXACT_FORTIFIED_PHRASE}" — the standard UK label wording for flour that is required to carry added folic acid.`
      }
      return `Ingredients include non-wholemeal wheat flour ("${evidence
        .map((e) => e.matchedText)
        .join('", "')}"). UK fortification is rolling out through 13 Dec 2026, so this product is likely — but not confirmed — to contain added folic acid.`
    },
  },
]

/** Scales the confidence of the Tier 2 "likely fortified" rule by UK-market signal strength. */
export function scaleLikelyFortifiedConfidence(
  input: { countriesTags: string[]; categoriesTags: string[] },
  normalized: NormalizedInput,
  evidence: Evidence[],
): Rule['confidence'] {
  const isUkTagged = normalized.countriesTagsNormalized.some((tag) => tag.includes('united-kingdom'))
  const hasOtherCountryOnly = input.countriesTags.length > 0 && !isUkTagged
  const hasUkFlourCategory = normalized.categoriesTagsNormalized.some((tag) =>
    UK_FLOUR_RISK_CATEGORY_TAGS.some((known) => tag.includes(known.replace('en:', ''))),
  )
  const exactPhrase = evidence.some((e) => e.matchedText === EXACT_FORTIFIED_PHRASE)

  if (hasOtherCountryOnly) return 'low'
  if (isUkTagged && exactPhrase) return 'high'
  if (isUkTagged || hasUkFlourCategory) return 'high'
  return 'moderate'
}

export { UK_COUNTRY_TAG, UK_FLOUR_RISK_CATEGORY_TAGS }
