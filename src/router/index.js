import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/aktuell',
    name: 'aktuell',
    component: () => import('../views/Current.vue'), 
  },
  {
    path: '/buecherliste',
    name: 'buecherliste',
    component: () => import('../views/BookList.vue'), 
  },
  {
    path: '/kinderliste',
    name: 'kinderliste',
    component: () => import('../views/CustomerList.vue'),
  },
  {
    path: '/einstellungen',
    name: 'einstellungen',
    component: () => import('../views/Settings.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router