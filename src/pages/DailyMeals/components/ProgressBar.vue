<script setup lang="ts">
interface IProps {
  label: string
  current: number
  norm: number
  normCoverage: number
  unit: string
}

const {
  label,
  current,
  norm,
  normCoverage,
  unit
} = defineProps<IProps>()

const barColor = () => {
  if (normCoverage >= 85 && normCoverage <= 100) return 'bg-emerald-500'
  if (normCoverage > 100 && normCoverage <= 115) return 'bg-amber-400'
  if (normCoverage > 60 && normCoverage < 85) return 'bg-amber-400'
  return 'bg-rose-500'
}

const textColor = () => {
  if (normCoverage >= 85 && normCoverage <= 100) return 'text-emerald-600'
  if (normCoverage > 100 && normCoverage <= 115) return 'text-amber-600'
  if (normCoverage >= 60 && normCoverage < 85) return 'text-amber-600'
  return 'text-rose-600'
}

const statusText = () => {
  if (normCoverage >= 85 && normCoverage <= 100) return '✅ Норма'
  if (normCoverage > 100 && normCoverage <= 115) return '⚠️ Небольшой перебор'
  if (normCoverage >= 60 && normCoverage < 85) return '⚠️ Почти норма'
  if (normCoverage < 60) return '❌ Нужно потреблять больше'
  return '🚨 Перебор'
}
</script>
<template>
  <div class="flex flex-col gap-y-1">
    <div class="flex justify-between text-sm">
      <span class="font-medium">{{ label }}</span>
      <span :class="textColor()">
        {{ current.toFixed(1) }} / {{ norm }} {{ unit }}
      </span>
    </div>

    <div class="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <!-- Основной прогресс -->
      <div
        class="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
        :class="barColor()"
        :style="{ width: Math.min(normCoverage, 100) + '%' }"
      ></div>

      <!-- Перебор -->
      <div
        v-if="normCoverage > 100"
        class="absolute top-0 h-full bg-red-500 opacity-70 rounded-r-full transition-all duration-700"
        :style="{
          width: Math.min(normCoverage - 100, 30) + '%',
          left: '100%'
        }"
      ></div>

      <!-- Маркер нормы -->
      <div class="absolute top-0 h-full w-0.5 bg-gray-700 z-10" style="left: 100%"></div>
    </div>

    <div class="flex justify-between text-xs text-gray-500">
      <span>{{ statusText() }}</span>
      <span v-if="normCoverage > 100">+{{ (normCoverage - 100).toFixed(0) }}%</span>
    </div>
  </div>
</template>
