import { useMemo, useState } from 'react'
import { FoodListFilters, type FoodListFiltersValue } from '../components/safeFoods/FoodListFilters'
import { FoodListTable } from '../components/safeFoods/FoodListTable'
import { Container } from '../components/ui/Container'
import { safeFoodsData } from '../domain/safeFoods/safeFoodsData'

export function SafeFoodsBrowserPage() {
  const [filters, setFilters] = useState<FoodListFiltersValue>({ query: '', category: 'all', status: 'all' })

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    return safeFoodsData.filter((entry) => {
      if (filters.category !== 'all' && entry.category !== filters.category) return false
      if (filters.status !== 'all' && entry.status !== filters.status) return false
      if (q && !entry.name.toLowerCase().includes(q) && !entry.note.toLowerCase().includes(q)) return false
      return true
    })
  }, [filters])

  return (
    <Container className="py-10">
      <h1 className="font-display text-xl font-semibold text-ink">Safe foods browser</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-muted">
        A curated reference of naturally safe whole foods, safe flours/grains, and likely-fortified categories.
        Always cross-check against a specific product&apos;s own ingredients list where possible — this list is a
        general guide, not a per-product guarantee.
      </p>
      <div className="mt-6">
        <FoodListFilters value={filters} onChange={setFilters} />
      </div>
      <div className="mt-4">
        <FoodListTable entries={filtered} />
      </div>
    </Container>
  )
}
