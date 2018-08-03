import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'
// export default new Router({
//   mode: 'history',
//   routes: [{
//     path: '/',
//     name: 'HelloWorld',
//     component: HelloWorld
//   }]
// })
// Routes
const routes = [{
    path: '/login',
    component: () => import('../views/auth/index')
  },
  {
    path: '/dashboard',
    alias: '',
    component: () => import('../views/dashboard/index'),
    name: 'dashboard',
    meta: {
      description: 'Overview of environment',
      requiresAuth: true
    }
  },
  {
    path: '/class',
    alias: '',
    component: () => import('../views/class/index'),
    name: 'class',
    meta: {
      description: 'Overview of environment',
      requiresAuth: true
    },
    children: [{
        path: '',
        component: () => import('../views/class/list')
      },
      {
        path: 'class-component/:id',
        name: 'class-component',
        props: true,
        component: () => import('../views/class/class-component')
      }
    ]
  },
  {
    path: '/courses',
    alias: '',
    component: () => import('../views/courses/index'),
    name: 'courses',
    meta: {
      description: 'Overview of environment',
      requiresAuth: true
    },
    children: [{
        path: '',
        component: () => import('../views/courses/list')
      }
    ]
  },
  {
    path: '/exercises',
    component: () => import('../views/exercises/index'),
    name: 'exercises',
    meta: {
      description: 'Overview of environment',
      requiresAuth: true
    }
  },
  {
    path: '/lesson',
    alias: '',
    component: () => import('../views/lesson/index'),
    name: 'lesson',
    meta: {
      description: 'Overview of environment',
      requiresAuth: true
    }
  },
  {
    path: '/member',
    alias: '',
    component: () => import('../views/member/index'),
    name: 'member',
    meta: {
      description: 'Overview of environment',
      requiresAuth: true
    }
  },
  {
    path: '/question',
    alias: '',
    component: () => import('../views/question/index'),
    name: 'question',
    meta: {
      description: 'Overview of environment',
      requiresAuth: true
    }
  },
  {
    path: '/test',
    component: () => import('../views/test/index'),
    name: 'test',
    meta: {
      description: 'List of our servers',
      requiresAuth: true
    }
  },
  {
    path: '/users',
    component: () => import('../views/users/index'),
    name: 'users',
    meta: {
      description: 'List of our servers',
      requiresAuth: true
    }
  },
  {
    path: '/upload',
    component: () => import('../views/upload/index'),
    name: 'upload',
    meta: {
      description: 'List of our servers',
      requiresAuth: true
    }
  },
  {
    // not found handler
    path: '*',
    component: () => import('../views/not-found/index')
  }
]
Vue.use(VueRouter)

// Routing logic
var router = new VueRouter({
  routes: routes,
  mode: 'history',
  linkExactActiveClass: 'active',
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || {
      x: 0,
      y: 0
    }
  }
})
// Some middleware to help us ensure the user is authenticated.
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && (!store.state._auth.token || store.state._auth.token === 'null')) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    window.console.log('Not authenticated')
    next({
      path: '/auth',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    next()
  }
})

export default router
