import { describe, expect, it } from 'vitest'
import { findAlternatives } from './findAlternatives'

describe('findAlternatives', () => {
  it('suggests bread substitutes for a bread product', () => {
    const results = findAlternatives('Tesco White Sliced Bread')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((r) => r.status === 'safe')).toBe(true)
  })

  it('falls back to general safe flour/grain suggestions for an unmatched product name', () => {
    const results = findAlternatives('Mystery Snack Bar')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((r) => r.category === 'safe_flours' || r.category === 'safe_grains')).toBe(true)
  })

  it('handles a null product name without throwing', () => {
    expect(() => findAlternatives(null)).not.toThrow()
  })

  it('respects the limit', () => {
    const results = findAlternatives('bread', 2)
    expect(results.length).toBeLessThanOrEqual(2)
  })
})
