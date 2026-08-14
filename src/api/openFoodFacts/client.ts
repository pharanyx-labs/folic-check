import { normalize } from '../../utils/text'
import { APP_NAME_HEADER, PRODUCT_API_BASE, PRODUCT_FIELDS, SEARCH_API_BASE } from './config'
import { CACHE_TTL_MS, getCached, setCached } from './cache'
import { acquireToken } from './rateLimiter'
import type { OFFClientResult, OFFProduct, OFFProductApiResponse, OFFSearchApiResponse } from './types'

function isValidProduct(candidate: unknown): candidate is OFFProduct {
  return typeof candidate === 'object' && candidate !== null && typeof (candidate as { code?: unknown }).code === 'string'
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown network error'
}

/** True for barcode-shaped input (digits only, typically 8-14 characters — EAN/UPC range). */
export function isLikelyBarcode(query: string): boolean {
  const trimmed = query.trim()
  return /^\d{6,14}$/.test(trimmed)
}

export async function fetchProductByBarcode(barcode: string): Promise<OFFClientResult<OFFProduct>> {
  const trimmed = barcode.trim()
  const cacheKey = `product:${trimmed}`
  const cached = getCached<OFFProduct>(cacheKey)
  if (cached) return { status: 'ok', data: cached }

  const acquired = await acquireToken('product')
  if (!acquired) return { status: 'rate_limited' }

  try {
    const url = `${PRODUCT_API_BASE}/product/${encodeURIComponent(trimmed)}.json?fields=${PRODUCT_FIELDS}`
    const response = await fetch(url, { headers: APP_NAME_HEADER })
    if (!response.ok) {
      if (response.status === 404) return { status: 'not_found' }
      return { status: 'network_error', message: `Open Food Facts returned HTTP ${response.status}` }
    }
    const json = (await response.json()) as OFFProductApiResponse
    if (!isValidProduct(json.product)) {
      return { status: 'not_found' }
    }
    setCached(cacheKey, json.product, CACHE_TTL_MS.product)
    return { status: 'ok', data: json.product }
  } catch (err) {
    return { status: 'network_error', message: errorMessage(err) }
  }
}

export interface SearchOptions {
  page?: number
}

export async function searchProductsByName(query: string, opts: SearchOptions = {}): Promise<OFFClientResult<OFFProduct[]>> {
  const trimmed = query.trim()
  if (!trimmed) return { status: 'ok', data: [] }

  const page = opts.page ?? 1
  const cacheKey = `search:${normalize(trimmed)}:${page}`
  const cached = getCached<OFFProduct[]>(cacheKey)
  if (cached) return { status: 'ok', data: cached }

  const acquired = await acquireToken('search')
  if (!acquired) return { status: 'rate_limited' }

  try {
    const params = new URLSearchParams({
      search_terms: trimmed,
      search_simple: '1',
      action: 'process',
      json: '1',
      page_size: '20',
      page: String(page),
      countries_tags_en: 'united-kingdom',
    })
    const response = await fetch(`${SEARCH_API_BASE}?${params.toString()}`, { headers: APP_NAME_HEADER })
    if (!response.ok) {
      return { status: 'network_error', message: `Open Food Facts returned HTTP ${response.status}` }
    }
    const json = (await response.json()) as OFFSearchApiResponse
    const products = Array.isArray(json.products) ? json.products.filter(isValidProduct) : []
    setCached(cacheKey, products, CACHE_TTL_MS.search)
    return { status: 'ok', data: products }
  } catch (err) {
    return { status: 'network_error', message: errorMessage(err) }
  }
}
