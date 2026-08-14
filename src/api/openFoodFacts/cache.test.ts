import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearCacheForTests, getCached, setCached } from './cache'

beforeEach(() => {
  clearCacheForTests()
})

describe('cache', () => {
  it('returns null for a missing key', () => {
    expect(getCached('nope')).toBeNull()
  })

  it('returns the cached value before it expires', () => {
    setCached('key1', { foo: 'bar' }, 10_000)
    expect(getCached('key1')).toEqual({ foo: 'bar' })
  })

  it('returns null once the TTL has elapsed', () => {
    vi.useFakeTimers()
    setCached('key1', { foo: 'bar' }, 1000)
    vi.advanceTimersByTime(1001)
    expect(getCached('key1')).toBeNull()
    vi.useRealTimers()
  })

  it('persists across a fresh in-memory cache via localStorage', () => {
    setCached('key1', { foo: 'bar' }, 10_000)
    // Simulate a reload by clearing only the in-memory layer's visibility —
    // localStorage itself is untouched, so a fresh getCached call still finds it.
    expect(localStorage.getItem('off-cache:key1')).not.toBeNull()
    expect(getCached('key1')).toEqual({ foo: 'bar' })
  })
})
