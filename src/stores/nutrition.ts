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
    return Object.entries(totalNutrientsByDate.value ?? {}).reduce((acc, [ key, value ]) => {
      if (key !== 'calories' && key !== 'weight') {
        return acc + Number(value ?? 0)
      } else {
        return acc
      }
    }, 0)
  })

  const factNutrients = computed(() => {
    if (!totalNutrientsByDate.value) {
      return null
    }

    // нормы потребления нутриентов
    const proteinsNorm = dailyNorm.value.proteins
    const fatsNorm = dailyNorm.value.fats
    const carbohydratesNorm = dailyNorm.value.carbohydrates

    // фактический вес потребленных нутриентов
    const proteinsFactWeight = Number(totalNutrientsByDate.value?.proteins ?? 0)
    const fatsFactWeight = Number(totalNutrientsByDate.value?.fats ?? 0)
    const carbohydratesFactWeight = Number(totalNutrientsByDate.value?.carbohydrates ?? 0)

    // фактическое потребление от нормы
    const proteinsNormCoverage = proteinsNorm > 0 ? proteinsFactWeight / proteinsNorm * 100 : 0
    const fatsNormCoverage = fatsNorm > 0 ? fatsFactWeight / fatsNorm * 100 : 0
    const carbohydratesNormCoverage = carbohydratesNorm > 0 ? carbohydratesFactWeight / carbohydratesNorm * 100 : 0

    // процент потребленных нутриентов от общего веса
    const proteinsFactFromTotal = totalFactWeight.value > 0
      ? proteinsFactWeight / totalFactWeight.value * 100
      : 0
    const fatsFactFromTotal = totalFactWeight.value > 0
      ? fatsFactWeight / totalFactWeight.value * 100
      : 0
    const carbohydratesFactFromTotal = totalFactWeight.value > 0
      ? carbohydratesFactWeight / totalFactWeight.value * 100
      : 0

    // нормальный % потребления нутриентов от общего веса
    const proteinsNormFromTotal = nutrientsNormFromTotalWeight.value.proteins
    const fatsNormFromTotal = nutrientsNormFromTotalWeight.value.fats
    const carbohydratesNormFromTotal = nutrientsNormFromTotalWeight.value.carbohydrates

    // разница долей нутриентов между нормой и фактом
    const proteinsDiff = Math.abs(proteinsNormFromTotal - proteinsFactFromTotal)
    const fatsDiff = Math.abs(fatsNormFromTotal - fatsFactFromTotal)
    const carbohydratesDiff = Math.abs(carbohydratesNormFromTotal - carbohydratesFactFromTotal)

    // отклонение разницы долей нутриентов от нормы в %
    const proteinsPercentDiff = proteinsDiff / proteinsNormFromTotal * 100
    const fatsPercentDiff = fatsDiff / fatsNormFromTotal * 100
    const carbohydratesPercentDiff = carbohydratesDiff / carbohydratesNormFromTotal * 100

    return {
      proteins: {
        title: 'Белки',
        targetValue: proteinsNorm,
        value: totalNutrientsByDate.value?.proteins ?? 0,
        normCoverage: proteinsNormCoverage.toFixed(1),
        hasDeviation: proteinsNormCoverage <= MIN_NORM_COVERAGE || proteinsNormCoverage >= MAX_NORM_COVERAGE,
        isBalancedByTotalWeight: proteinsPercentDiff <= MAX_DIFF
      },
      fats: {
        title: 'Жиры',
        targetValue: fatsNorm,
        value: totalNutrientsByDate.value?.fats ?? 0,
        normCoverage: fatsNormCoverage.toFixed(1),
        hasDeviation: fatsNormCoverage <= MIN_NORM_COVERAGE || fatsNormCoverage >= MAX_NORM_COVERAGE,
        isBalancedByTotalWeight: fatsPercentDiff <= MAX_DIFF
      },
      carbohydrates: {
        title: 'Углеводы',
        targetValue: carbohydratesNorm,
        value: totalNutrientsByDate.value?.carbohydrates ?? 0,
        normCoverage: carbohydratesNormCoverage.toFixed(1),
        hasDeviation: carbohydratesNormCoverage <= MIN_NORM_COVERAGE || carbohydratesNormCoverage >= MAX_NORM_COVERAGE,
        isBalancedByTotalWeight: carbohydratesPercentDiff <= MAX_DIFF
      }
    }
  })

  const factTotal = computed(() => {
    if (!factNutrients.value) return null
    const caloriesNormCoverage = dailyNorm.value.calories > 0
      ? Number(totalNutrientsByDate.value?.calories ?? 0) / dailyNorm.value.calories * 100
      : 0
    return {
      ...factNutrients.value,
      calories: {
        title: 'Килокалории',
        targetValue: dailyNorm.value.calories,
        value: totalNutrientsByDate.value?.calories ?? 0,
        normCoverage: caloriesNormCoverage.toFixed(1),
        hasDeviation: caloriesNormCoverage <= MIN_NORM_COVERAGE || caloriesNormCoverage >= MAX_NORM_COVERAGE,
      }
    }
  })

  const maxFactNormCoverage = computed(() => {
    return Math.max(...Object.values(factNutrients.value ?? {}).map(item => Number(item.normCoverage)), 100)
  })

  const isNutrientsProgressBalanced = computed(() => {
    return Object.values(factTotal.value ?? {})?.every(item => !item.hasDeviation)
  })

  const isDailyDataExist = computed(() => {
    return !!totalNutrientsByDate.value
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
