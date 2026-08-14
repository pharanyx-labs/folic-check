export type SafeFoodStatus = 'safe' | 'risky' | 'check_label'

export type SafeFoodCategory =
  | 'fresh_produce'
  | 'meat_fish'
  | 'dairy_eggs'
  | 'fats_oils'
  | 'safe_grains'
  | 'safe_flours'
  | 'risky_bakery'
  | 'risky_cereals'
  | 'risky_ready_meals'
  | 'risky_flours'

export interface SafeFoodEntry {
  id: string
  name: string
  category: SafeFoodCategory
  status: SafeFoodStatus
  note: string
  /** ids of `risky`/`check_label` entries this item is a reasonable substitute for. */
  substituteFor?: string[]
}

export const CATEGORY_LABELS: Record<SafeFoodCategory, string> = {
  fresh_produce: 'Fresh fruit & vegetables',
  meat_fish: 'Meat & fish',
  dairy_eggs: 'Dairy & eggs',
  fats_oils: 'Fats & oils',
  safe_grains: 'Safe grains',
  safe_flours: 'Safe flours & baking staples',
  risky_bakery: 'Bakery (likely fortified)',
  risky_cereals: 'Cereals (likely fortified)',
  risky_ready_meals: 'Ready meals & processed (check label)',
  risky_flours: 'Non-wholemeal wheat flours (likely fortified)',
}

