import { Link } from 'react-router-dom'
import { toClassifierInput } from '../../api/openFoodFacts/adapter'
import type { OFFProduct } from '../../api/openFoodFacts/types'
import { classify } from '../../domain/classifier/folicAcidClassifier'
import { StatusBadge } from '../report/StatusBadge'

export function SearchResultsList({ products }: { products: OFFProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-line px-4 py-6 text-center text-sm text-ink-muted">
        No products found for that search on Open Food Facts. Try a different name, or scan the barcode instead.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
      {products.map((product) => {
        const classification = classify(toClassifierInput(product))
        return (
          <li key={product.code}>
            <Link
              to={`/product/${encodeURIComponent(product.code)}`}
              className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-paper"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{product.product_name || 'Unnamed product'}</p>
                {product.brands && <p className="truncate text-sm text-ink-muted">{product.brands}</p>}
              </div>
              <StatusBadge status={classification.status} className="shrink-0" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
