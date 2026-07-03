<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import type { IProductParams, IProduct } from '@/types/interfaces'
import { useProductsStore } from '@/stores/products'
import ProductForm from './components/ProductForm.vue'

const store = useProductsStore()

const { products } = storeToRefs(store)
const {
  addProduct,
  editProduct
} = store

const isProductFormOpened = ref<boolean>(false)

const selectedProduct = ref<IProduct | undefined>(undefined)

const onOpenProductForm = () => {
  isProductFormOpened.value = true
}

const onSelectProduct = (product: IProduct) => {
  selectedProduct.value = product
  onOpenProductForm()
}

const onCloseProductForm = () => {
  isProductFormOpened.value = false
  selectedProduct.value = undefined
}

const onSaveProduct = (params: IProductParams) => {
  if (selectedProduct.value) {
    editProduct({
      ...selectedProduct.value,
      ...params
    })
  } else {
    addProduct(params)
  }
  isProductFormOpened.value = false
  selectedProduct.value = undefined
}

</script>

<template>
  <main class="flex flex-col p-4 gap-2">
    <div class="flex justify-between">
      <h1 class="font-semibold text-lg">Продукты</h1>
      <button
        class="bg-blue-100 p-2 rounded-md"
        :class="isProductFormOpened ? 'opacity-50 cursor-default' : 'cursor-pointer'"
        :disabled="isProductFormOpened"
        @click="onOpenProductForm"
      >
        Добавить
      </button>
    </div>
    <ProductForm
      v-if="isProductFormOpened"
      :product="selectedProduct"
      @save="onSaveProduct"
      @cancel="onCloseProductForm"
    />
    <div
      v-else-if="!products.length"
      class="flex justify-center"
    >
      Пока справочник пуст
    </div>
    <table
      v-else
      class="table-auto border-collapse"
    >
      <thead>
        <tr>
          <th class="border border-blue-500 p-1">Название</th>
          <th class="border border-blue-500 p-1">Белки</th>
          <th class="border border-blue-500 p-1">Жиры</th>
          <th class="border border-blue-500 p-1">Углеводы</th>
          <th class="border border-blue-500 p-1">Калории</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td class="border border-blue-500 p-1">
            <button
              class="cursor-pointer underline"
              @click="onSelectProduct(product)"
            >
              {{ product.name }}
            </button>
          </td>
          <td class="border border-blue-500 p-1 text-center">{{ product.proteins }}</td>
          <td class="border border-blue-500 p-1 text-center">{{ product.fats }}</td>
          <td class="border border-blue-500 p-1 text-center">{{ product.carbohydrates }}</td>
          <td class="border border-blue-500 p-1 text-center">{{ product.calories }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>
