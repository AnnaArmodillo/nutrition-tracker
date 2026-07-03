<script setup lang="ts">
import type { INutrientData } from '@/types/interfaces'
import ProgressBar from './ProgressBar.vue'

interface IProps {
  factTotal: Record<string, INutrientData>
}

const {
  factTotal
} = defineProps<IProps>()

</script>
<template>
  <div class="grid grid-cols-2 gap-2">
    <ProgressBar
      label="Белки"
      :current="factTotal.proteins?.value ?? 0"
      :norm="factTotal.proteins?.normValue ?? 0"
      :normCoverage="factTotal.proteins?.normCoverage ?? 0"
      unit="г"
    />
    <ProgressBar
      label="Жиры"
      :current="factTotal.fats?.value ?? 0"
      :norm="factTotal.fats?.normValue ?? 0"
      :normCoverage="factTotal.fats?.normCoverage ?? 0"
      unit="г"
    />
    <ProgressBar
      label="Углеводы"
      :current="factTotal.carbohydrates?.value ?? 0"
      :norm="factTotal.carbohydrates?.normValue ?? 0"
      :normCoverage="factTotal.carbohydrates?.normCoverage ?? 0"
      unit="г"
    />
    <ProgressBar
      label="Калории"
      :current="factTotal.calories?.value ?? 0"
      :norm="factTotal.calories?.normValue ?? 0"
      :normCoverage="factTotal.calories?.normCoverage ?? 0"
      unit="ккал"
    />
  </div>
</template>
