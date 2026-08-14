import type { ClassifierInput } from '../../domain/classifier/types'
import type { OFFProduct } from './types'

export function toClassifierInput(product: OFFProduct): ClassifierInput {
  return {
    productName: product.product_name ?? null,
    ingredientsText: product.ingredients_text ?? null,
    ingredientsTags: product.ingredients_tags ?? [],
    categoriesTags: product.categories_tags ?? [],
    additivesTags: product.additives_tags ?? [],
    countriesTags: product.countries_tags ?? [],
  }
}
