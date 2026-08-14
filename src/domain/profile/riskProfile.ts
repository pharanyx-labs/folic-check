import type { ClassificationResult } from '../classifier/types'

export type AgeBand = 'under_18' | '18_49' | '50_plus'

export interface RiskProfile {
  id: string
  name: string
  ageBand: AgeBand | null
  pregnantOrTTC: boolean
  hasB12Issues: boolean
  hasAdenomaHistory: boolean
}

export function createDefaultProfile(id: string, name = 'My profile'): RiskProfile {
  return { id, name, ageBand: null, pregnantOrTTC: false, hasB12Issues: false, hasAdenomaHistory: false }
}

export type RelevanceLevel = 'none' | 'info' | 'caution' | 'watch_closely'

export interface Guidance {
  dailyLimitUg: number | null
  relevanceLevel: RelevanceLevel
  message: string
}

/** UK Reference Nutrient Intake for folate — the cautious ceiling advised for higher-risk groups. */
const RNI_FOLATE_UG = 200
/** UK EVM "safe upper level" guidance for long-term supplemental folic acid intake in the general adult population. */
const GENERAL_UPPER_LEVEL_UG = 1000
/** Separately-recommended daily folic acid supplement dose for pregnancy/trying-to-conceive. */
export const PREGNANCY_SUPPLEMENT_UG = 400

function isProfileSet(profile: RiskProfile): boolean {
  return profile.ageBand !== null || profile.pregnantOrTTC || profile.hasB12Issues || profile.hasAdenomaHistory
}

function isHigherRiskProfile(profile: RiskProfile): boolean {
  return profile.ageBand === '50_plus' || profile.hasAdenomaHistory || profile.hasB12Issues
}

/**
 * A daily limit is only ever returned once the profile has at least one field set —
 * never fabricate a number from an empty/default profile.
 */
export function dailyLimitUg(profile: RiskProfile): number | null {
  if (!isProfileSet(profile)) return null
  return isHigherRiskProfile(profile) ? RNI_FOLATE_UG : GENERAL_UPPER_LEVEL_UG
}

const DISCLAIMER = 'This is general information, not medical advice — always check the physical label and speak with your GP or pharmacist about what is right for you.'

/**
 * Pure function combining a user's risk profile with a product's classification into
 * personalized, hedged guidance. Never asserts a daily limit or risk level the profile
 * doesn't actually support.
 */
export function computeGuidance(profile: RiskProfile, classification: ClassificationResult): Guidance {
  const limit = dailyLimitUg(profile)

  if (!isProfileSet(profile)) {
    return { dailyLimitUg: null, relevanceLevel: 'none', message: '' }
  }

  const positiveStatus = classification.status === 'contains_folic_acid' || classification.status === 'likely_fortified'
  const uncertainStatus = classification.status === 'unknown' || classification.status === 'incomplete_data'
  const containsWording = classification.status === 'contains_folic_acid' ? 'contains' : 'likely contains'
  const higherRisk = isHigherRiskProfile(profile)

  if (profile.hasAdenomaHistory && positiveStatus) {
    return {
      dailyLimitUg: limit,
      relevanceLevel: 'watch_closely',
      message: `You've noted a history of colorectal adenomas. UK guidance for this group suggests not exceeding the Reference Nutrient Intake (~${limit} µg/day) of folic acid from supplements and fortified food combined. This product ${containsWording} added folic acid — factor it into your daily total. ${DISCLAIMER}`,
    }
  }

  if (higherRisk && positiveStatus) {
    const reason = profile.ageBand === '50_plus' ? 'being in the 50+ age group' : 'the B12 considerations you noted'
    return {
      dailyLimitUg: limit,
      relevanceLevel: 'watch_closely',
      message: `Based on ${reason}, UK guidance suggests keeping supplemental/fortified folic acid intake near the Reference Nutrient Intake (~${limit} µg/day). This product ${containsWording} added folic acid. ${DISCLAIMER}`,
    }
  }

  if (higherRisk && uncertainStatus) {
    return {
      dailyLimitUg: limit,
      relevanceLevel: 'caution',
      message: `We could not confirm folic acid status for this product. Given your profile, check the physical label for "wheat flour" vs "wholemeal wheat flour" before counting it toward your daily intake. ${DISCLAIMER}`,
    }
  }

  if (profile.pregnantOrTTC) {
    const extra = positiveStatus ? ' This product also contributes some fortified folic acid on top of that.' : ''
    return {
      dailyLimitUg: limit,
      relevanceLevel: 'info',
      message: `Folic acid (${PREGNANCY_SUPPLEMENT_UG} µg/day) is separately recommended via supplement for anyone pregnant or trying to conceive, regardless of this product's fortification status.${extra} ${DISCLAIMER}`,
    }
  }

  if (positiveStatus) {
    return {
      dailyLimitUg: limit,
      relevanceLevel: 'info',
      message: `This product ${containsWording} added folic acid. Based on your profile this isn't flagged as a particular concern, but you can track your intake over time. ${DISCLAIMER}`,
    }
  }

  return { dailyLimitUg: limit, relevanceLevel: 'none', message: '' }
}
