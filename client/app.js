import Vue from 'vue'
import { sync } from 'vuex-router-sync'

import store from './store'
import router from './router'

import './styles/main.scss'
import './directives'
// import './vue-middlewares'

import App from './App.vue'

sync(store, router)

const app = new Vue({
  router,
  store,
  ...App
})

export { app, router, store }
