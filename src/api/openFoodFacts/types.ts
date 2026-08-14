/** Subset of the Open Food Facts product shape this app actually reads. */
export interface OFFProduct {
  code: string
  product_name?: string
  brands?: string
  ingredients_text?: string
  ingredients_tags?: string[]
  categories_tags?: string[]
  additives_tags?: string[]
  countries_tags?: string[]
  image_front_url?: string
  quantity?: string
}

export interface OFFProductApiResponse {
  status?: number | string
  product?: unknown
}

export interface OFFSearchApiResponse {
  products?: unknown
  count?: number
  page?: number
  page_size?: number
}

export type OFFClientResult<T> =
  | { status: 'ok'; data: T }
  | { status: 'not_found' }
  | { status: 'rate_limited' }
  | { status: 'network_error'; message: string }
