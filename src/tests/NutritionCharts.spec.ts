import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia, storeToRefs } from 'pinia'

import NutritionCharts from '@/pages/Nutrition/NutritionCharts.vue'
import { useDailyMealsStore } from '@/stores/dailyMeals'
import { useProductsStore } from '@/stores/products'
import { useNutritionStore } from '@/stores/nutrition'

describe('DailyMeals', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  })

  it('выводит сообщение об отсутствии данных при смене даты', async () => {
    const wrapper = mount(NutritionCharts)
    wrapper.find('[data-test="nutrition-charts-date"]').setValue('2023-01-01')
    await flushPromises()
    expect(wrapper.text()).toContain('Данные на выбранную дату отсутствуют')
  })

  it('отображает процент потребления от нормы из стора', async () => {
    const wrapper = mount(NutritionCharts)
    const productsStore = useProductsStore()
    const { addProduct } = productsStore
    const { products } = storeToRefs(productsStore)
    addProduct({ name: 'Банан', proteins: 1.5, fats: 0.2, carbohydrates: 21.8, calories: 143 })
    addProduct({ name: 'Творог', proteins: 18, fats: 2, carbohydrates: 3.3, calories: 103 })
    addProduct({ name: 'Сметана', proteins: 2.6, fats: 25, carbohydrates: 2.5, calories: 248 })
    const dailyMealsStore = useDailyMealsStore()
    const { addEntry } = dailyMealsStore
    addEntry({ productId: products.value[0]!.id, weight: 450 })
    addEntry({ productId: products.value[1]!.id, weight: 600 })
    addEntry({ productId: products.value[2]!.id, weight: 120 })
    await flushPromises()
    await wrapper.find('[data-test="progress-overview-chart"]').trigger('click')
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    const nutritionStore = useNutritionStore()
    const { updateDailyNorm } = nutritionStore
    updateDailyNorm({ proteins: 104, fats: 46, carbohydrates: 138, calories: 1384 })
    const { factTotal } = storeToRefs(nutritionStore)
    // Проверяем, что у всех нутриентов отклонений нет
    const allHaveNoDeviation = Object.values(factTotal.value ?? {}).every(
      (n) => n.hasDeviation === false
    )
    expect(allHaveNoDeviation).toBe(true)
    expect(wrapper.text()).not.toContain('Данные на выбранную дату отсутствуют')
  })

  it('отображает потребление от нормы в абсолютных значениях из стора', async () => {
    const wrapper = mount(NutritionCharts)
    const productsStore = useProductsStore()
    const { addProduct } = productsStore
    const { products } = storeToRefs(productsStore)
    addProduct({ name: 'Банан', proteins: 1.5, fats: 0.2, carbohydrates: 21.8, calories: 143 })
    addProduct({ name: 'Творог', proteins: 18, fats: 2, carbohydrates: 3.3, calories: 103 })
    addProduct({ name: 'Сметана', proteins: 2.6, fats: 25, carbohydrates: 2.5, calories: 248 })
    const dailyMealsStore = useDailyMealsStore()
    const { addEntry } = dailyMealsStore
    addEntry({ productId: products.value[0]!.id, weight: 450 })
    addEntry({ productId: products.value[1]!.id, weight: 600 })
    addEntry({ productId: products.value[2]!.id, weight: 120 })
    await flushPromises()
    await wrapper.find('[data-test="progress-trend-chart"]').trigger('click')
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    const nutritionStore = useNutritionStore()
    const { updateDailyNorm } = nutritionStore
    updateDailyNorm({ proteins: 104, fats: 46, carbohydrates: 138, calories: 1384 })
    const { factTotal } = storeToRefs(nutritionStore)
    // Проверяем, что у всех нутриентов отклонений нет
    const allHaveNoDeviation = Object.values(factTotal.value ?? {}).every(
      (n) => n.hasDeviation === false
    )
    expect(allHaveNoDeviation).toBe(true)
    expect(wrapper.text()).not.toContain('Данные на выбранную дату отсутствуют')
    const pageText = wrapper.text().replace(/\s+/g, ' ').trim()
    const expectedText = `
      Синим цветом отмечены значения нормы. Фактическое потребление, соответствующее
      суточной норме, отмечено зелёным цветом, выходящее за пределы нормы - красным
    `.replace(/\s+/g, ' ').trim()

    expect(pageText).toContain(expectedText)
  })

  it('отображает распределение нутриентов из стора', async () => {
    const wrapper = mount(NutritionCharts)
    const productsStore = useProductsStore()
    const { addProduct } = productsStore
    const { products } = storeToRefs(productsStore)
    addProduct({ name: 'Банан', proteins: 1.5, fats: 0.2, carbohydrates: 21.8, calories: 143 })
    addProduct({ name: 'Творог', proteins: 18, fats: 2, carbohydrates: 3.3, calories: 103 })
    addProduct({ name: 'Сметана', proteins: 2.6, fats: 25, carbohydrates: 2.5, calories: 248 })
    const dailyMealsStore = useDailyMealsStore()
    const { addEntry } = dailyMealsStore
    addEntry({ productId: products.value[0]!.id, weight: 450 })
    addEntry({ productId: products.value[1]!.id, weight: 600 })
    addEntry({ productId: products.value[2]!.id, weight: 120 })
    await flushPromises()
    await wrapper.find('[data-test="daily-composition-chart"]').trigger('click')
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    const nutritionStore = useNutritionStore()
    const { updateDailyNorm } = nutritionStore
    updateDailyNorm({ proteins: 104, fats: 46, carbohydrates: 138, calories: 1384 })
    const { factTotal } = storeToRefs(nutritionStore)
    // Проверяем, что у всех нутриентов отклонений нет
    const allHaveNoDeviation = Object.values(factTotal.value ?? {}).every(
      (n) => n.hasDeviation === false
    )
    expect(allHaveNoDeviation).toBe(true)
    expect(wrapper.text()).not.toContain('Данные на выбранную дату отсутствуют')
    const sector = wrapper.find('path[fill]:not([fill="none"])')
    expect(sector.exists()).toBe(true)

    const element = sector.element as SVGElement
    const rect = element.getBoundingClientRect()
    // Эмулируем наведение
    const event = new MouseEvent('mousemove', {
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
      bubbles: true,
    })

    element.dispatchEvent(event)
  })
})