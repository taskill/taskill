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
      meta: { requiresAuth: true },
      children: [
        {
          path: 'projects',
          meta: { title: 'Projects', requiresAuth: true },
          component: () =>
            import(/* webpackChunkName: "Projects" */ '@/views/project/Projects.vue')
        },
        {
          path: 'projects/new',
          meta: {
            title: 'Create a project',
            description: 'A project is a collection of several tasks',
            requiresAuth: true,
            breadcrumbs: [
              { name: 'Projects', link: '/projects' },
              { name: 'New', link: '/projects/new' }
            ]

          },
          component: () =>
            import(/* webpackChunkName: "Projects" */ '@/views/project/ProjectCreate.vue')
        }
      ]
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

router.beforeResolve((to, from, next) => {
  const matched = router.getMatchedComponents(to)
  const prevMatched = router.getMatchedComponents(from)

  // Проверка на ранее не отрендереного компонента
  // Сравниваем два компонента, пока они не будут отличаться
  let diffed = false
  const activated = matched.filter((c, i) => {
    return diffed || (diffed = prevMatched[i] !== c)
  })

  if (!activated.length) {
    return next()
  }

  // Запуск прогресс бара
  NProgress.start()

  // Получить все promise из компонентов в asyncData и дождаться их resolve
  Promise.all(
    activated.map(c => {
      // Если у компонента есть опция asyncData
      if (c.asyncData) {
        // Вызывать у компонента asyncData и передать в него store и to из роута
        // и вернуть promise
        return c.asyncData({ store, route: to })
      }
    })
  )
    .then(() => {
      // Остановка прогресс бара
      NProgress.done()
      next()
    })
    .catch(next)
})

export default router
