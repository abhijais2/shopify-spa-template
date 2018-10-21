import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home'
import ChargeList from '@/views/Charges'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/charges',
      name: 'charges-list',
      component: ChargeList
    },
    {
      path: '/home',
      component: Home,
      name: 'home'
    },
    {
      path: '/**',
      redirect: '/home'
    }
  ]
})

export default router
