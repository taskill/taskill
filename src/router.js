import Vue from 'vue'
import Router from 'vue-router'
import DefaultTheme from './components/layouts/Default'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active-exact',
  routes: [
    {
      path: '/',
      component: DefaultTheme
    },
    {
      path: '/signin',
      component: () =>
        import(/* webpackChunkName: "SignIn" */ '@/views/Login.vue')
    },
    {
      path: '/signup',
      component: () =>
        import(/* webpackChunkName: "SignUp" */ '@/views/Login.vue')
    },
    {
      path: '/reset',
      component: () =>
        import(/* webpackChunkName: "Reset" */ '@/views/Login.vue')
    },
    {
      path: '*',
      component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue')
    }
  ]
})
