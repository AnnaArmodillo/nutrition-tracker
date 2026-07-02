<script setup lang="ts">
import { storeToRefs } from 'pinia'

import type { INutrients } from '@/types/interfaces'
import { useNutritionStore } from '@/stores/nutrition'
import TargetNutrientsForm from './components/TargetNutrientsForm.vue'

const store = useNutritionStore()

const {
  targetNutrientsWeight: targetNutrients
} = storeToRefs(store)
const {
  updateTarget
} = store

const onSaveTarget = (params: INutrients) => {
  updateTarget(params)
}

</script>

<template>
  <main class="flex flex-col gap-2 p-2">
    <div class="flex flex-col gap-2 p-2 font-semibold">
      <p>Раздел "Продукты" содержит весь список добавленных продуктов и позволяет вносить новые</p>
      <p>Раздел "Дневное потребление" позволяет внести информацию о потреблении продуктов в день</p>
      <p>Раздел "Диаграммы питания" отображает в виде диаграмм соотношения нутриентов</p>
    </div>
    <TargetNutrientsForm
      :targetNutrients="targetNutrients"
      @save="onSaveTarget"
    />
  </main>
</template>
