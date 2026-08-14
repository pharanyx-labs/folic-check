import { lazy, Suspense, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isLikelyBarcode } from '../../api/openFoodFacts/client'
import { Button } from '../ui/Button'

// @zxing/browser is a sizeable dependency only needed once someone taps "Scan" —
// loaded on demand rather than in the main bundle.
const BarcodeScanner = lazy(() => import('./BarcodeScanner').then((m) => ({ default: m.BarcodeScanner })))

export function SearchBar({ autoFocus = false, initialValue = '' }: { autoFocus?: boolean; initialValue?: string }) {
  const [query, setQuery] = useState(initialValue)
  const [scannerOpen, setScannerOpen] = useState(false)
  const navigate = useNavigate()

  function submit(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return
    if (isLikelyBarcode(trimmed)) {
      navigate(`/product/${encodeURIComponent(trimmed)}`)
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(query)
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="product-search" className="sr-only">
          Product name or barcode
        </label>
        <input
          id="product-search"
          type="text"
          inputMode="search"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Product name or barcode…"
          className="w-full rounded-md border border-line bg-surface px-4 py-3.5 font-body text-base text-ink placeholder:text-ink-muted focus:border-brand"
        />
        <div className="flex gap-2">
          <Button type="submit" size="lg" className="flex-1 sm:flex-none">
            Check
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => setScannerOpen(true)}
            aria-label="Scan a barcode with your camera"
          >
            Scan
          </Button>
        </div>
      </form>
      {scannerOpen && (
        <Suspense fallback={null}>
          <BarcodeScanner
            onDetected={(barcode) => {
              setScannerOpen(false)
              setQuery(barcode)
              submit(barcode)
            }}
            onClose={() => setScannerOpen(false)}
          />
        </Suspense>
      )}
    </>
  )
}
