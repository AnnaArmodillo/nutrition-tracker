import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/pages/Home/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/pages/Products/ProductList.vue'),
    },
    {
      path: '/daily-meals',
      name: 'daily-meals',
      component: () => import('@/pages/DailyMeals/DailyMeals.vue'),
    },
    {
      path: '/nutrition',
      name: 'nutrition',
      component: () => import('@/pages/Nutrition/NutritionCharts.vue'),
    },
  ],
})

export default router
