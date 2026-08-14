export const APP_USER_AGENT = 'FolicAlert/0.1 (accounts@pharanyx.co.uk)'

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

/**
 * Browsers cannot override the User-Agent header from JS, so this constant can't be
 * fully honored client-side — kept as documented intent and reused verbatim if a
 * serverless proxy is ever added. We still send it as X-App-Name where CORS allows it,
 * as a good-faith identification gesture.
 */
export const APP_NAME_HEADER = { 'X-App-Name': APP_USER_AGENT }

export const RATE_LIMITS = {
  product: { capacity: 15, windowMs: 60_000 },
  search: { capacity: 10, windowMs: 60_000 },
} as const
