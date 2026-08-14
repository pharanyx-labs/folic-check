import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProductByBarcode } from '../api/openFoodFacts/client'
import type { OFFClientResult, OFFProduct } from '../api/openFoodFacts/types'
import { ProductReportCard } from '../components/report/ProductReportCard'
import { Container } from '../components/ui/Container'
import { Spinner } from '../components/ui/Spinner'

export function ProductReportPage() {
  const { code } = useParams<{ code: string }>()
  const [result, setResult] = useState<OFFClientResult<OFFProduct> | null>(null)

  useEffect(() => {
    let cancelled = false
    setResult(null)
    if (!code) return
    fetchProductByBarcode(code).then((r) => {
      if (!cancelled) setResult(r)
    })
    return () => {
      cancelled = true
    }
  }, [code])

  return (
    <Container className="py-10">
      {result === null && <Spinner label="Looking up product…" />}
      {result?.status === 'ok' && <ProductReportCard product={result.data} />}
      {result?.status === 'not_found' && (
        <p className="text-sm text-ink-muted">
          We couldn&apos;t find barcode {code} on Open Food Facts yet. You can{' '}
          <a
            className="text-brand hover:underline"
            href={`https://world.openfoodfacts.org/cgi/product.pl?type=add&code=${code}`}
            target="_blank"
            rel="noreferrer"
          >
            add it
          </a>{' '}
          to help future shoppers, or check the physical label directly.
        </p>
      )}
      {result?.status === 'rate_limited' && (
        <p className="text-sm text-status-contains">Too many requests right now — please wait a moment and try again.</p>
      )}
      {result?.status === 'network_error' && (
        <p className="text-sm text-status-contains">Couldn&apos;t reach Open Food Facts: {result.message}</p>
      )}
    </Container>
  )
}
