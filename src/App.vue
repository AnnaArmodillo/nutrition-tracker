<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="flex justify-start w-full flex-wrap">
      <nav
        class="w-full text-center text-sm flex flex-start"
      >
        <RouterLink
          to="/"
          class="inline-flex py-2 px-4 border-r border-fuchsia-800 text-fuchsia-800"
          exact-active-class="bg-fuchsia-100"
        >
          Главная
        </RouterLink>
        <RouterLink
          to="/products"
          class="inline-flex py-2 px-4 border-r border-fuchsia-800 text-fuchsia-800"
          exact-active-class="bg-fuchsia-100"
        >
          Справочник продуктов
        </RouterLink>
        <RouterLink
          to="/daily-meals"
          class="inline-flex py-2 px-4 border-r border-fuchsia-800 text-fuchsia-800"
          exact-active-class="bg-fuchsia-100"
        >
          Дневное потребление
        </RouterLink>
        <RouterLink
          to="/nutrition"
          class="inline-flex py-2 px-4 text-fuchsia-800"
          exact-active-class="bg-fuchsia-100"
        >
          Диаграммы питания
        </RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
