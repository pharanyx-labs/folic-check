export type ClassificationStatus =
  | 'safe'
  | 'contains_folic_acid'
  | 'likely_fortified'
  | 'unknown'
  | 'incomplete_data'

export type Confidence = 'certain' | 'high' | 'moderate' | 'low'

export type EvidenceField =
  | 'ingredients_text'
  | 'ingredients_tags'
  | 'categories_tags'
  | 'additives_tags'
  | 'countries_tags'

export interface Evidence {
  ruleId: string
  matchedText: string
  field: EvidenceField
}

export interface ClassificationResult {
  status: ClassificationStatus
  confidence: Confidence
  evidence: Evidence[]
  explanation: string
}

export interface ClassifierInput {
  productName: string | null
  ingredientsText: string | null
  ingredientsTags: string[]
  categoriesTags: string[]
  additivesTags: string[]
  countriesTags: string[]
}

export interface NormalizedInput {
  ingredientsTextNormalized: string
  ingredientsTagsNormalized: string[]
  categoriesTagsNormalized: string[]
  additivesTagsNormalized: string[]
  countriesTagsNormalized: string[]
}

export interface Rule {
  id: string
  tier: 0 | 1 | 2
  status: ClassificationStatus
  confidence: Confidence
  description: string
  test: (input: ClassifierInput, normalized: NormalizedInput) => Evidence[] | null
  explain: (evidence: Evidence[]) => string
}
