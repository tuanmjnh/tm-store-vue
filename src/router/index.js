import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'
// Routes
const routes = [{
    path: '/login',
    name: 'login',
    component: () => import ('../pages/auth/index')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    alias: '',
    meta: { description: 'Overview of environment', requiresAuth: true },
    component: () => import ('../pages/dashboard/index')
  },
  {
    path: '/users',
    name: 'users',
    alias: '',
    redirect: { name: 'users-list' },
    component: () => import ('../pages/users/index'),
    meta: { description: 'Overview of environment', requiresAuth: true },
    children: [{
        path: 'list',
        name: 'users-list',
        props: true,
        component: () => import ('../pages/users/list')
      },
      {
        path: 'add',
        name: 'users-add',
        props: true,
        component: () => import ('../pages/users/add')
      }
    ]
  },
  {
    path: '/languages',
    name: 'languages',
    alias: '',
    redirect: { name: 'languages-list' },
    component: () => import ('../pages/languages/index'),
    meta: { description: 'Overview of environment', requiresAuth: true },
    children: [{
        path: 'list',
        name: 'languages-list',
        props: true,
        component: () => import ('../pages/languages/list')
      },
      {
        path: 'add',
        name: 'languages-add',
        props: true,
        component: () => import ('../pages/languages/add')
      }
    ]
  },
  {
    // not found handler
    path: '*',
    component: () =>
      import ('../pages/not-found/index')
  }
]
Vue.use(VueRouter)

// Routing logic
var router = new VueRouter({
  routes: routes,
  mode: 'history',
  linkExactActiveClass: 'active',
  scrollBehavior: function(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})
// Some middleware to help us ensure the user is authenticated.
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth) && (!store.state._auth.token || store.state._auth.token === 'null')) {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page.
//     window.console.log('Not authenticated')
//     next({ path: '/auth', query: { redirect: to.fullPath } })
//   } else next()
// })

export default router
