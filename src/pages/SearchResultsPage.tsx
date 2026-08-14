import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchProductsByName } from '../api/openFoodFacts/client'
import type { OFFClientResult, OFFProduct } from '../api/openFoodFacts/types'
import { SearchBar } from '../components/search/SearchBar'
import { SearchResultsList } from '../components/search/SearchResultsList'
import { Container } from '../components/ui/Container'
import { Spinner } from '../components/ui/Spinner'

export function SearchResultsPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const [result, setResult] = useState<OFFClientResult<OFFProduct[]> | null>(null)

  useEffect(() => {
    let cancelled = false
    setResult(null)
    if (!q.trim()) {
      setResult({ status: 'ok', data: [] })
      return
    }
    searchProductsByName(q).then((r) => {
      if (!cancelled) setResult(r)
    })
    return () => {
      cancelled = true
    }
  }, [q])

  return (
    <Container className="py-10">
      <h1 className="font-display text-xl font-semibold text-ink">Results for &ldquo;{q}&rdquo;</h1>
      <div className="mt-4 max-w-2xl">
        <SearchBar initialValue={q} />
      </div>
      <div className="mt-6">
        {result === null && <Spinner label="Searching Open Food Facts…" />}
        {result?.status === 'ok' && <SearchResultsList products={result.data} />}
        {result?.status === 'rate_limited' && (
          <p className="text-sm text-status-contains">Too many requests right now — please wait a moment and try again.</p>
        )}
        {result?.status === 'network_error' && (
          <p className="text-sm text-status-contains">Couldn&apos;t reach Open Food Facts: {result.message}</p>
        )}
      </div>
    </Container>
  )
}
