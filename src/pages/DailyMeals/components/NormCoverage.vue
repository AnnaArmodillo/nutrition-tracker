<script setup lang="ts">
import type { INutrientData } from '@/types/interfaces'
import ProgressBar from './ProgressBar.vue'

interface IProps {
  factTotal: Record<string, INutrientData> | null
}

const {
  factTotal = {}
} = defineProps<IProps>()

</script>
<template>
  <div class="grid grid-cols-2 gap-2">
    <ProgressBar
      label="Белки"
      :current="factTotal?.proteins?.value"
      :norm="factTotal?.proteins?.normValue"
      :normCoverage="factTotal?.proteins?.normCoverage"
      unit="г"
    />
    <ProgressBar
      label="Жиры"
      :current="factTotal?.fats?.value"
      :norm="factTotal?.fats?.normValue"
      :normCoverage="factTotal?.fats?.normCoverage"
      unit="г"
    />
    <ProgressBar
      label="Углеводы"
      :current="factTotal?.carbohydrates?.value"
      :norm="factTotal?.carbohydrates?.normValue"
      :normCoverage="factTotal?.carbohydrates?.normCoverage"
      unit="г"
    />
    <ProgressBar
      label="Калории"
      :current="factTotal?.calories?.value"
      :norm="factTotal?.calories?.normValue"
      :normCoverage="factTotal?.calories?.normCoverage"
      unit="ккал"
    />
  </div>
</template>
