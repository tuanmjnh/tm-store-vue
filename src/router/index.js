import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'
// Routes
const routes = [{
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/index')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    alias: '',
    meta: { description: 'Overview of environment', requiresAuth: true },
    component: () => import('../views/dashboard/index')
  },
  {
    path: '/users',
    name: 'users',
    alias: '',
    component: () => import('../views/users/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/roles',
    name: 'roles',
    alias: '',
    component: () => import('../views/roles/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/modules',
    name: 'modules',
    alias: '',
    component: () => import('../views/modules/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/languages',
    name: 'languages',
    alias: '',
    component: () => import('../views/languages/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/dictionary/:lang?',
    name: 'dictionary',
    alias: '',
    component: () => import('../views/dictionary/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    path: '/informations',
    name: 'informations',
    alias: '',
    component: () => import('../views/informations/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  // {
  //   path: '/languages',
  //   name: 'languages',
  //   alias: '',
  //   redirect: { name: 'languages-list' },
  //   component: () => import ('../views/languages/index'),
  //   meta: { description: 'Overview of environment', requiresAuth: true },
  //   children: [{
  //       path: 'list',
  //       name: 'languages-list',
  //       props: true,
  //       component: () => import ('../views/languages/list')
  //     },
  //     {
  //       path: 'add',
  //       name: 'languages-add',
  //       props: true,
  //       component: () => import ('../views/languages/add')
  //     }
  //   ]
  // },
  // {
  //   path: '/auth',
  //   name: 'authentication',
  //   alias: '',
  //   component: () => import ('../layouts/vuetify/auth'),
  //   meta: { description: 'Overview of environment', requiresAuth: true }
  // },
  {
    path: '/auth',
    name: 'authentication',
    alias: '',
    component: () => import('../views/dashboard/index'),
    meta: { description: 'Overview of environment', requiresAuth: true }
  },
  {
    // not found handler
    path: '*',
    component: () =>
      import('../views/not-found/index')
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
