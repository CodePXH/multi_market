import {createRouter, createWebHashHistory} from "vue-router";
import indexPage from "@/components/indexPage.vue";
import marketIndexPage from "@/components/market/indexPage.vue";

const routes = [
  {
    path: '/index',
    name: 'home',
    component: indexPage,
    children: [
      {
        path: 'market',
        name: 'market',
        component: marketIndexPage
      }
    ]
  },
  {
    path: '/',
    redirect: '/index/market'
  }
]
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes
})
export default router
