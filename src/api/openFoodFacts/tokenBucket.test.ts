import { describe, expect, it } from 'vitest'
import { TokenBucket } from './tokenBucket'

describe('TokenBucket', () => {
  it('allows up to `capacity` immediate takes, then denies', () => {
    const bucket = new TokenBucket(3, 1000, () => 0)
    expect(bucket.tryTake()).toBe(true)
    expect(bucket.tryTake()).toBe(true)
    expect(bucket.tryTake()).toBe(true)
    expect(bucket.tryTake()).toBe(false)
  })

  it('refills tokens over time based on the injected clock', () => {
    let time = 0
    const bucket = new TokenBucket(2, 1000, () => time)
    expect(bucket.tryTake()).toBe(true)
    expect(bucket.tryTake()).toBe(true)
    expect(bucket.tryTake()).toBe(false)

    time = 1000
    expect(bucket.tryTake()).toBe(true)
    expect(bucket.tryTake()).toBe(false)
  })

  it('never exceeds capacity even after a long idle period', () => {
    let time = 0
    const bucket = new TokenBucket(2, 1000, () => time)
    time = 1_000_000
    expect(bucket.availableTokens).toBe(2)
  })

  it('reports msUntilNextToken as 0 when a token is available', () => {
    const bucket = new TokenBucket(1, 1000, () => 0)
    expect(bucket.msUntilNextToken).toBe(0)
  })

  it('reports a positive msUntilNextToken once exhausted', () => {
    let time = 0
    const bucket = new TokenBucket(1, 1000, () => time)
    bucket.tryTake()
    time = 400
    expect(bucket.msUntilNextToken).toBeGreaterThan(0)
    expect(bucket.msUntilNextToken).toBeLessThanOrEqual(1000)
  })
})
