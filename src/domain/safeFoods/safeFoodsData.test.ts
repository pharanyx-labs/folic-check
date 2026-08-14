import { describe, expect, it } from 'vitest'
import { CATEGORY_LABELS, safeFoodsData } from './safeFoodsData'

describe('safeFoodsData schema', () => {
  it('has no duplicate ids', () => {
    const ids = safeFoodsData.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every entry has required non-empty fields', () => {
    for (const entry of safeFoodsData) {
      expect(entry.id.length).toBeGreaterThan(0)
      expect(entry.name.length).toBeGreaterThan(0)
      expect(entry.note.length).toBeGreaterThan(0)
      expect(CATEGORY_LABELS[entry.category]).toBeDefined()
      expect(['safe', 'risky', 'check_label']).toContain(entry.status)
    }
  })

  it('every substituteFor id references an existing entry', () => {
    const ids = new Set(safeFoodsData.map((entry) => entry.id))
    for (const entry of safeFoodsData) {
      for (const subId of entry.substituteFor ?? []) {
        expect(ids.has(subId)).toBe(true)
      }
    }
  })

  it('substituteFor entries only point at non-safe (risky/check_label) items', () => {
    const byId = new Map(safeFoodsData.map((entry) => [entry.id, entry]))
    for (const entry of safeFoodsData) {
      for (const subId of entry.substituteFor ?? []) {
        expect(byId.get(subId)?.status).not.toBe('safe')
      }
    }
  })

  it('includes at least one entry per category', () => {
    for (const category of Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]) {
      const hasEntry = safeFoodsData.some((entry) => entry.category === category)
      expect(hasEntry).toBe(true)
    }
  })
})
