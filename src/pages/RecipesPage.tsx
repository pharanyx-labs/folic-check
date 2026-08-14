import { useState } from 'react'
import { StatusBadge } from '../components/report/StatusBadge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { classify } from '../domain/classifier/folicAcidClassifier'
import { aggregateRecipeRisk, type RecipeIngredientResult } from '../domain/recipes/recipeRisk'

export function RecipesPage() {
  const [ingredients, setIngredients] = useState<string[]>([''])

  function updateIngredient(i: number, value: string) {
    setIngredients((prev) => prev.map((item, idx) => (idx === i ? value : item)))
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, ''])
  }

  function removeIngredient(i: number) {
    setIngredients((prev) => prev.filter((_, idx) => idx !== i))
  }

  const results: RecipeIngredientResult[] = ingredients
    .filter((line) => line.trim())
    .map((line) => ({
      ingredientName: line.trim(),
      classification: classify({
        productName: null,
        ingredientsText: line,
        ingredientsTags: [],
        categoriesTags: [],
        additivesTags: [],
        countriesTags: ['en:united-kingdom'],
      }),
    }))

  const risk = aggregateRecipeRisk(results)

  return (
    <Container className="py-10">
      <Eyebrow>Meal planner</Eyebrow>
      <h1 className="font-display text-2xl font-semibold text-ink">Recipe risk checker</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        List a recipe&apos;s ingredients (one per line, as you&apos;d write them on a shopping list) to get an
        aggregate verdict for the whole dish. Ingredients are read as-written — this doesn&apos;t look up branded
        products, so try wording like &ldquo;plain flour&rdquo; or &ldquo;wholemeal flour&rdquo; rather than a brand name.
      </p>

      <div className="mt-6 space-y-2">
        {ingredients.map((ingredient, i) => (
          <div key={i} className="flex gap-2">
            <label className="sr-only" htmlFor={`ingredient-${i}`}>
              Ingredient {i + 1}
            </label>
            <input
              id={`ingredient-${i}`}
              type="text"
              value={ingredient}
              onChange={(e) => updateIngredient(i, e.target.value)}
              placeholder="e.g. plain flour"
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand"
            />
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(i)}
                className="text-ink-muted hover:text-status-contains"
                aria-label={`Remove ingredient ${i + 1}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <Button variant="secondary" size="sm" onClick={addIngredient}>
          + Add ingredient
        </Button>
      </div>

      {results.length > 0 && (
        <Card className="mt-8">
          <div className="flex items-center gap-3">
            <StatusBadge status={risk.status} />
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-muted">{risk.confidence} confidence</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink">{risk.explanation}</p>
        </Card>
      )}
    </Container>
  )
}
