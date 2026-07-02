import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IProduct, IProductParams } from '@/types/interfaces'

export const useProductsStore = defineStore('products', () => {
  const products = ref<IProduct[]>([])

  const addProduct = (params: IProductParams) => {
    const newProduct = {
      ...params,
      id: Date.now()
    }
    products.value = [ ...products.value, newProduct ]
  }

  const editProduct = (product: IProduct) => {
    products.value = products.value.map((p) => {
      if (p.id === product.id) {
        return product
      }
      return p
    })
  }

  return {
    products,
    addProduct,
    editProduct
  }
}, {
  persist: true
})
