import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, storeToRefs } from 'pinia'

import HomeView from '@/pages/Home/HomeView.vue'
import { useNutritionStore } from '@/stores/nutrition'

describe('HomeView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('загружает сохраненные нормы из стора и предзаполняет форму', () => {
    const store = useNutritionStore()
    const { loadDemoNorm } = store
    const { dailyNorm } = storeToRefs(store)
    loadDemoNorm()
    const wrapper = mount(HomeView)

    const proteinsInput = wrapper.find('[data-test="proteins-norm"]')
    expect((proteinsInput.element as HTMLInputElement).value).toBe('104')

    const fatsInput = wrapper.find('[data-test="fats-norm"]')
    expect((fatsInput.element as HTMLInputElement).value).toBe('46')

    const carbohydratesInput = wrapper.find('[data-test="carbohydrates-norm"]')
    expect((carbohydratesInput.element as HTMLInputElement).value).toBe('138')

    const caloriesInput = wrapper.find('[data-test="calories-norm"]')
    expect((caloriesInput.element as HTMLInputElement).value).toBe('1384')

    expect(dailyNorm.value).toEqual({ proteins: 104, fats: 46, carbohydrates: 138, calories: 1384 })
  })

  it('обновляет дневную норму', async () => {
    const store = useNutritionStore()
    const { dailyNorm } = storeToRefs(store)
    const wrapper = mount(HomeView)

    const proteinsInput = wrapper.find('[data-test="proteins-norm"]')
    await proteinsInput.setValue('20')

    const fatsInput = wrapper.find('[data-test="fats-norm"]')
    await fatsInput.setValue('11')

    const carbohydratesInput = wrapper.find('[data-test="carbohydrates-norm"]')
    await carbohydratesInput.setValue('100')

    const caloriesInput = wrapper.find('[data-test="calories-norm"]')
    await caloriesInput.setValue('1000')

    await wrapper.find('[data-test="daily-norm-save-btn"]').trigger('click')

    expect(dailyNorm.value).toEqual({ proteins: 20, fats: 11, carbohydrates: 100, calories: 1000 })
  })

  it('не обновляет дневную норму, если форма невалидна (проверка onSave)', async () => {
    const wrapper = mount(HomeView)
    const store = useNutritionStore()
    const { dailyNorm } = storeToRefs(store)

    const fatsInput = wrapper.find('[data-test="fats-norm"]')
    await fatsInput.setValue('')
    const formWrapper = wrapper.findComponent({ name: 'DailyNormForm' })
    const vm = formWrapper.vm
    await vm.onSave()

    // Значения остались равны 0
    expect(dailyNorm.value.proteins).toBe(0)
    expect(dailyNorm.value.fats).toBe(0)
    expect(dailyNorm.value.carbohydrates).toBe(0)
    expect(dailyNorm.value.calories).toBe(0)
  })

  it('сбрасывает дневную норму', async () => {
    const store = useNutritionStore()
    const { dailyNorm } = storeToRefs(store)
    const { loadDemoNorm, resetDailyNorm } = store
    loadDemoNorm()

    expect(dailyNorm.value).toEqual({ proteins: 104, fats: 46, carbohydrates: 138, calories: 1384 })

    resetDailyNorm()

    expect(dailyNorm.value).toEqual({ proteins: 0, fats: 0, carbohydrates: 0, calories: 0 })
  })
})
