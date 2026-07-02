import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

import type { INutrients } from '@/types/interfaces'
import { useDailyMealsStore } from './dailyMeals'

const MIN_PERCENTAGE = 85
const MAX_PERCENTAGE = 115
const MAX_DIFF = 15

export const useNutritionStore = defineStore('nutrition', () => {
  const selectedDate = ref<string>('')

  const targetNutrientsWeight = ref({
    proteins: 0,
    fats: 0,
    carbohydrates: 0,
    calories: 0
  })

  const dailyMeals = useDailyMealsStore()

  const {
    totalNutrientsByDate,
  } = storeToRefs(dailyMeals)

  const {
    setSelectedDate: setDailyMealsSelectedDate
  } = dailyMeals

  const setSelectedDate = (date: string) => {
    selectedDate.value = date
    setDailyMealsSelectedDate(date)
  }

  const updateTarget = (params: INutrients) => {
    targetNutrientsWeight.value = params
  }

  const totalTargetWeight = computed(() => {
    return Object.entries(targetNutrientsWeight.value).reduce((acc, [ key, value ]) => {
      if (key !== 'calories') {
        return acc + value
      } else {
        return acc
      }
    }, 0)
  })

  const targetNutrientsFromTotalWeight = computed(() => {
    return {
      proteins: totalFactWeight.value > 0
        ? Math.round(targetNutrientsWeight.value.proteins / totalFactWeight.value * 100)
        : 0,
      fats: totalTargetWeight.value > 0
        ? Math.round(targetNutrientsWeight.value.fats / totalTargetWeight.value * 100)
        : 0,
      carbohydrates: totalTargetWeight.value > 0
        ? Math.round(targetNutrientsWeight.value.carbohydrates / totalTargetWeight.value * 100)
        : 0
    }
  })

  const totalFactWeight = computed(() => {
    return Object.entries(totalNutrientsByDate.value).reduce((acc, [ key, value ]) => {
      if (key !== 'calories' && key !== 'weight') {
        return acc + Number(value ?? 0)
      } else {
        return acc
      }
    }, 0)
  })

  const factNutrients = computed(() => {
    const proteinsFactWeight = Number(totalNutrientsByDate.value?.proteins ?? 0)
    const fatsFactWeight = Number(totalNutrientsByDate.value?.fats ?? 0)
    const carbohydratesFactWeight = Number(totalNutrientsByDate.value?.carbohydrates ?? 0)

    const proteinsFactFromTotal = totalFactWeight.value > 0
      ? proteinsFactWeight / totalFactWeight.value * 100
      : 0
    const fatsFactFromTotal = totalFactWeight.value > 0
      ? fatsFactWeight / totalFactWeight.value * 100
      : 0
    const carbohydratesFactFromTotal = totalFactWeight.value > 0
      ? carbohydratesFactWeight / totalFactWeight.value * 100
      : 0

    const proteinsTargetFromTotal = targetNutrientsFromTotalWeight.value.proteins
    const fatsTargetFromTotal = targetNutrientsFromTotalWeight.value.fats
    const carbohydratesTargetFromTotal = targetNutrientsFromTotalWeight.value.carbohydrates

    const proteinsDiff = Math.abs(proteinsTargetFromTotal - proteinsFactFromTotal)
    const fatsDiff = Math.abs(fatsTargetFromTotal - fatsFactFromTotal)
    const carbohydratesDiff = Math.abs(carbohydratesTargetFromTotal - carbohydratesFactFromTotal)

    const proteinsPercentDiff = proteinsDiff / proteinsTargetFromTotal * 100
    const fatsPercentDiff = fatsDiff / fatsTargetFromTotal * 100
    const carbohydratesPercentDiff = carbohydratesDiff / carbohydratesTargetFromTotal * 100

    return {
      proteins: {
        title: 'Белки',
        value: totalNutrientsByDate.value?.proteins ?? 0,
        percentFromTargetValue: targetNutrientsWeight.value.proteins > 0
          ? (proteinsFactWeight / targetNutrientsWeight.value.proteins * 100).toFixed(1)
          : 0,
        percentFromTotalWeight: proteinsFactFromTotal.toFixed(1),
        isBalancedByTotalWeight: proteinsPercentDiff <= MAX_DIFF
      },
      fats: {
        title: 'Жиры',
        value: totalNutrientsByDate.value?.fats ?? 0,
        percentFromTargetValue: targetNutrientsWeight.value.fats > 0
          ? (fatsFactWeight / targetNutrientsWeight.value.fats * 100).toFixed(1)
          : 0,
        percentFromTotalWeight: fatsFactFromTotal.toFixed(1),
        isBalancedByTotalWeight: fatsPercentDiff <= MAX_DIFF
      },
      carbohydrates: {
        title: 'Углеводы',
        value: totalNutrientsByDate.value?.carbohydrates ?? 0,
        percentFromTargetValue: targetNutrientsWeight.value.carbohydrates > 0
          ? (carbohydratesFactWeight / targetNutrientsWeight.value.carbohydrates * 100).toFixed(1)
          : 0,
        percentFromTotalWeight: carbohydratesFactFromTotal.toFixed(1),
        isBalancedByTotalWeight: carbohydratesPercentDiff <= MAX_DIFF
      }
    }
  })

  const factTotal = computed(() => {
    return {
      ...factNutrients.value,
      calories: {
        title: 'Килокалории',
        value: totalNutrientsByDate.value?.calories ?? 0,
        percentFromTargetValue: targetNutrientsWeight.value.calories > 0
          ? (Number(totalNutrientsByDate.value?.calories ?? 0) / targetNutrientsWeight.value.calories * 100).toFixed(1)
          : 0
      }
    }
  })

  const maxFactPercentage = computed(() => {
    return Math.max(...Object.values(factNutrients.value).map(item => Number(item.percentFromTargetValue)), 100)
  })

  const isNutrientsBalancedByTarget = computed(() => {
    return Object.values(factTotal.value)?.every(item =>
      Number(item.percentFromTargetValue) >= MIN_PERCENTAGE && Number(item.percentFromTargetValue) <= MAX_PERCENTAGE
    )
  })

  return {
    targetNutrientsWeight,
    factNutrients,
    factTotal,
    maxFactPercentage,
    isNutrientsBalancedByTarget,
    setSelectedDate,
    updateTarget
  }
}, {
  persist: true
})
