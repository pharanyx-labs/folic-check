import { useState } from 'react'
import { toClassifierInput } from '../../api/openFoodFacts/adapter'
import type { OFFProduct } from '../../api/openFoodFacts/types'
import { classify } from '../../domain/classifier/folicAcidClassifier'
import { estimateIntake } from '../../domain/intake/intakeCalculator'
import { useIntakeLog } from '../../state/IntakeLogContext'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { AlternativesPanel } from './AlternativesPanel'
import { DisclaimerBanner } from '../layout/DisclaimerBanner'
import { EvidencePanel } from './EvidencePanel'
import { PersonalizedGuidance } from './PersonalizedGuidance'
import { ShareReportButton } from './ShareReportButton'
import { StatusStamp } from './StatusStamp'

export function ProductReportCard({ product }: { product: OFFProduct }) {
  const classification = classify(toClassifierInput(product))
  const { addEntry } = useIntakeLog()
  const [weightGrams, setWeightGrams] = useState(100)
  const [logged, setLogged] = useState(false)

  const estimate = estimateIntake({ classification, productWeightGrams: weightGrams })
  const showFlourFortificationNotice = classification.status === 'contains_folic_acid' || classification.status === 'likely_fortified'

  function handleLog() {
    addEntry({
      productName: product.product_name || 'Unnamed product',
      barcode: product.code,
      classificationStatus: classification.status,
      estimatedFolicAcidUg: estimate.estimatedFolicAcidUg,
      productWeightGrams: weightGrams,
    })
    setLogged(true)
    setTimeout(() => setLogged(false), 2500)
  }

  return (
    <div className="space-y-5" id="product-report">
      <Card className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
        <StatusStamp status={classification.status} confidence={classification.confidence} />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            {product.product_name || 'Unnamed product'}
          </h1>
          {product.brands && <p className="mt-0.5 text-sm text-ink-muted">{product.brands}</p>}
          {product.quantity && <p className="text-sm text-ink-muted">{product.quantity}</p>}
          <p className="mt-1 font-mono text-xs text-ink-muted">Barcode {product.code}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            <ShareReportButton />
            <Button
              variant="secondary"
              size="sm"
              className="no-print"
              onClick={() => window.open(`https://world.openfoodfacts.org/product/${product.code}/edit`, '_blank', 'noreferrer')}
            >
              Edit on Open Food Facts
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="no-print"
              onClick={() =>
                window.open(
                  `mailto:accounts@pharanyx.co.uk?subject=${encodeURIComponent(`Folic-Alert report issue: ${product.code}`)}`,
                  '_blank',
                )
              }
            >
              Report an issue
            </Button>
          </div>
        </div>
      </Card>

      <EvidencePanel classification={classification} />

      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.1em] text-ink-muted">Personalized guidance</p>
        <PersonalizedGuidance classification={classification} />
      </div>

      {showFlourFortificationNotice && (
        <Card className="no-print">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-muted">Log this to your daily tracker</p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <label className="text-sm text-ink-muted">
              Amount eaten (g)
              <input
                type="number"
                min={1}
                value={weightGrams}
                onChange={(e) => setWeightGrams(Number(e.target.value) || 0)}
                className="mt-1 block w-24 rounded-md border border-line bg-surface px-2 py-1.5 text-ink"
              />
            </label>
            <Button size="sm" onClick={handleLog}>
              {logged ? 'Logged ✓' : 'Add to tracker'}
            </Button>
          </div>
          {estimate.estimatedFolicAcidUg !== null && (
            <p className="mt-2 text-xs text-ink-muted">
              Estimated ~{estimate.estimatedFolicAcidUg} µg folic acid for this amount. {estimate.explanation}
            </p>
          )}
        </Card>
      )}

      {showFlourFortificationNotice && <AlternativesPanel productName={product.product_name ?? null} />}

      <DisclaimerBanner variant="inline" />
    </div>
  )
}
