import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, storeToRefs } from 'pinia'

import ProductList from '@/pages/Products/ProductList.vue'
import { useProductsStore } from '@/stores/products'
import type { IProduct } from '@/types/interfaces'

describe('ProductList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('отображает список продуктов из стора', () => {
    const { addProduct } = useProductsStore()
    addProduct({ name: 'Гречка', proteins: 4.2, fats: 1.1, carbohydrates: 21.3, calories: 111.9 })
    const wrapper = mount(ProductList)

    expect(wrapper.text()).toContain('Гречка')
  })

  it('добавляет продукт через форму', async () => {
    const store = useProductsStore()
    const wrapper = mount(ProductList)

    await wrapper.find('[data-test="add-product-btn"]').trigger('click')
    expect(wrapper.text()).toContain('Добавление продукта')
    await wrapper.find('[data-test="product-name"]').setValue('Молоко')
    await wrapper.find('[data-test="product-proteins"]').setValue('2.8')
    await wrapper.find('[data-test="product-fats"]').setValue('2.5')
    await wrapper.find('[data-test="product-carbohydrates"]').setValue('4.7')
    await wrapper.find('[data-test="product-calories"]').setValue('52')
    await wrapper.find('[data-test="product-form-save-btn"]').trigger('click')

    expect(store.products.find(p => p.name === 'Молоко')).toBeDefined()
    expect(wrapper.text()).toContain('Молоко')
  })

  it('скрывает форму при нажатии отмены', async () => {
    const wrapper = mount(ProductList)

    const addProductButton = wrapper.find('[data-test="add-product-btn"]')
    await addProductButton.trigger('click')
    expect(wrapper.text()).toContain('Добавление продукта')
    expect(addProductButton.attributes().disabled).toBeDefined()

    await wrapper.find('[data-test="product-form-cancel-btn"]').trigger('click')

    expect(wrapper.text()).not.toContain('Добавление продукта')
    expect(addProductButton.attributes().disabled).toBeUndefined()
  })

  it('выбирает продукт для редактирования', async () => {
    const { addProduct } = useProductsStore()
    addProduct({ name: 'Гречка', proteins: 4.2, fats: 1.1, carbohydrates: 21.3, calories: 111.9 })
    const wrapper = mount(ProductList)

    await wrapper.find('[data-test="Гречка"]').trigger('click')
    expect(wrapper.text()).toContain('Редактирование продукта: Гречка')
  })

  it('редактирует имя продукта', async () => {
    const store = useProductsStore()
    const { addProduct } = store
    addProduct({ name: 'Гречка', proteins: 4.2, fats: 1.1, carbohydrates: 21.3, calories: 111.9 })
    const wrapper = mount(ProductList)

    await wrapper.find('[data-test="Гречка"]').trigger('click')
    await wrapper.find('[data-test="product-name"]').setValue('Гречневая каша')
    await wrapper.find('[data-test="product-form-save-btn"]').trigger('click')

    expect(store.products.find(p => p.name === 'Гречневая каша')).toBeDefined()
    expect(store.products.find(p => p.name === 'Гречка')).toBeUndefined()
    expect(wrapper.text()).toContain('Гречневая каша')
  })

  it('не сохраняет продукт, если форма невалидна (проверка onSave)', async () => {
    const wrapper = mount(ProductList)
    const store = useProductsStore()

    await wrapper.find('[data-test="add-product-btn"]').trigger('click')

    // Заполняем только имя
    await wrapper.find('[data-test="product-name"]').setValue('Молоко')

    const formWrapper = wrapper.findComponent({ name: 'ProductForm' })
    const vm = formWrapper.vm
    await vm.onSave()

    // Продукт не добавился
    expect(store.products.find(p => p.name === 'Молоко')).toBeUndefined()
    expect(wrapper.text()).toContain('Добавление продукта') // Форма не закрылась
  })

  it('если редактируемого продукта нет в сторе, то стор не обновляется', () => {
    const store = useProductsStore()
    const { addProduct, editProduct } = store
    addProduct({ name: 'Гречка', proteins: 4.2, fats: 1.1, carbohydrates: 21.3, calories: 111.9 })
    const initialProducts = store.products
    const nonExistentProduct = { id: 666, name: 'Не существует', proteins: 1, fats: 1, carbohydrates: 1, calories: 1 }
    editProduct(nonExistentProduct)

    expect(store.products).toEqual(initialProducts)
  })

  it('не изменяет другие продукты в списке', () => {
    const store = useProductsStore()
    const { addProduct, editProduct } = store
    const { products } = storeToRefs(store)
    addProduct({ name: 'Гречка', proteins: 4.2, fats: 1.1, carbohydrates: 21.3, calories: 111.9 })
    addProduct({ name: 'Творог', proteins: 18, fats: 2, carbohydrates: 3.3, calories: 103 })

    const firstProduct = products.value[0]
    const updatedFirstProduct = { ...firstProduct, name: 'Гречка отварная' }

    editProduct(updatedFirstProduct as IProduct)

    // Первый продукт изменился
    expect(products.value[0]?.name).toBe('Гречка отварная')
    // Второй продукт не изменился
    expect(products.value[1]?.name).toBe('Творог')
  })
})
