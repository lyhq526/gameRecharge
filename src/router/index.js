import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '默认',
    redirect:'/login',
  },
  {
    path: '/login',
    name: '登录',
    component: () => import(/* webpackChunkName: "about" */ '../views/login/index')
  },
  {
    path: '/home',
    name: '首页',
    component: () => import(/* webpackChunkName: "about" */ '../views/home/index'),
  }
]

const router = new VueRouter({
  routes
})

export default router
