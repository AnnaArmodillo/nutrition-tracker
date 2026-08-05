import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

import type { INutrients } from '@/types/interfaces'
import { useDailyMealsStore } from './dailyMeals'

const MIN_NORM_COVERAGE = 85
const MAX_NORM_COVERAGE = 115
const MAX_DIFF = 15

export const useNutritionStore = defineStore('nutrition', () => {
  const selectedDate = ref<string>('')

  const dailyNorm = ref({
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

  const updateDailyNorm = (params: INutrients) => {
    dailyNorm.value = params
  }

  const totalNormWeight = computed(() => {
    return Object.entries(dailyNorm.value).reduce((acc, [ key, value ]) => {
      if (key !== 'calories') {
        return acc + value
      } else {
        return acc
      }
    }, 0)
  })

  const nutrientsNormFromTotalWeight = computed(() => {
    return {
      proteins: totalFactWeight.value > 0
        ? Math.round(dailyNorm.value.proteins / totalFactWeight.value * 100)
        : 0,
      fats: totalNormWeight.value > 0
        ? Math.round(dailyNorm.value.fats / totalNormWeight.value * 100)
        : 0,
      carbohydrates: totalNormWeight.value > 0
        ? Math.round(dailyNorm.value.carbohydrates / totalNormWeight.value * 100)
        : 0
    }
  })

  const totalFactWeight = computed(() => {
    return Object.entries(totalNutrientsByDate.value).reduce((acc, [ key, value ]) => {
      if (key !== 'calories' && key !== 'weight') {
        return acc + Number(value)
      } else {
        return acc
      }
    }, 0)
  })

  const calculateNutrientData = (key: keyof Omit<INutrients, 'calories'>) => {
    // норма потребления нутриента
    const norm = dailyNorm.value[key]

    // вес фактически потребленного нутриента
    const factWeight = Number(totalNutrientsByDate.value?.[key])

    // фактическое потребление от нормы
    const normCoverage = norm > 0 ? factWeight / norm * 100 : 0

    // процент потребленного нутриента от общего веса
    const factFromTotal = totalFactWeight.value > 0
      ? factWeight / totalFactWeight.value * 100
      : 0

    // нормальный % потребления нутриентов от общего веса
    const normFromTotal = nutrientsNormFromTotalWeight.value[key]

    // разница доли нутриента между нормой и фактом
    const diff = Math.abs(normFromTotal - factFromTotal)

    // отклонение разницы доли нутриента от нормы в %
    const percentDiff = diff / normFromTotal * 100

    return {
      normValue: norm,
      value: factWeight,
      normCoverage: normCoverage,
      hasDeviation: normCoverage <= MIN_NORM_COVERAGE || normCoverage >= MAX_NORM_COVERAGE,
      isBalancedByTotalWeight: percentDiff <= MAX_DIFF
    }
  }

  const factNutrients = computed(() => {
    return {
      proteins: {
        title: 'Белки',
        ...calculateNutrientData('proteins')
      },
      fats: {
        title: 'Жиры',
        ...calculateNutrientData('fats')
      },
      carbohydrates: {
        title: 'Углеводы',
        ...calculateNutrientData('carbohydrates')
      }
    }
  })

  const factTotal = computed(() => {
    const caloriesNormCoverage = dailyNorm.value.calories > 0
      ? Number(totalNutrientsByDate.value?.calories) / dailyNorm.value.calories * 100
      : 0
    return {
      ...factNutrients.value,
      calories: {
        title: 'Калории',
        normValue: dailyNorm.value.calories,
        value: Number(totalNutrientsByDate.value?.calories),
        normCoverage: caloriesNormCoverage,
        hasDeviation: caloriesNormCoverage <= MIN_NORM_COVERAGE || caloriesNormCoverage >= MAX_NORM_COVERAGE,
      }
    }
  })

  const maxFactNormCoverage = computed(() => {
    return Math.max(...Object.values(factNutrients.value).map(item => Number(item.normCoverage)), 100)
  })

  const isNutrientsProgressBalanced = computed(() => {
    return Object.values(factTotal.value)?.every(item => !item.hasDeviation)
  })

  const isDailyDataExist = computed(() => {
    return Number(totalNutrientsByDate.value?.weight) > 0
  })

  return {
    dailyNorm,
    factNutrients,
    factTotal,
    maxFactNormCoverage,
    isNutrientsProgressBalanced,
    isDailyDataExist,
    setSelectedDate,
    updateDailyNorm
  }
}, {
  persist: true
})
