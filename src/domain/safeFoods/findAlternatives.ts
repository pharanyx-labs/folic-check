import { safeFoodsData, type SafeFoodEntry } from './safeFoodsData'

const KEYWORD_TO_RISKY_ID: { keywords: string[]; riskyId: string }[] = [
  { keywords: ['bread', 'loaf', 'baguette', 'roll'], riskyId: 'white-sliced-bread' },
  { keywords: ['pasta', 'spaghetti', 'penne', 'fusilli', 'macaroni'], riskyId: 'plain-white-flour' },
  { keywords: ['cake', 'sponge', 'muffin'], riskyId: 'cakes-shop-bought' },
  { keywords: ['pizza'], riskyId: 'pizza-base-shop' },
  { keywords: ['cereal', 'cornflakes', 'flakes'], riskyId: 'wheat-breakfast-cereal' },
  { keywords: ['cracker', 'crispbread'], riskyId: 'cream-crackers' },
  { keywords: ['pie', 'pastry', 'croissant'], riskyId: 'pies-shop-bought' },
  { keywords: ['flour'], riskyId: 'plain-white-flour' },
]

/**
 * Finds curated safe substitutes for a flagged product, matched loosely by keywords in
 * its name. Falls back to general safe-flour/grain suggestions when nothing matches —
 * always labelled as such by the caller rather than presented as product-specific.
 */
export function findAlternatives(productName: string | null, limit = 4): SafeFoodEntry[] {
  const name = (productName ?? '').toLowerCase()
  const matchedRiskyIds = new Set<string>()
  for (const { keywords, riskyId } of KEYWORD_TO_RISKY_ID) {
    if (keywords.some((kw) => name.includes(kw))) matchedRiskyIds.add(riskyId)
  }

  if (matchedRiskyIds.size > 0) {
    const matches = safeFoodsData.filter((entry) => entry.substituteFor?.some((id) => matchedRiskyIds.has(id)))
    if (matches.length > 0) return matches.slice(0, limit)
  }

  return safeFoodsData
    .filter((entry) => entry.status === 'safe' && (entry.category === 'safe_flours' || entry.category === 'safe_grains'))
    .slice(0, limit)
}
