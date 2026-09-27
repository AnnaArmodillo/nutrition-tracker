export const demoMeals = [
  // в рамках нормы
  {
    dayOffset: 0,
    products: [
      { productIndex: 1, weight: 500 }, // Творог
      { productIndex: 2, weight: 450 }, // Банан
      { productIndex: 3, weight: 130 }, // Сметана
    ],
  },
  // сверх нормы
  {
    dayOffset: 1,
    products: [
      { productIndex: 1, weight: 700 }, // Творог
      { productIndex: 2, weight: 500 }, // Банан
      { productIndex: 3, weight: 200 }, // Сметана
    ],
  },
  // меньше нормы
  {
    dayOffset: 2,
    products: [
      { productIndex: 1, weight: 300 }, // Творог
      { productIndex: 2, weight: 200 }, // Банан
      { productIndex: 3, weight: 40 }, // Сметана
    ],
  },
]