export const safeFoodsData: SafeFoodEntry[] = [
  // Fresh produce — naturally safe whole foods
  { id: 'fresh-vegetables', name: 'Fresh vegetables (any)', category: 'fresh_produce', status: 'safe', note: 'No flour, no fortification.' },
  { id: 'fresh-fruit', name: 'Fresh fruit (any)', category: 'fresh_produce', status: 'safe', note: 'No flour, no fortification.' },
  { id: 'potatoes', name: 'Potatoes', category: 'fresh_produce', status: 'safe', note: 'Not a wheat product.' },
  { id: 'fresh-herbs', name: 'Fresh herbs & spices', category: 'fresh_produce', status: 'safe', note: 'No flour, no fortification.' },

  // Meat & fish
  { id: 'fresh-meat', name: 'Fresh/frozen unbreaded meat', category: 'meat_fish', status: 'safe', note: 'No flour unless breaded or coated — check breaded/battered versions separately.' },
  { id: 'fresh-fish', name: 'Fresh/frozen unbreaded fish', category: 'meat_fish', status: 'safe', note: 'No flour unless breaded, battered, or in a floured sauce.' },
  { id: 'eggs', name: 'Eggs', category: 'meat_fish', status: 'safe', note: 'No flour, no fortification.' },

  // Dairy & eggs
  { id: 'milk', name: 'Milk', category: 'dairy_eggs', status: 'safe', note: 'No flour, no fortification.' },
  { id: 'cheese', name: 'Cheese', category: 'dairy_eggs', status: 'safe', note: 'No flour, no fortification.' },
  { id: 'yoghurt', name: 'Plain yoghurt', category: 'dairy_eggs', status: 'safe', note: 'Check flavoured/granola varieties separately — added cereal pieces may be fortified.' },
  { id: 'butter', name: 'Butter', category: 'dairy_eggs', status: 'safe', note: 'No flour, no fortification.' },

  // Fats & oils
  { id: 'olive-oil', name: 'Olive oil & other cooking oils', category: 'fats_oils', status: 'safe', note: 'No flour, no fortification.' },
  { id: 'lard-suet', name: 'Lard, suet, ghee', category: 'fats_oils', status: 'safe', note: 'No flour, no fortification.' },

  // Safe grains
  { id: 'brown-rice', name: 'Rice (all types)', category: 'safe_grains', status: 'safe', note: 'Not wheat — exempt from this fortification rule.' },
  { id: 'quinoa', name: 'Quinoa', category: 'safe_grains', status: 'safe', note: 'Not wheat — exempt.' },
  { id: 'oats', name: 'Oats / porridge oats', category: 'safe_grains', status: 'safe', note: 'Not wheat — exempt. Check mixed-grain muesli separately.' },
  { id: 'buckwheat', name: 'Buckwheat', category: 'safe_grains', status: 'safe', note: 'Not wheat, despite the name — exempt.' },
  { id: 'polenta-cornmeal', name: 'Polenta / cornmeal', category: 'safe_grains', status: 'safe', note: 'Maize-based — exempt.' },

  // Safe flours & baking staples
  { id: 'wholemeal-wheat-flour', name: '100% wholemeal wheat flour', category: 'safe_flours', status: 'safe', note: 'Wholemeal wheat flour is explicitly exempt from the mandatory fortification rule.', substituteFor: ['plain-white-flour', 'self-raising-flour', 'white-sliced-bread'] },
  { id: 'rice-flour', name: 'Rice flour', category: 'safe_flours', status: 'safe', note: 'Not wheat — exempt.', substituteFor: ['plain-white-flour'] },
  { id: 'gluten-free-flour-blend', name: 'Gluten-free flour blends', category: 'safe_flours', status: 'safe', note: 'Usually rice/potato/tapioca-based — exempt, but always check the specific blend\'s ingredients.', substituteFor: ['plain-white-flour', 'self-raising-flour'] },
  { id: 'buckwheat-flour', name: 'Buckwheat flour', category: 'safe_flours', status: 'safe', note: 'Not wheat — exempt.', substituteFor: ['plain-white-flour'] },
  { id: 'gram-chickpea-flour', name: 'Gram (chickpea) flour', category: 'safe_flours', status: 'safe', note: 'Not wheat — exempt.', substituteFor: ['plain-white-flour'] },
  { id: 'ground-almonds', name: 'Ground almonds / almond flour', category: 'safe_flours', status: 'safe', note: 'Not wheat — exempt.', substituteFor: ['plain-white-flour'] },
  { id: 'cornflour', name: 'Cornflour', category: 'safe_flours', status: 'safe', note: 'Maize-based — exempt.', substituteFor: ['plain-white-flour'] },

  // Risky: non-wholemeal wheat flours
  { id: 'plain-white-flour', name: 'Plain white flour', category: 'risky_flours', status: 'risky', note: 'Non-wholemeal wheat flour — required to carry added folic acid once compliance is in force.' },
  { id: 'self-raising-flour', name: 'Self-raising flour', category: 'risky_flours', status: 'risky', note: 'Non-wholemeal wheat flour — required to carry added folic acid once compliance is in force.' },
  { id: 'strong-white-bread-flour', name: 'Strong white bread flour', category: 'risky_flours', status: 'risky', note: 'Non-wholemeal wheat flour — required to carry added folic acid once compliance is in force.' },
  { id: '00-pizza-flour', name: "'00' pizza/pasta flour", category: 'risky_flours', status: 'check_label', note: 'Usually a refined wheat flour — check for "fortified wheat flour" on imported vs UK-milled brands.' },

  // Risky: bakery
  { id: 'white-sliced-bread', name: 'White sliced bread', category: 'risky_bakery', status: 'risky', note: 'Standard non-wholemeal wheat flour product — look for "fortified wheat flour" on the ingredients list.' },
  { id: 'white-baguette', name: 'White baguettes & rolls', category: 'risky_bakery', status: 'risky', note: 'Non-wholemeal wheat flour product.' },
  { id: 'croissants', name: 'Croissants & pastries', category: 'risky_bakery', status: 'risky', note: 'Made with plain/strong wheat flour.' },
  { id: 'cakes-shop-bought', name: 'Shop-bought cakes', category: 'risky_bakery', status: 'risky', note: 'Typically made with plain white flour.' },
  { id: 'pizza-base-shop', name: 'Shop-bought pizza bases', category: 'risky_bakery', status: 'risky', note: 'Typically made with non-wholemeal wheat flour.' },
  { id: '100-percent-wholemeal-bread', name: '100% wholemeal bread', category: 'safe_flours', status: 'safe', note: 'Made entirely from wholemeal wheat flour — check the ingredients list states "wholemeal" only, with no plain/white flour blended in.', substituteFor: ['white-sliced-bread', 'white-baguette'] },

  // Risky: cereals
  { id: 'wheat-breakfast-cereal', name: 'Wheat-based breakfast cereals (non-wholegrain)', category: 'risky_cereals', status: 'risky', note: 'Many use non-wholemeal wheat flour/wheat products.' },
  { id: 'cream-crackers', name: 'Crackers & crispbreads (wheat-based)', category: 'risky_cereals', status: 'check_label', note: 'Ingredients vary widely — check for wholemeal vs plain wheat flour.' },

  // Risky: ready meals / processed
  { id: 'battered-fish', name: 'Battered or breaded fish/meat', category: 'risky_ready_meals', status: 'check_label', note: 'Batter/breadcrumb coatings are usually made with non-wholemeal wheat flour.' },
  { id: 'sauces-gravies-thickened', name: 'Roux-thickened sauces & gravies', category: 'risky_ready_meals', status: 'check_label', note: 'Often thickened with plain wheat flour — check ingredients.' },
  { id: 'pies-shop-bought', name: 'Shop-bought pies & pastries (savoury)', category: 'risky_ready_meals', status: 'risky', note: 'Pastry is typically made with plain/strong wheat flour.' },
]
