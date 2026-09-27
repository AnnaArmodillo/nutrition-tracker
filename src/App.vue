<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useNutritionStore } from '@/stores/nutrition'
import { useProductsStore } from '@/stores/products'
import { useDailyMealsStore } from '@/stores/dailyMeals'
import { computed } from 'vue'

const nutritionStore = useNutritionStore()

const { loadDemoNorm, resetDailyNorm } = nutritionStore
const { dailyNorm } = storeToRefs(nutritionStore)

const productsStore = useProductsStore()

const { loadDemoProducts, resetProducts } = productsStore
const { products } = storeToRefs(productsStore)

const dailyMealsStore = useDailyMealsStore()
const { entries } = storeToRefs(dailyMealsStore)

const { loadDemoDailyMeals, resetEntries } = dailyMealsStore

const isDataEmpty = computed(() => {
  const areProductsEmpty = products.value.length === 0
  const areEntriesEmpty = entries.value.length === 0
  const isDailyNormEmpty = !dailyNorm.value.proteins
    || !dailyNorm.value.fats
    || !dailyNorm.value.carbohydrates
    || !dailyNorm.value.calories
  return areProductsEmpty || areEntriesEmpty || isDailyNormEmpty
})

const onClearData = () => {
  resetDailyNorm()
  resetProducts()
  resetEntries()
}

const onLoadDemoData = () => {
  // сброс всех данных
  onClearData()

  // заполнение дневной нормы
  loadDemoNorm()

  // заполнение списка продуктов
  loadDemoProducts()

  // заполнение списка потребленных продуктов на текущую дату
  loadDemoDailyMeals()
}
</script>

<template>
  <header>
    <div class="flex justify-between w-full flex-wrap gap-2">
      <nav
        class="text-center text-sm flex flex-start"
      >
        <RouterLink
          to="/"
          class="inline-flex py-2 px-4 border-r border-fuchsia-800 text-fuchsia-800"
          exact-active-class="bg-fuchsia-100"
        >
          Главная
        </RouterLink>
        <RouterLink
          to="/products"
          class="inline-flex py-2 px-4 border-r border-fuchsia-800 text-fuchsia-800"
          exact-active-class="bg-fuchsia-100"
        >
          Справочник продуктов
        </RouterLink>
        <RouterLink
          to="/daily-meals"
          class="inline-flex py-2 px-4 border-r border-fuchsia-800 text-fuchsia-800"
          exact-active-class="bg-fuchsia-100"
        >
          Дневное потребление
        </RouterLink>
        <RouterLink
          to="/nutrition"
          class="inline-flex py-2 px-4 text-fuchsia-800"
          exact-active-class="bg-fuchsia-100"
        >
          Диаграммы питания
        </RouterLink>
      </nav>
      <div class="flex gap-2">
        <button
          v-if="!isDataEmpty"
          class="bg-red-300 p-2 rounded-md cursor-pointer"
          data-test="reset-data-btn"
          @click="onClearData"
        >
          Очистить все данные
        </button>
        <button
          v-if="isDataEmpty"
          class="bg-blue-300 p-2 rounded-md cursor-pointer"
          data-test="load-demo-data-btn"
          @click="onLoadDemoData"
        >
          Загрузить демо-данные
        </button>
      </div>
    </div>
  </header>

  <RouterView />
</template>
