<script setup lang="ts">
import { computed, ref } from 'vue'

import type { INutrients } from '@/types/interfaces'

interface IProps {
  dailyNorm: INutrients
}

const {
  dailyNorm
} = defineProps<IProps>()

const emits = defineEmits<{
    save: [ params: INutrients ]
  }>()

const proteins = ref<number | string | undefined>(dailyNorm?.proteins ?? undefined)
const fats = ref<number | string | undefined>(dailyNorm?.fats ?? undefined)
const carbohydrates = ref<number | string | undefined>(dailyNorm?.carbohydrates ?? undefined)
const calories = ref<number | string | undefined>(dailyNorm?.calories ?? undefined)

const isFormValid = computed(() => {
  return (
    proteins.value !== undefined && proteins.value !== '' &&
      fats.value !== undefined && fats.value !== '' &&
      carbohydrates.value !== undefined && carbohydrates.value !== '' &&
      calories.value !== undefined && calories.value !== ''
  )
})

const isFormDirty = computed(() => {
  return (
    proteins.value !== dailyNorm.proteins ||
      fats.value !== dailyNorm.fats ||
      carbohydrates.value !== dailyNorm.carbohydrates ||
      calories.value !== dailyNorm.calories
  )
})

const onSave = () => {
  if (!isFormValid.value) return
  emits('save', {
    proteins: proteins.value! as number,
    fats: fats.value! as number,
    carbohydrates: carbohydrates.value! as number,
    calories: calories.value! as number
  })
}
</script>

<template>
  <main class="flex flex-col gap-2 p-2">
    <h1 class="font-semibold text-lg">
      Суточная норма:
    </h1>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-1">
        <p class="font-semibold">Белки</p>
        <input
          v-model="proteins"
          type="number"
          class="border border-solid border-blue-500 rounded-md p-1 focus:outline focus:outline-blue-500"
        />
      </div>

      <div class="flex flex-col gap-1">
        <p class="font-semibold">Жиры</p>
        <input
          v-model="fats"
          type="number"
          class="border border-solid border-blue-500 rounded-md p-1 focus:outline focus:outline-blue-500"
        />
      </div>

      <div class="flex flex-col gap-1">
        <p class="font-semibold">Углеводы</p>
        <input
          v-model="carbohydrates"
          type="number"
          class="border border-solid border-blue-500 rounded-md p-1 focus:outline focus:outline-blue-500"
        />
      </div>

      <div class="flex flex-col gap-1">
        <p class="font-semibold">Калории</p>
        <input
          v-model="calories"
          type="number"
          class="border border-solid border-blue-500 rounded-md p-1 focus:outline focus:outline-blue-500"
        />
      </div>
    </div>
    <button
      class="bg-blue-100 p-2 rounded-md"
      :class="isFormValid && isFormDirty ? 'cursor-pointer' : 'opacity-50 cursor-default'"
      :disabled="!isFormValid || !isFormDirty"
      @click="onSave"
    >
      Сохранить
    </button>
  </main>
</template>
