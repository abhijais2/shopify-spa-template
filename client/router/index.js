import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: Home,
      name: 'home'
    },
    {
      path: '/**',
      redirect: '/'
    }
  ]
})

export default router
