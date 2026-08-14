import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchProductByBarcode, isLikelyBarcode, searchProductsByName } from './client'
import { clearCacheForTests } from './cache'
import { resetRateLimiterForTests } from './rateLimiter'

function jsonResponse(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body } as Response
}

beforeEach(() => {
  clearCacheForTests()
  resetRateLimiterForTests()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('isLikelyBarcode', () => {
  it('treats digit-only 8-14 char strings as barcodes', () => {
    expect(isLikelyBarcode('5000112548167')).toBe(true)
    expect(isLikelyBarcode('12345678')).toBe(true)
  })

  it('treats free text as not a barcode', () => {
    expect(isLikelyBarcode('white bread')).toBe(false)
    expect(isLikelyBarcode('123')).toBe(false)
  })
})

describe('fetchProductByBarcode', () => {
  it('returns ok with product data on a successful response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ product: { code: '123456789', product_name: 'Test Bread' } }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await fetchProductByBarcode('123456789')
    expect(result.status).toBe('ok')
    if (result.status === 'ok') {
      expect(result.data.product_name).toBe('Test Bread')
    }
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('serves subsequent identical calls from cache without a second fetch', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ product: { code: '123456789' } }))
    vi.stubGlobal('fetch', fetchMock)

    await fetchProductByBarcode('123456789')
    await fetchProductByBarcode('123456789')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('returns not_found on a 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, false, 404)))
    const result = await fetchProductByBarcode('000000000')
    expect(result.status).toBe('not_found')
  })

  it('returns not_found when the response has no valid product (malformed/partial OFF data)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ status: 0 })))
    const result = await fetchProductByBarcode('000000000')
    expect(result.status).toBe('not_found')
  })

  it('returns network_error and does not throw when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    const result = await fetchProductByBarcode('123456789')
    expect(result.status).toBe('network_error')
  })

  it('returns network_error on a non-ok, non-404 HTTP status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, false, 500)))
    const result = await fetchProductByBarcode('123456789')
    expect(result.status).toBe('network_error')
  })

  it('sends no custom headers — a non-simple header forces a CORS preflight that Open Food Facts rejects', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ product: { code: '123456789' } }))
    vi.stubGlobal('fetch', fetchMock)
    await fetchProductByBarcode('123456789')
    const [, init] = fetchMock.mock.calls[0]
    expect(init).toBeUndefined()
  })

  it('retries once on a 5xx and succeeds if the retry returns ok', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({}, false, 503))
      .mockResolvedValueOnce(jsonResponse({ product: { code: '123456789' } }))
    vi.stubGlobal('fetch', fetchMock)
    const result = await fetchProductByBarcode('123456789')
    expect(result.status).toBe('ok')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not retry on a 4xx', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}, false, 404))
    vi.stubGlobal('fetch', fetchMock)
    await fetchProductByBarcode('123456789')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('retries when fetch() itself rejects (e.g. a browser-level CORS block on an error response missing Access-Control-Allow-Origin) and succeeds if a retry resolves', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('NetworkError when attempting to fetch resource.'))
      .mockResolvedValueOnce(jsonResponse({ product: { code: '123456789' } }))
    vi.stubGlobal('fetch', fetchMock)
    const result = await fetchProductByBarcode('123456789')
    expect(result.status).toBe('ok')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('gives up as network_error after exhausting retries on persistent rejection', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('NetworkError when attempting to fetch resource.'))
    vi.stubGlobal('fetch', fetchMock)
    const result = await fetchProductByBarcode('123456789')
    expect(result.status).toBe('network_error')
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
})

describe('searchProductsByName', () => {
  it('returns an empty ok result for a blank query without calling fetch', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const result = await searchProductsByName('   ')
    expect(result).toEqual({ status: 'ok', data: [] })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns matching products on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ products: [{ code: '1' }, { code: '2' }] })),
    )
    const result = await searchProductsByName('white bread')
    expect(result.status).toBe('ok')
    if (result.status === 'ok') expect(result.data).toHaveLength(2)
  })

  it('filters out malformed entries from a partial search response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ products: [{ code: '1' }, { notAProduct: true }, null] })),
    )
    const result = await searchProductsByName('white bread')
    expect(result.status).toBe('ok')
    if (result.status === 'ok') expect(result.data).toEqual([{ code: '1' }])
  })

  it('degrades to an empty list rather than throwing when products is missing entirely', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({})))
    const result = await searchProductsByName('white bread')
    expect(result.status).toBe('ok')
    if (result.status === 'ok') expect(result.data).toEqual([])
  })
})

describe('rate limiting', () => {
  it('queues and eventually succeeds rather than immediately failing on a small burst', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ product: { code: '1' } })))
    // search bucket capacity is 10/min — 10 distinct (uncached) queries should all resolve ok.
    const results = await Promise.all(
      Array.from({ length: 10 }, (_, i) => searchProductsByName(`product ${i}`)),
    )
    expect(results.every((r) => r.status === 'ok')).toBe(true)
  })
})
