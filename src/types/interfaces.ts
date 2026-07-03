export interface INutrients {
  proteins: number
  fats: number
  carbohydrates: number
  calories: number
}

export interface IProductParams extends INutrients {
  name: string
}

export interface IProduct extends IProductParams {
  id: number
}

export interface IMealEntryParams {
  productId: number
  weight: number
  date: string
}

export interface IMealEntry extends IMealEntryParams {
  id: number
}

export interface INutrientData {
  title: string
  normValue: number
  value: number
  normCoverage: number
  hasDeviation: boolean
}
