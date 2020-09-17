import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'logon',
    meta: {},
    component: () => import('../views/logon.vue')
  },
  {
    path: '/Home',
    name: 'Home',
    hidden: false,
    meta: {
      title: '主页',
      icon: 'inbox',
      noCache: true
    },
    component: () => import('../views/home.vue'),
    children: [
      {
        path: '/tree',
        name: 'tree',
        hidden: false,
        meta: {
          title: '列表',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/home.vue')
      },
      {
        path: '/noty',
        name: 'noty',
        hidden: false,
        meta: {
          title: '修改',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/noty.vue')
      },
      {
        path: '/home',
        name: 'home',
        hidden: false,
        meta: {
          title: '主页',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/home/home.vue')
      },
      {
        path: '/grid_massage',
        name: 'grid_massage',
        hidden: false,
        meta: {
          title: '主页',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/home/grid_massage.vue'),
        children: [
          {
            path: '/about',
            name: 'About',
            hidden: false,
            meta: {
              title: '列表',
              icon: 'inbox',
              noCache: true
            },
            component: () => import('../views/About.vue')
          }
        ]
      },
      {
        path: '/test',
        name: 'test',
        hidden: false,
        meta: {
          title: '测试',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/test.vue')
      },
      {
        path: '/wl',
        name: 'wl',
        hidden: false,
        meta: {
          title: '物联网',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/test/wl.vue')
      },
      {
        path: '/request_test',
        name: 'request_test',
        hidden: false,
        meta: {
          title: '物联网',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/test/request_test')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
