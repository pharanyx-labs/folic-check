/**
 * Pure, clock-injectable token bucket — no timers, no async. The async
 * queueing/waiting behavior lives in rateLimiter.ts, which wraps this for real use;
 * keeping this class pure makes it trivially fast and deterministic to unit test.
 */
export class TokenBucket {
  private readonly capacity: number
  private readonly refillIntervalMs: number
  private readonly now: () => number
  private tokens: number
  private lastRefill: number

  constructor(capacity: number, refillIntervalMs: number, now: () => number = Date.now) {
    this.capacity = capacity
    this.refillIntervalMs = refillIntervalMs
    this.now = now
    this.tokens = capacity
    this.lastRefill = now()
  }

  private refill(): void {
    const elapsed = this.now() - this.lastRefill
    if (elapsed <= 0) return
    const tokensToAdd = Math.floor(elapsed / this.refillIntervalMs)
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd)
      this.lastRefill += tokensToAdd * this.refillIntervalMs
    }
  }

  tryTake(): boolean {
    this.refill()
    if (this.tokens > 0) {
      this.tokens -= 1
      return true
    }
    return false
  }

  get availableTokens(): number {
    this.refill()
    return this.tokens
  }

  get msUntilNextToken(): number {
    this.refill()
    if (this.tokens > 0) return 0
    return this.refillIntervalMs - ((this.now() - this.lastRefill) % this.refillIntervalMs)
  }
}
