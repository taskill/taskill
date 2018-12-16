import Vue from 'vue'
import Router from 'vue-router'
import DefaultTheme from './components/layouts/Default'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: DefaultTheme
    }
  ]
})
