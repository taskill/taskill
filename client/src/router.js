import Vue from 'vue'
import Router from 'vue-router'
import DefaultTheme from './components/layouts/Default'
import auth from './services/auth'
import store from './store'
import NProgress from 'nprogress'

Vue.use(Router)

NProgress.configure({
  showSpinner: false
})

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active-exact',
  routes: [
    {
      path: '/',
      component: DefaultTheme,
      meta: { requiresAuth: true }
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
      meta: { requiresAuth: true },
      component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue')
    }
  ]
})

// Middleware
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    if (auth.isAuth()) {
      // Fetch user data from store
      const user = store.getters.user
      // If not exist user data fetch from server
      if (Object.keys(user).length === 0) {
        const { id } = auth.getUser()
        await store.dispatch('getUserById', { id })
      }
      next()
    } else {
      next('/signin')
    }
  } else {
    next()
  }
})

export default router
