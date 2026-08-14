import { normalize } from '../../utils/text'

export type FlourKind = 'wholemeal_wheat' | 'non_wheat' | 'non_wholemeal_wheat'

export interface FlourMention {
  kind: FlourKind
  matchedText: string
}

const WHOLEMEAL_WHEAT_MARKERS = ['wholemeal', 'wholegrain', 'whole grain', 'whole wheat', 'wholewheat', 'whole meal']

const NON_WHEAT_KEYWORDS = [
  'rice flour',
  'corn flour',
  'cornflour',
  'maize flour',
  'oat flour',
  'oatmeal',
  'buckwheat flour',
  'chickpea flour',
  'gram flour',
  'potato flour',
  'coconut flour',
  'almond flour',
  'tapioca flour',
  'cassava flour',
  'rye flour',
  'gluten free flour',
  'gluten-free flour',
  'quinoa flour',
  'spelt flour',
  'millet flour',
  'teff flour',
  'soya flour',
  'soy flour',
  'chestnut flour',
  'lupin flour',
  'plantain flour',
]

/** Exact standard UK label wording carries the strongest evidential weight. */
export const EXACT_FORTIFIED_PHRASE = 'fortified wheat flour'

const NON_WHOLEMEAL_WHEAT_KEYWORDS = [
  EXACT_FORTIFIED_PHRASE,
  'wheat flour',
  'plain flour',
  'self-raising flour',
  'self raising flour',
  'strong flour',
  'strong white flour',
  'strong bread flour',
  'white flour',
  'bread flour',
  'cake flour',
  '00 flour',
  'durum wheat flour',
  'durum flour',
  'semolina flour',
  'semolina',
]

/**
 * Splits an ingredients string into top-level, comma-separated ingredient entries,
 * keeping parenthetical sub-ingredient breakdowns (e.g. "Fortified Wheat Flour (Wheat
 * Flour, Calcium Carbonate, Iron, Niacin, Thiamin)") attached to their parent entry
 * instead of splitting them into separate top-level mentions.
 */
function splitTopLevelEntries(text: string): string[] {
  const entries: string[] = []
  let depth = 0
  let current = ''
  for (const char of text) {
    if (char === '(') depth += 1
    if (char === ')') depth = Math.max(0, depth - 1)
    if (char === ',' && depth === 0) {
      entries.push(current)
      current = ''
    } else {
      current += char
    }
  }
  if (current.trim()) entries.push(current)
  return entries.map((entry) => entry.trim()).filter(Boolean)
}

function classifyEntry(entryNormalized: string): FlourMention | null {
  const mentionsFlourWord = /\bflour\b/.test(entryNormalized) || entryNormalized.includes('semolina')
  if (!mentionsFlourWord) return null

  const wholemealMarker = WHOLEMEAL_WHEAT_MARKERS.find((marker) => entryNormalized.includes(marker))
  if (wholemealMarker) {
    return { kind: 'wholemeal_wheat', matchedText: wholemealMarker }
  }

  const nonWheatMatch = NON_WHEAT_KEYWORDS.find((keyword) => entryNormalized.includes(keyword))
  if (nonWheatMatch) {
    return { kind: 'non_wheat', matchedText: nonWheatMatch }
  }

  const nonWholemealMatch = NON_WHOLEMEAL_WHEAT_KEYWORDS.find((keyword) => entryNormalized.includes(keyword))
  if (nonWholemealMatch) {
    return { kind: 'non_wholemeal_wheat', matchedText: nonWholemealMatch }
  }

  // A bare, unqualified "flour" defaults to wheat flour — the UK labelling convention
  // when no other grain is named.
  if (/\bflour\b/.test(entryNormalized)) {
    return { kind: 'non_wholemeal_wheat', matchedText: 'flour' }
  }

  return null
}

/** Returns one classified mention per top-level ingredient entry that references flour/semolina. */
export function analyzeFlour(ingredientsText: string): FlourMention[] {
  const normalized = normalize(ingredientsText)
  const entries = splitTopLevelEntries(normalized)
  const mentions: FlourMention[] = []
  for (const entry of entries) {
    const mention = classifyEntry(entry)
    if (mention) mentions.push(mention)
  }
  return mentions
}
