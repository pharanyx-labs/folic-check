import { RATE_LIMITS } from './config'
import { TokenBucket } from './tokenBucket'

export type EndpointClass = keyof typeof RATE_LIMITS

const buckets: Record<EndpointClass, TokenBucket> = {
  product: new TokenBucket(RATE_LIMITS.product.capacity, RATE_LIMITS.product.windowMs / RATE_LIMITS.product.capacity),
  search: new TokenBucket(RATE_LIMITS.search.capacity, RATE_LIMITS.search.windowMs / RATE_LIMITS.search.capacity),
}

const queueDepth: Record<EndpointClass, number> = { product: 0, search: 0 }
const MAX_QUEUE_DEPTH = 5

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Resolves once a token is available, waiting (queueing) briefly for a token to refill
 * rather than failing immediately. Only reports true rate-limiting once the queue
 * itself is already deep, so the UI can show "please wait a moment" instead of an
 * error on every burst of clicks.
 */
export async function acquireToken(endpoint: EndpointClass): Promise<boolean> {
  const bucket = buckets[endpoint]
  if (bucket.tryTake()) return true

  if (queueDepth[endpoint] >= MAX_QUEUE_DEPTH) return false

  queueDepth[endpoint] += 1
  try {
    // Bounded retry loop — bail out rather than waiting forever if something's wrong.
    for (let attempt = 0; attempt < 20; attempt += 1) {
      await delay(Math.max(50, bucket.msUntilNextToken))
      if (bucket.tryTake()) return true
    }
    return false
  } finally {
    queueDepth[endpoint] -= 1
  }
}

export function resetRateLimiterForTests(): void {
  buckets.product = new TokenBucket(RATE_LIMITS.product.capacity, RATE_LIMITS.product.windowMs / RATE_LIMITS.product.capacity)
  buckets.search = new TokenBucket(RATE_LIMITS.search.capacity, RATE_LIMITS.search.windowMs / RATE_LIMITS.search.capacity)
  queueDepth.product = 0
  queueDepth.search = 0
}
