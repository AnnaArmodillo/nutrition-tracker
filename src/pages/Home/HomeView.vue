<script setup lang="ts">
import { storeToRefs } from 'pinia'

import type { INutrients } from '@/types/interfaces'
import { useNutritionStore } from '@/stores/nutrition'
import DailyNormForm from './components/DailyNormForm.vue'

const store = useNutritionStore()

const {
  dailyNorm
} = storeToRefs(store)
const {
  updateDailyNorm
} = store

const onSaveNorm = (params: INutrients) => {
  updateDailyNorm(params)
}

</script>

<template>
  <main class="flex flex-col gap-2 p-2">
    <div class="flex flex-col gap-2 p-2 font-semibold">
      <p>Раздел "Справочник продуктов" содержит весь список добавленных продуктов и позволяет вносить новые</p>
      <p>Раздел "Дневное потребление" позволяет внести информацию о потреблении продуктов в день</p>
      <p>Раздел "Диаграммы питания" отображает в виде диаграмм соотношения нутриентов</p>
    </div>
    <DailyNormForm
      :dailyNorm="dailyNorm"
      @save="onSaveNorm"
    />
  </main>
</template>
