import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IProduct, IProductParams } from '@/types/interfaces'

export const useProductsStore = defineStore('products', () => {
  const products = ref<IProduct[]>([])

  const addProduct = (params: IProductParams) => {
    const newProduct = {
      ...params,
      id: Date.now() + Math.random()
    }
    products.value = [ ...products.value, newProduct ]
  }

  const editProduct = (product: IProduct) => {
    const index = products.value.findIndex(p => p.id === product.id)
    if (index === -1) {
      return
    }
    products.value = products.value.map((p) => p.id === product.id ? { ...product } : p)
  }

  return {
    products,
    addProduct,
    editProduct
  }
}, {
  persist: true
})
