import { describe, expect, it } from 'vitest'
import type { ClassificationResult } from '../classifier/types'
import { computeGuidance, createDefaultProfile, dailyLimitUg, type RiskProfile } from './riskProfile'

function classification(overrides: Partial<ClassificationResult>): ClassificationResult {
  return { status: 'unknown', confidence: 'low', evidence: [], explanation: '', ...overrides }
}

function profile(overrides: Partial<RiskProfile>): RiskProfile {
  return { ...createDefaultProfile('p1'), ...overrides }
}

describe('dailyLimitUg', () => {
  it('is null for a default/empty profile — never fabricate a number', () => {
    expect(dailyLimitUg(createDefaultProfile('p1'))).toBeNull()
  })

  it('is the cautious RNI level for age 50+', () => {
    expect(dailyLimitUg(profile({ ageBand: '50_plus' }))).toBe(200)
  })

  it('is the cautious RNI level for adenoma history regardless of age', () => {
    expect(dailyLimitUg(profile({ ageBand: '18_49', hasAdenomaHistory: true }))).toBe(200)
  })

  it('is the general upper level for a set profile with no elevated risk factors', () => {
    expect(dailyLimitUg(profile({ ageBand: '18_49' }))).toBe(1000)
  })
})

describe('computeGuidance', () => {
  it('returns no relevance and null limit for an unset profile', () => {
    const guidance = computeGuidance(createDefaultProfile('p1'), classification({ status: 'contains_folic_acid' }))
    expect(guidance.relevanceLevel).toBe('none')
    expect(guidance.dailyLimitUg).toBeNull()
  })

  it('escalates to watch_closely for adenoma history + a folic-acid-positive product', () => {
    const guidance = computeGuidance(
      profile({ hasAdenomaHistory: true }),
      classification({ status: 'contains_folic_acid' }),
    )
    expect(guidance.relevanceLevel).toBe('watch_closely')
    expect(guidance.dailyLimitUg).toBe(200)
  })

  it('escalates to watch_closely for age 50+ + likely_fortified', () => {
    const guidance = computeGuidance(profile({ ageBand: '50_plus' }), classification({ status: 'likely_fortified' }))
    expect(guidance.relevanceLevel).toBe('watch_closely')
  })

  it('does not escalate for age 50+ + a safe product', () => {
    const guidance = computeGuidance(profile({ ageBand: '50_plus' }), classification({ status: 'safe' }))
    expect(guidance.relevanceLevel).toBe('none')
  })

  it('gives caution (not watch_closely) for a higher-risk profile facing unknown/incomplete data', () => {
    const guidance = computeGuidance(profile({ ageBand: '50_plus' }), classification({ status: 'unknown' }))
    expect(guidance.relevanceLevel).toBe('caution')
  })

  it('gives info-level pregnancy guidance independent of classification status', () => {
    const guidance = computeGuidance(profile({ pregnantOrTTC: true }), classification({ status: 'safe' }))
    expect(guidance.relevanceLevel).toBe('info')
    expect(guidance.message).toMatch(/400/)
  })

  it('gives low-key info for a set profile with no elevated risk on a positive product', () => {
    const guidance = computeGuidance(profile({ ageBand: '18_49' }), classification({ status: 'contains_folic_acid' }))
    expect(guidance.relevanceLevel).toBe('info')
  })

  it('every non-empty guidance message includes the not-medical-advice disclaimer', () => {
    const guidance = computeGuidance(
      profile({ hasAdenomaHistory: true }),
      classification({ status: 'contains_folic_acid' }),
    )
    expect(guidance.message).toMatch(/not medical advice/i)
  })
})
