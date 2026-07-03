<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { RadarChart, PieChart, BarChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, TitleComponent } from 'echarts/components'

import { useNutritionStore } from '@/stores/nutrition'

use([
  SVGRenderer,
  RadarChart,
  PieChart,
  BarChart,
  TooltipComponent,
  GridComponent,
  TitleComponent
])

const store = useNutritionStore()

const {
  factNutrients,
  factTotal,
  maxFactNormCoverage,
  isNutrientsProgressBalanced,
  isDailyDataExist
} = storeToRefs(store)

const {
  setSelectedDate,
} = store

const progressOverviewOption = computed(() => {
  if (!factTotal.value) return {}
  return {
    tooltip: {
      trigger: 'item'
    },
    radar: {
      shape: 'circle',
      indicator: Object.values(factTotal.value ?? {}).map((item) => ({
        name: item.title,
        max: maxFactNormCoverage.value
      }))
    },
    series: [
      {
        type: 'radar',
        areaStyle: {
          color: isNutrientsProgressBalanced.value ? '#00AA00' : '#AA0000'
        },
        data: [
          {
            value: Object.values(factTotal.value ?? {}).map((item) => item.normCoverage),
            name: 'Фактическое потребление, % от нормы'
          },
          {
            value: Object.values(factTotal.value ?? {}).map(() => 100),
            name: 'Суточная норма, %'
          }
        ]
      }
    ]
  }
})

const nutrientPercentageOption = computed(() => {
  if (!factNutrients.value) return {}
  return {
    tooltip: {
      trigger: 'item',
      valueFormatter: (value: string) => `${value} гр`
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: Object.values(factNutrients.value ?? {}).map((item) => ({
          name: item.title,
          value: item.value,
          itemStyle: {
            borderColor: item.isBalancedByTotalWeight ? '#00AA00' : '#AA0000',
            borderWidth: 2
          }
        }))
      },
    ]
  }
})

const progressTrendOption = computed(() => {
  if (!factTotal.value) return {}
  return {
    title: {
      subtext: `Синим цветом отмечены значения нормы. Фактическое потребление, соответствующее суточной норме, отмечено зелёным
        цветом, выходящее за пределы нормы - красным
      `
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: [
      {
        type: 'category',
        data: Object.values(factTotal.value ?? {}).map((item) => item.title),
      }
    ],
    yAxis: [
      {
        type: 'value',
      }
    ],
    series: [
      {
        name: 'Суточная норма, ед.',
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        data: Object.values(factTotal.value ?? {}).map((item) => item.targetValue),
      },
      {
        name: 'Фактическое потребление, ед.',
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        colorBy: 'data',
        data: Object.values(factTotal.value ?? {}).map((item) => ({
          value: item.value,
          itemStyle: {
            color: item.hasDeviation ? '#AA0000' : '#00AA00'
          }
        })),
      }
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

type TChartType = 'progressOverview' | 'progressTrend' | 'dailyComposition'

const selectedChart = ref<TChartType>('progressOverview')

const onSelectChart = (type: TChartType) => {
  selectedChart.value = type
}
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
    <div
      v-if="!isDailyDataExist"
      class="flex w-full justify-center"
    >
      Данные на выбранную дату отсутствуют
    </div>
    <div
      v-else
      class="flex flex-col gap-2 grow"
    >
      <nav
        class="flex gap-2"
      >
        <span
          class="border border-fuchsia-800 p-1 rounded-md cursor-pointer"
          :class="selectedChart === 'progressOverview'
            ? 'bg-fuchsia-400 outline outline-fuchsia-800 text-fuchsia-100'
            : 'bg-fuchsia-100'
          "
          @click="onSelectChart('progressOverview')"
        >
          Процент потребления от нормы
        </span>
        <span
          class="border border-fuchsia-800 p-1 rounded-md cursor-pointer"
          :class="selectedChart === 'progressTrend'
            ? 'bg-fuchsia-400 outline outline-fuchsia-800 text-fuchsia-100'
            : 'bg-fuchsia-100'
          "
          @click="onSelectChart('progressTrend')"
        >
          Потребление от нормы в абсолютных значениях
        </span>
        <span
          class="border border-fuchsia-800 p-1 rounded-md cursor-pointer"
          :class="selectedChart === 'dailyComposition'
            ? 'bg-fuchsia-400 outline outline-fuchsia-800 text-fuchsia-100'
            : 'bg-fuchsia-100'
          "
          @click="onSelectChart('dailyComposition')"
        >
          Распределение нутриентов
        </span>
      </nav>
      <div
        class="flex flex-col grow"
      >
        <VChart
          v-if="selectedChart === 'progressOverview'"
          :option="progressOverviewOption"
          autoresize
        />
        <VChart
          v-if="selectedChart === 'progressTrend'"
          :option="progressTrendOption"
          autoresize
        />
        <VChart
          v-if="selectedChart === 'dailyComposition'"
          :option="nutrientPercentageOption"
          autoresize
        />
      </div>
    </div>
  </main>
</template>
