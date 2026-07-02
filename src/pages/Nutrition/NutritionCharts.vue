<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { RadarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'

import { useNutritionStore } from '@/stores/nutrition'

use([
  SVGRenderer,
  RadarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
])

const store = useNutritionStore()

const {
  factNutrients,
  factTotal,
  maxFactPercentage,
  isNutrientsBalancedByTarget
} = storeToRefs(store)

const {
  setSelectedDate,
} = store

const percentageFromTargetOption = computed(() => {
  return {
    title: {
      text: 'Процентные соотношения от нормы',
      top: 10,
      left: 0,
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item'
    },
    radar: {
      shape: 'circle',
      indicator: Object.values(factTotal.value).map((item) => ({
        name: item.title,
        max: maxFactPercentage.value
      }))
    },
    series: [
      {
        type: 'radar',
        areaStyle: {
          color: isNutrientsBalancedByTarget.value ? '#00AA00' : '#AA0000'
        },
        data: [
          {
            value: Object.values(factTotal.value).map((item) => item.percentFromTargetValue),
            name: 'Фактическое потребление, %'
          },
          {
            value: Object.values(factTotal.value).map(() => 100),
            name: 'Суточная норма, %'
          }
        ]
      }
    ]
  }
})

const nutrientPercentageOption = computed(() => {
  return {
    title: {
      text: 'Процентные соотношения нутриентов',
      top: 10,
      left: 0,
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: Object.values(factNutrients.value).map((item) => ({
          name: item.title,
          value: item.percentFromTotalWeight,
          itemStyle: {
            borderColor: item.isBalancedByTotalWeight ? '#00AA00' : '#AA0000',
            borderWidth: 2
          }
        }))
      },
    ]
  }
})

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

</script>
<template>
  <main class="flex flex-col p-4 gap-2 h-full w-full">
    <div class="flex justify-between">
      <h1 class="font-semibold text-lg">
        Диаграммы питания
      </h1>
      <input
        v-model="date"
        type="date"
        class="border border-solid border-blue-500 rounded-md p-1 focus:outline focus:outline-blue-500"
      />
    </div>
    <div class="grid grid-cols-2 gap-2 grow">
      <v-chart
        :option="percentageFromTargetOption"
        autoresize
      />
      <v-chart
        :option="nutrientPercentageOption"
        autoresize
      />
    </div>
  </main>
</template>
