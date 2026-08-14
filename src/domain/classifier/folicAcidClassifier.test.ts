import { describe, expect, it } from 'vitest'
import { classify } from './folicAcidClassifier'
import type { ClassifierInput } from './types'

function input(overrides: Partial<ClassifierInput>): ClassifierInput {
  return {
    productName: 'Test product',
    ingredientsText: null,
    ingredientsTags: [],
    categoriesTags: [],
    additivesTags: [],
    countriesTags: [],
    ...overrides,
  }
}

describe('classify — guard clause', () => {
  it('returns incomplete_data when ingredients text and tags are both empty', () => {
    const result = classify(input({ ingredientsText: null, ingredientsTags: [] }))
    expect(result.status).toBe('incomplete_data')
    expect(result.evidence).toHaveLength(0)
  })

  it('returns incomplete_data when ingredients text is an empty/whitespace string', () => {
    const result = classify(input({ ingredientsText: '   ' }))
    expect(result.status).toBe('incomplete_data')
  })
})

describe('classify — Tier 0: direct folic acid mention', () => {
  it('flags an explicit "folic acid" ingredient as contains_folic_acid with certain confidence', () => {
    const result = classify(input({ ingredientsText: 'Wheat Flour, Water, Salt, Folic Acid' }))
    expect(result.status).toBe('contains_folic_acid')
    expect(result.confidence).toBe('certain')
    expect(result.evidence.length).toBeGreaterThan(0)
  })

  it('Tier 0 wins over Tier 2 when both a folic acid mention and non-wholemeal flour are present', () => {
    const result = classify(input({ ingredientsText: 'Wheat Flour, Folic Acid, Water' }))
    expect(result.status).toBe('contains_folic_acid')
    expect(result.confidence).toBe('certain')
  })

  it('matches "vitamin b9" as a direct mention', () => {
    const result = classify(input({ ingredientsText: 'Wheat Flour, Vitamin B9, Water' }))
    expect(result.status).toBe('contains_folic_acid')
  })
})

describe('classify — Tier 1: safe', () => {
  it('classifies wholemeal-only wheat flour as safe with high confidence', () => {
    const result = classify(input({ ingredientsText: 'Wholemeal Wheat Flour, Water, Yeast, Salt' }))
    expect(result.status).toBe('safe')
    expect(result.confidence).toBe('high')
  })

  it('classifies a non-wheat flour as safe', () => {
    const result = classify(input({ ingredientsText: 'Rice Flour, Water, Salt' }))
    expect(result.status).toBe('safe')
  })

  it('classifies products with no wheat/flour indicators at all as safe with moderate confidence', () => {
    const result = classify(input({ ingredientsText: 'Milk, Live Active Cultures' }))
    expect(result.status).toBe('safe')
    expect(result.confidence).toBe('moderate')
  })

  it('does NOT classify mixed wholemeal + plain flour as safe (safe-by-omission failure mode)', () => {
    const result = classify(
      input({ ingredientsText: 'Wholemeal Wheat Flour, Wheat Flour, Water, Salt' }),
    )
    expect(result.status).not.toBe('safe')
    expect(result.status).toBe('likely_fortified')
  })

  it('keeps a fortified sub-ingredient breakdown attached to its parent entry', () => {
    // "Fortified Wheat Flour (Wheat Flour, Calcium Carbonate, Iron, Niacin, Thiamin)"
    // must not be split so that "Wheat Flour" inside the parens creates a spurious
    // second top-level mention alongside a genuinely wholemeal product elsewhere.
    const result = classify(
      input({
        ingredientsText: 'Wholemeal Wheat Flour, Water, Salt, Yeast',
      }),
    )
    expect(result.status).toBe('safe')
  })
})

describe('classify — Tier 2: likely_fortified', () => {
  it('flags plain non-wholemeal wheat flour as likely_fortified', () => {
    const result = classify(input({ ingredientsText: 'Wheat Flour, Water, Salt, Yeast' }))
    expect(result.status).toBe('likely_fortified')
    expect(result.confidence).not.toBe('certain')
  })

  it('gives high confidence for the exact standard "fortified wheat flour" UK label phrase with a UK country tag', () => {
    const result = classify(
      input({
        ingredientsText: 'Fortified Wheat Flour (Wheat Flour, Calcium Carbonate, Iron, Niacin, Thiamin), Water, Salt',
        countriesTags: ['en:united-kingdom'],
      }),
    )
    expect(result.status).toBe('likely_fortified')
    expect(result.confidence).toBe('high')
  })

  it('does NOT return high confidence for a product explicitly tagged to a non-UK country', () => {
    const result = classify(
      input({
        ingredientsText: 'Wheat Flour, Water, Salt, Yeast',
        countriesTags: ['en:france'],
      }),
    )
    expect(result.status).toBe('likely_fortified')
    expect(result.confidence).toBe('low')
    expect(result.confidence).not.toBe('high')
    expect(result.confidence).not.toBe('certain')
  })

  it('gives moderate confidence when country/category context is unclear', () => {
    const result = classify(input({ ingredientsText: 'Wheat Flour, Water, Salt, Yeast' }))
    expect(result.status).toBe('likely_fortified')
    expect(result.confidence).toBe('moderate')
  })
})

describe('classify — unknown fallback', () => {
  it('returns unknown for wheat-derived ingredients that are not flour (e.g. wheat starch/gluten)', () => {
    const result = classify(input({ ingredientsText: 'Wheat Starch, Wheat Gluten, Water' }))
    expect(result.status).toBe('unknown')
    expect(result.confidence).toBe('low')
  })
})

describe('classify — confidence discipline', () => {
  it('never returns "certain" confidence for anything other than a direct ingredient/tag match', () => {
    const cases: Partial<ClassifierInput>[] = [
      { ingredientsText: 'Wheat Flour, Water, Salt', countriesTags: ['en:united-kingdom'] },
      { ingredientsText: 'Wholemeal Wheat Flour, Water' },
      { ingredientsText: 'Wheat Starch, Water' },
      { ingredientsText: null, ingredientsTags: [] },
    ]
    for (const c of cases) {
      const result = classify(input(c))
      expect(result.confidence).not.toBe('certain')
    }
  })
})
