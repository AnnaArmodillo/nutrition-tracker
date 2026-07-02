<script setup lang="ts">
import { computed, ref } from 'vue'

import type { IMealEntryParams, IMealEntry, IProduct } from '@/types/interfaces'

  interface IProps {
    productList: IProduct[]
    meal?: IMealEntry
  }

const {
  productList,
  meal
} = defineProps<IProps>()

const emits = defineEmits<{
    save: [ params: Omit<IMealEntryParams, 'date'> ]
    cancel: [ ]
  }>()

const productId = ref<number | undefined>(meal?.productId)
const weight = ref<number | undefined>(meal?.weight ?? undefined)

const isFormValid = computed(() => {
  return (
    productId.value !== undefined &&
      weight.value !== undefined && weight.value > 0
  )
})

const onSave = () => {
  if (!isFormValid.value) return
  emits('save', {
    productId: productId.value!,
    weight: weight.value!,
  })
}

const onCancel = () => {
  emits('cancel')
}
</script>

<template>
  <main class="flex flex-col gap-2">
    <h1 class="font-semibold text-lg">
      {{ meal ? 'Редактирование записи' : 'Добавление записи' }}
    </h1>
    <select
      v-model="productId"
      class="border border-solid border-blue-500 rounded-md p-1 focus:outline focus:outline-blue-500"
      placeholder="Вес, г"
    >
      <option disabled value="">Выберите продукт</option>
      <option
        v-for="product in productList"
        :key="product.id"
        :value="product.id"
      >
        {{ product.name }}
      </option>
    </select>
    <input
      v-model="weight"
      type="number"
      placeholder="Вес, гр"
      class="border border-solid border-blue-500 rounded-md p-1 focus:outline focus:outline-blue-500"
    />
    <div class="flex gap-2">
      <button
        class="p-2 rounded-md cursor-pointer border border-solid border-blue-500"
        @click="onCancel"
      >
        Отмена
      </button>
      <button
        class="bg-blue-100 p-2 rounded-md"
        :class="isFormValid ? 'cursor-pointer' : 'opacity-50 cursor-default'"
        :disabled="!isFormValid"
        @click="onSave"
      >
        Сохранить
      </button>
    </div>
  </main>
</template>
