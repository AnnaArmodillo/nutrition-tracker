import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { IMealEntry, IMealEntryParams } from '@/types/interfaces'
import { useProductsStore } from './products'

const GRAMS_TO_HUNDRED_GRAMS = 0.01

export const useDailyMealsStore = defineStore('dailyMeals', () => {
  const entries = ref<IMealEntry[]>([])
  const selectedDate = ref<string>('')

  const selectedMealId = ref<number | undefined>(undefined)
  const selectedMealEntry = computed(() => {
    return entries.value.find((e) => e.id === selectedMealId.value)
  })

  const productsStore = useProductsStore()
  const { products } = storeToRefs(productsStore)

  const entriesByDate = computed(() => {
    return entries.value.filter((e) => e.date === selectedDate.value)
  })

  const entriesByDateWithNutrients = computed(() => {
    return entriesByDate.value.map((e) => {
      const product = products.value.find((p) => p.id === e.productId)
      if (!product) return {
        id: e.id,
        name: '',
        weight: 0,
        proteins: 0,
        fats: 0,
        carbohydrates: 0,
        calories: 0
      }
      return {
        id: e.id,
        name: product.name,
        weight: e.weight.toFixed(1),
        proteins: (product.proteins * e.weight * GRAMS_TO_HUNDRED_GRAMS).toFixed(1),
        fats: (product.fats * e.weight * GRAMS_TO_HUNDRED_GRAMS).toFixed(1),
        carbohydrates: (product.carbohydrates * e.weight * GRAMS_TO_HUNDRED_GRAMS).toFixed(1),
        calories: (product.calories * e.weight * GRAMS_TO_HUNDRED_GRAMS).toFixed(0)
      }
    })
  })

  const totalNutrientsByDate = computed(() => {
    const total = entriesByDateWithNutrients.value.reduce((acc, e) => {
      acc.weight += Number(e.weight)
      acc.proteins += Number(e.proteins)
      acc.fats += Number(e.fats)
      acc.carbohydrates += Number(e.carbohydrates)
      acc.calories += Number(e.calories)
      return acc
    }, {
      weight: 0,
      proteins: 0,
      fats: 0,
      carbohydrates: 0,
      calories: 0
    })
    return {
      weight: total.weight.toFixed(1),
      proteins: total.proteins.toFixed(1),
      fats: total.fats.toFixed(1),
      carbohydrates: total.carbohydrates.toFixed(1),
      calories: total.calories.toFixed(0)
    }
  })

  const addEntry = (params: Omit<IMealEntryParams, 'date'>) => {
    const newProduct = {
      ...params,
      id: Date.now() + Math.random(),
      date: selectedDate.value
    }
    entries.value = [ ...entries.value, newProduct ]
  }

  const editEntry = (entry: IMealEntry) => {
    const index = entries.value.findIndex(e => e.id === entry.id)
    if (index === -1) {
      return
    }
    entries.value = entries.value.map((e) => e.id === entry.id ? { ...entry } : e)
  }

  const removeEntry = (id: number) => {
    entries.value = entries.value.filter((e) => e.id !== id)
  }

  const setSelectedDate = (date: string) => {
    selectedDate.value = date
  }

  const selectEntry = (id: number) => {
    selectedMealId.value = id
  }

  const unselectEntry = () => {
    selectedMealId.value = undefined
  }

  return {
    entries,
    entriesByDateWithNutrients,
    totalNutrientsByDate,
    selectedMealEntry,
    addEntry,
    editEntry,
    removeEntry,
    setSelectedDate,
    selectEntry,
    unselectEntry
  }
}, {
  persist: true
})
