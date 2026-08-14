/**
 * Browsers cannot override the User-Agent header from JS. We also deliberately do NOT
 * send this as a custom header (e.g. X-App-Name) instead: any non-"simple" header
 * forces a CORS preflight, and Open Food Facts' preflight response for the product API
 * does not list custom headers as allowed — so every request would silently fail with a
 * generic "Failed to fetch"/"NetworkError" in real browsers (confirmed by hand; unit
 * tests never catch this since they mock fetch and never hit real CORS enforcement).
 * Every request in this module must stay header-free to remain a simple,
 * non-preflighted GET. Kept as documented intent, reusable verbatim only behind a
 * server-side proxy where CORS doesn't apply.
 */
export const APP_USER_AGENT = 'FolicCheck/0.1 (accounts@pharanyx.co.uk)'

export const PRODUCT_API_BASE = 'https://world.openfoodfacts.org/api/v3'
export const SEARCH_API_BASE = 'https://world.openfoodfacts.org/cgi/search.pl'

export const PRODUCT_FIELDS = [
  'code',
  'product_name',
  'brands',
  'ingredients_text',
  'ingredients_tags',
  'categories_tags',
  'additives_tags',
  'countries_tags',
  'image_front_url',
  'quantity',
].join(',')

export const RATE_LIMITS = {
  product: { capacity: 15, windowMs: 60_000 },
  search: { capacity: 10, windowMs: 60_000 },
} as const
