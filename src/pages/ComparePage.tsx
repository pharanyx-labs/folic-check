import { useState, type FormEvent } from 'react'
import { fetchProductByBarcode, isLikelyBarcode, searchProductsByName } from '../api/openFoodFacts/client'
import type { OFFProduct } from '../api/openFoodFacts/types'
import { ProductReportCard } from '../components/report/ProductReportCard'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Spinner } from '../components/ui/Spinner'

function CompareSlot({ label }: { label: string }) {
  const [query, setQuery] = useState('')
  const [product, setProduct] = useState<OFFProduct | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    setStatus('loading')
    setProduct(null)

    if (isLikelyBarcode(trimmed)) {
      const result = await fetchProductByBarcode(trimmed)
      if (result.status === 'ok') {
        setProduct(result.data)
        setStatus('idle')
      } else {
        setStatus('error')
      }
      return
    }

    const result = await searchProductsByName(trimmed)
    if (result.status === 'ok' && result.data.length > 0) {
      setProduct(result.data[0])
      setStatus('idle')
    } else {
      setStatus('error')
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <label className="sr-only" htmlFor={`compare-${label}`}>
          {label}
        </label>
        <input
          id={`compare-${label}`}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`${label}: name or barcode`}
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand"
        />
        <Button type="submit" size="sm">
          Find
        </Button>
      </form>
      <div className="mt-4">
        {status === 'loading' && <Spinner label="Looking up…" />}
        {status === 'error' && <p className="text-sm text-status-contains">Couldn&apos;t find that product.</p>}
        {product && <ProductReportCard product={product} />}
      </div>
    </div>
  )
}

export function ComparePage() {
  return (
    <Container className="py-10">
      <h1 className="font-display text-xl font-semibold text-ink">Compare two products</h1>
      <p className="mt-1 text-sm text-ink-muted">Look up two products side by side by name or barcode.</p>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <CompareSlot label="Product A" />
        <CompareSlot label="Product B" />
      </div>
    </Container>
  )
}
