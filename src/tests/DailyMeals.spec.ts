import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia, storeToRefs } from 'pinia'

import DailyMeals from '@/pages/DailyMeals/DailyMeals.vue'
import { useDailyMealsStore } from '@/stores/dailyMeals'
import { useProductsStore } from '@/stores/products'
import { useNutritionStore } from '@/stores/nutrition'

describe('DailyMeals', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('отображает список потребленных продуктов из стора', async () => {
    const productsStore = useProductsStore()
    const { loadDemoProducts } = productsStore
    loadDemoProducts()

    const wrapper = mount(DailyMeals)
    const dailyMealsStore = useDailyMealsStore()
    const { loadDemoDailyMeals } = dailyMealsStore
    loadDemoDailyMeals()
    await flushPromises()
    expect(wrapper.text()).toContain('Банан')
  })

  it('отображает список потребленных продуктов из стора при смене даты', async () => {
    const productsStore = useProductsStore()
    const { loadDemoProducts } = productsStore
    loadDemoProducts()

    const wrapper = mount(DailyMeals)
    const dailyMealsStore = useDailyMealsStore()
    const { loadDemoDailyMeals } = dailyMealsStore
    loadDemoDailyMeals()
    await flushPromises()
    expect(wrapper.text()).toContain('Банан')

    wrapper.find('[data-test="daily-meals-date"]').setValue('2023-01-01')
    await flushPromises()
    expect(wrapper.text()).toContain('Записи на выбранную дату отсутствуют')
  })

  it('отображается превышение нормы', async () => {
    const productsStore = useProductsStore()
    const { loadDemoProducts } = productsStore
    const { products } = storeToRefs(productsStore)
    loadDemoProducts()

    const wrapper = mount(DailyMeals)
    const dailyMealsStore = useDailyMealsStore()
    const { addEntry } = dailyMealsStore
    const banana = products.value?.find(product => product.name === 'Банан')
    expect(banana?.id).toBeDefined()
    addEntry({ productId: banana!.id, weight: 1000 })

    const nutritionStore = useNutritionStore()
    const { loadDemoNorm } = nutritionStore
    loadDemoNorm()
    await flushPromises()
    expect(wrapper.text()).toContain('Перебор')
  })

  it('отображается нахождение в пределах нормы', async () => {
    const productsStore = useProductsStore()
    const { loadDemoProducts } = productsStore
    const { products } = storeToRefs(productsStore)
    loadDemoProducts()

    const wrapper = mount(DailyMeals)
    const dailyMealsStore = useDailyMealsStore()
    const { addEntry } = dailyMealsStore
    const banana = products.value?.find(product => product.name === 'Банан')
    expect(banana?.id).toBeDefined()
    addEntry({ productId: banana!.id, weight: 600 })

    const nutritionStore = useNutritionStore()
    const { loadDemoNorm } = nutritionStore
    loadDemoNorm()
    await flushPromises()
    expect(wrapper.text()).toContain('Норма')
  })

  it('отображается небольшой перебор', async () => {
    const productsStore = useProductsStore()
    const { loadDemoProducts } = productsStore
    const { products } = storeToRefs(productsStore)
    loadDemoProducts()

    const wrapper = mount(DailyMeals)
    const dailyMealsStore = useDailyMealsStore()
    const { addEntry } = dailyMealsStore
    const banana = products.value?.find(product => product.name === 'Банан')
    expect(banana?.id).toBeDefined()
    addEntry({ productId: banana!.id, weight: 700 })

    const nutritionStore = useNutritionStore()
    const { loadDemoNorm } = nutritionStore
    loadDemoNorm()
    await flushPromises()
    expect(wrapper.text()).toContain('Небольшой перебор')
  })

  it('отображается небольшой недобор', async () => {
    const productsStore = useProductsStore()
    const { loadDemoProducts } = productsStore
    const { products } = storeToRefs(productsStore)
    loadDemoProducts()

    const wrapper = mount(DailyMeals)
    const dailyMealsStore = useDailyMealsStore()
    const { addEntry } = dailyMealsStore
    const banana = products.value?.find(product => product.name === 'Банан')
    expect(banana?.id).toBeDefined()
    addEntry({ productId: banana!.id, weight: 400 })

    const nutritionStore = useNutritionStore()
    const { loadDemoNorm } = nutritionStore
    loadDemoNorm()
    await flushPromises()
    expect(wrapper.text()).toContain('Почти норма')
  })

  it('отображается недобор', async () => {
    const productsStore = useProductsStore()
    const { loadDemoProducts } = productsStore
    const { products } = storeToRefs(productsStore)
    loadDemoProducts()

    const wrapper = mount(DailyMeals)
    const dailyMealsStore = useDailyMealsStore()
    const { addEntry } = dailyMealsStore
    const banana = products.value?.find(product => product.name === 'Банан')
    expect(banana?.id).toBeDefined()
    addEntry({ productId: banana!.id, weight: 100 })

    const nutritionStore = useNutritionStore()
    const { loadDemoNorm } = nutritionStore
    loadDemoNorm()
    await flushPromises()
    expect(wrapper.text()).toContain('Нужно потреблять больше')
  })

  it('добавляется новая запись', async () => {
    const productsStore = useProductsStore()
    const { loadDemoProducts } = productsStore
    const { products } = storeToRefs(productsStore)
    loadDemoProducts()

    const wrapper = mount(DailyMeals)
    const dailyMealsStore = useDailyMealsStore()
    const { entriesByDateWithNutrients } = storeToRefs(dailyMealsStore)
    const banana = products.value?.find(product => product.name === 'Банан')
    expect(banana?.id).toBeDefined()

    await flushPromises()

    await wrapper.find('[data-test="add-meal-entry-btn"]').trigger('click')
    await wrapper.find('[data-test="meal-product-select"]').setValue(banana!.id)
    await wrapper.find('[data-test="meal-weight"]').setValue(200)
    await wrapper.find('[data-test="meal-form-save-btn"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Банан')
    expect(entriesByDateWithNutrients.value[0]?.weight).toBe('200.0')
  })

  it('редактируется выбранная запись', async () => {
    const productsStore = useProductsStore()
    const { loadDemoProducts } = productsStore
    const { products } = storeToRefs(productsStore)
    loadDemoProducts()

    const wrapper = mount(DailyMeals)
    const dailyMealsStore = useDailyMealsStore()
    const { addEntry } = dailyMealsStore
    const { entriesByDateWithNutrients } = storeToRefs(dailyMealsStore)
    const banana = products.value?.find(product => product.name === 'Банан')
    expect(banana?.id).toBeDefined()
    addEntry({ productId: banana!.id, weight: 600 })
    addEntry({ productId: banana!.id, weight: 100 })
    const meal = entriesByDateWithNutrients.value[0]
    expect(meal).toBeDefined()

    await flushPromises()

    await wrapper.find(`[data-test="${meal!.id}"]`).trigger('click')
    await wrapper.find('[data-test="meal-weight"]').setValue(200)
    await wrapper.find('[data-test="meal-form-save-btn"]').trigger('click')
    await flushPromises()

    expect(entriesByDateWithNutrients.value[0]?.weight).toBe('200.0')
    expect(entriesByDateWithNutrients.value[1]?.weight).toBe('100.0')
  })

  it('удаляется запись', async () => {
    const productsStore = useProductsStore()
    const { loadDemoProducts } = productsStore
    const { products } = storeToRefs(productsStore)
    loadDemoProducts()

    const wrapper = mount(DailyMeals)
    const dailyMealsStore = useDailyMealsStore()
    const { addEntry } = dailyMealsStore
    const { entriesByDateWithNutrients } = storeToRefs(dailyMealsStore)
    const banana = products.value?.find(product => product.name === 'Банан')
    expect(banana?.id).toBeDefined()
    addEntry({ productId: banana!.id, weight: 600 })
    const meal = entriesByDateWithNutrients.value[0]
    expect(meal).toBeDefined()

    await flushPromises()

    await wrapper.find(`[data-test="remove-meal-${meal!.id}-btn"]`).trigger('click')
    await flushPromises()

    expect(entriesByDateWithNutrients.value[0]).toBeUndefined()
  })

  it('скрывает форму при нажатии отмены', async () => {
    const wrapper = mount(DailyMeals)

    const addEntryButton = wrapper.find('[data-test="add-meal-entry-btn"]')
    await addEntryButton.trigger('click')
    expect(wrapper.text()).toContain('Добавление записи')
    expect(addEntryButton.attributes().disabled).toBeDefined()

    await wrapper.find('[data-test="meal-form-cancel-btn"]').trigger('click')

    expect(wrapper.text()).not.toContain('Добавление записи')
    expect(addEntryButton.attributes().disabled).toBeUndefined()
  })

  it('если редактируемой записи нет в сторе, то стор не обновляется', () => {
    const productsStore = useProductsStore()
    const { loadDemoProducts } = productsStore
    loadDemoProducts()

    mount(DailyMeals)
    const dailyMealsStore = useDailyMealsStore()
    const { loadDemoDailyMeals, editEntry } = dailyMealsStore
    const { entries } = storeToRefs(dailyMealsStore)
    loadDemoDailyMeals()

    const initialEntries = [ ...entries.value ]
    const nonExistentEntry = { id: 666, productId: 1, weight: 100, date: '2022-12-12' }
    editEntry(nonExistentEntry)

    expect(entries.value).toEqual(initialEntries)
  })

  it('при добавлении записи с несуществующим продуктом не увеличивается количество нутриентов', () => {
    const productsStore = useProductsStore()
    const { loadDemoProducts } = productsStore
    loadDemoProducts()

    mount(DailyMeals)
    const dailyMealsStore = useDailyMealsStore()
    const { addEntry, loadDemoDailyMeals } = dailyMealsStore
    const { totalNutrientsByDate } = storeToRefs(dailyMealsStore)
    loadDemoDailyMeals()
    const initialNutrients = { ...totalNutrientsByDate.value }

    addEntry({ productId: 666, weight: 100 })

    expect(totalNutrientsByDate.value).toEqual(initialNutrients)
  })

  it('не сохраняет запись, если форма невалидна (проверка onSave)', async () => {
    const wrapper = mount(DailyMeals)
    const store = useDailyMealsStore()
    const { entries } = storeToRefs(store)

    await wrapper.find('[data-test="add-meal-entry-btn"]').trigger('click')

    // Заполняем только вec
    await wrapper.find('[data-test="meal-weight"]').setValue(100)

    const formWrapper = wrapper.findComponent({ name: 'DailyMealForm' })
    const vm = formWrapper.vm
    await vm.onSave()

    // Продукт не добавился
    expect(entries.value.length).toBe(0)
    expect(wrapper.text()).toContain('Добавление записи') // Форма не закрылась
  })

  it('сбрасываются потребленные за день продукты', async () => {
    const productsStore = useProductsStore()
    const { loadDemoProducts } = productsStore
    loadDemoProducts()

    const dailyMealsStore = useDailyMealsStore()
    const { loadDemoDailyMeals, resetEntries } = dailyMealsStore
    const { entries } = storeToRefs(dailyMealsStore)
    loadDemoDailyMeals()

    expect(entries.value.length).toBe(9)
    resetEntries()
    await flushPromises()
    expect(entries.value.length).toBe(0)
  })

  it('загружается потребление из демо-данных', async () => {
    const productsStore = useProductsStore()
    const { loadDemoProducts } = productsStore
    loadDemoProducts()

    const dailyMealsStore = useDailyMealsStore()
    const { loadDemoDailyMeals } = dailyMealsStore
    const { entries } = storeToRefs(dailyMealsStore)
    loadDemoDailyMeals()

    expect(entries.value.length).toBe(9)
  })
})