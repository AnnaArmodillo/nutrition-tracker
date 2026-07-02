<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import type { IMealEntryParams } from '@/types/interfaces'
import { useDailyMealsStore } from '@/stores/dailyMeals'
import { useProductsStore } from '@/stores/products'
import DailyMealForm from './components/DailyMealForm.vue'

const store = useDailyMealsStore()

const {
  entriesByDateWithNutrients: meals,
  totalNutrientsByDate: totalMeals,
  selectedMealEntry: selectedMeal
} = storeToRefs(store)
const {
  setSelectedDate,
  addEntry: addMeal,
  editEntry: editMeal,
  selectEntry: selectMeal,
  unselectEntry: unselectMeal,
  removeEntry: removeMeal
} = store

const productsStore = useProductsStore()
const { products } = storeToRefs(productsStore)

const getTodayString = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
const date = ref<string>(getTodayString())

watch(date, (newValue) => {
  setSelectedDate(newValue)
}, { immediate: true })

const isMealFormOpened = ref<boolean>(false)

const onOpenMealForm = () => {
  isMealFormOpened.value = true
}

const onCloseMealForm = () => {
  isMealFormOpened.value = false
  unselectMeal()
}

const onSaveMeal = (params: Omit<IMealEntryParams, 'date'>) => {
  if (selectedMeal.value) {
    editMeal({
      ...selectedMeal.value,
      ...params
    })
  } else {
    addMeal(params)
  }
  isMealFormOpened.value = false
  unselectMeal()
}

const onSelectMeal = (mealId: number) => {
  selectMeal(mealId)
  onOpenMealForm()
}

const onRemoveMeal = (mealId: number) => {
  removeMeal(mealId)
}

</script>
<template>
  <main class="flex flex-col p-4 gap-2">
    <div class="flex justify-between">
      <h1 class="font-semibold text-lg">
        Дневное потребление
      </h1>
      <input
        v-model="date"
        type="date"
        class="border border-solid border-blue-500 rounded-md p-1 focus:outline focus:outline-blue-500"
      />
      <button
        class="bg-blue-100 p-2 rounded-md"
        :class="isMealFormOpened ? 'opacity-50 cursor-default' : 'cursor-pointer'"
        :disabled="isMealFormOpened"
        @click="onOpenMealForm"
      >
        Добавить запись
      </button>
    </div>
    <DailyMealForm
      v-if="isMealFormOpened"
      :productList="products"
      :meal="selectedMeal"
      @save="onSaveMeal"
      @cancel="onCloseMealForm"
    />
    <div
      v-else-if="!meals.length"
      class="flex justify-center"
    >
      Записи на выбранную дату отсутствуют
    </div>
    <table
      v-else
      class="table-auto border-collapse"
    >
      <thead>
        <tr>
          <th class="border border-blue-500 p-1">Продукт</th>
          <th class="border border-blue-500 p-1">Вес, г</th>
          <th class="border border-blue-500 p-1">Белки, г</th>
          <th class="border border-blue-500 p-1">Жиры, г</th>
          <th class="border border-blue-500 p-1">Углеводы, г</th>
          <th class="border border-blue-500 p-1">Калории, ккал</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="meal in meals" :key="meal.id">
          <td class="border border-blue-500 p-1">
            <div class="flex justify-between items-center">
              <button
                class="cursor-pointer underline"
                @click="onSelectMeal(meal.id)"
              >
                {{ meal.name }}
              </button>
              <button
                class="cursor-pointer bg-blue-500 p-1 rounded-md flex h-fit text-sm/4"
                @click="onRemoveMeal(meal.id)"
              >
                &times;
              </button>
            </div>
          </td>
          <td class="border border-blue-500 p-1 text-center">{{ meal.weight }}</td>
          <td class="border border-blue-500 p-1 text-center">{{ meal.proteins }}</td>
          <td class="border border-blue-500 p-1 text-center">{{ meal.fats }}</td>
          <td class="border border-blue-500 p-1 text-center">{{ meal.carbohydrates }}</td>
          <td class="border border-blue-500 p-1 text-center">{{ meal.calories }}</td>
        </tr>
        <tr>
          <td class="border border-blue-500 p-1">Итого</td>
          <td class="border border-blue-500 p-1 text-center">{{ totalMeals.weight }}</td>
          <td class="border border-blue-500 p-1 text-center">{{ totalMeals.proteins }}</td>
          <td class="border border-blue-500 p-1 text-center">{{ totalMeals.fats }}</td>
          <td class="border border-blue-500 p-1 text-center">{{ totalMeals.carbohydrates }}</td>
          <td class="border border-blue-500 p-1 text-center">{{ totalMeals.calories }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>
