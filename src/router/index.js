import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/layout',
      component: () => import('@/views/layout/LayoutPage.vue'),
      redirect: '/layout/home',
      children: [
        {
          path: 'home',
          component: () => import('@/views/layout/HomePage.vue')
        },
        {
          path: 'order',
          component: () => import('@/views/layout/OrderPage.vue')
        },
        {
          path: 'post',
          component: () => import('@/views/layout/PostPage.vue')
        },
        {
          path: 'message',
          component: () => import('@/views/layout/MessagePage.vue')
        },
        {
          path: 'user',
          component: () => import('@/views/layout/UserPage.vue')
        }
      ]
    },
    {
      path: '/search',
      component: () => import('@/views/search/SearchPage.vue')
    },
    {
      path: '/list',
      component: () => import('@/views/search/ListPage.vue')
    },
    {
      path: '/product/:id',
      name: 'Product',
      component: () => import('@/views/product/ProductPage.vue')
    },
    {
      path: '/order',
      component: () => import('@/views/order/OrderDetail.vue')
    },
    {
      path: '/pay',
      component: () => import('@/views/order/PayPage.vue')
    },
    {
      path: '/comment',
      component: () => import('@/views/order/CommentPage.vue')
    }
  ]
})

export default router
