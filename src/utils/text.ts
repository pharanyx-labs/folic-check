export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics left by NFKD
    .replace(/[^a-z0-9\s%.,()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function includesPhrase(haystack: string, phrase: string): boolean {
  return normalize(haystack).includes(normalize(phrase))
}

export function includesAnyPhrase(haystack: string, phrases: string[]): string | null {
  const normalized = normalize(haystack)
  for (const phrase of phrases) {
    if (normalized.includes(normalize(phrase))) return phrase
  }
  return null
}
