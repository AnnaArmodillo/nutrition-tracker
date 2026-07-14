<script setup lang="ts">
import { computed, ref } from 'vue'

import type { IProductParams, IProduct } from '@/types/interfaces'

  interface IProps {
    product?: IProduct
  }

const {
  product
} = defineProps<IProps>()

const emits = defineEmits<{
    save: [ params: IProductParams ]
    cancel: [ ]
  }>()

const name = ref<string>(product?.name ?? '')
const proteins = ref<number | string | undefined>(product?.proteins ?? undefined)
const fats = ref<number | string | undefined>(product?.fats ?? undefined)
const carbohydrates = ref<number | string | undefined>(product?.carbohydrates ?? undefined)
const calories = ref<number | string | undefined>(product?.calories ?? undefined)

const isFormValid = computed(() => {
  return (
    name.value !== '' &&
      proteins.value !== undefined && proteins.value !== '' &&
      fats.value !== undefined && fats.value !== '' &&
      carbohydrates.value !== undefined && carbohydrates.value !== '' &&
      calories.value !== undefined && calories.value !== ''
  )
})

const onSave = () => {
  if (!isFormValid.value) return
  emits('save', {
    name: name.value,
    proteins: proteins.value! as number,
    fats: fats.value! as number,
    carbohydrates: carbohydrates.value! as number,
    calories: calories.value! as number
  })
}

const onCancel = () => {
  emits('cancel')
}
</script>

<template>
  <main class="flex flex-col gap-2">
    <h1 class="font-semibold text-lg">
      {{ product ? `Редактирование продукта: ${product.name}` : 'Добавление продукта' }}
    </h1>
    <input
      v-model="name"
      type="text"
      placeholder="Название продукта"
      data-test="product-name"
      class="border border-solid border-blue-500 rounded-md p-1 focus:outline focus:outline-blue-500"
    />
    <div class="grid grid-cols-2 gap-2">
      <div class="flex flex-col gap-1">
        <p class="font-semibold">Белки</p>
        <input
          v-model="proteins"
          type="number"
          data-test="product-proteins"
          class="border border-solid border-blue-500 rounded-md p-1 focus:outline focus:outline-blue-500"
        />
      </div>

      <div class="flex flex-col gap-1">
        <p class="font-semibold">Жиры</p>
        <input
          v-model="fats"
          type="number"
          data-test="product-fats"
          class="border border-solid border-blue-500 rounded-md p-1 focus:outline focus:outline-blue-500"
        />
      </div>

      <div class="flex flex-col gap-1">
        <p class="font-semibold">Углеводы</p>
        <input
          v-model="carbohydrates"
          type="number"
          data-test="product-carbohydrates"
          class="border border-solid border-blue-500 rounded-md p-1 focus:outline focus:outline-blue-500"
        />
      </div>

      <div class="flex flex-col gap-1">
        <p class="font-semibold">Калории</p>
        <input
          v-model="calories"
          type="number"
          data-test="product-calories"
          class="border border-solid border-blue-500 rounded-md p-1 focus:outline focus:outline-blue-500"
        />
      </div>
    </div>
    <div class="flex gap-2">
      <button
        class="p-2 rounded-md cursor-pointer border border-solid border-blue-500"
        data-test="product-form-cancel-btn"
        @click="onCancel"
      >
        Отмена
      </button>
      <button
        class="bg-blue-100 p-2 rounded-md"
        :class="isFormValid ? 'cursor-pointer' : 'opacity-50 cursor-default'"
        :disabled="!isFormValid"
        data-test="product-form-save-btn"
        @click="onSave"
      >
        Сохранить
      </button>
    </div>
  </main>
</template>
