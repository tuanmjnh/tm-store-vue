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
    component: () => import ('../pages/users/index'),
    meta: { description: 'Overview of environment',  requiresAuth: true},
    children: [{
        path: '',
        component: () => import ('../pages/users/list')
      },
      {
        path: 'add',
        // props: true,
        component: () => import ('../pages/users/add')
      }
    ]
  },
  {
    // not found handler
    path: '*',
    component: () => import ('../pages/not-found/index')
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
