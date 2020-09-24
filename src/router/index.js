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
        path: '/about',
        name: 'About',
        hidden: false,
        meta: {
          title: '列表',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/About.vue')
      },
      {
        path: '/gridInfo',
        name: 'gridInfo',
        hidden: false,
        component: () => import('../views/home/gridInfo.vue')
      },
      {
        path: '/deviceConfig',
        name: 'deviceConfig',
        hidden: false,
        component: () => import('../views/home/deviceConfig.vue')
      },
      {
        path: '/device_info',
        name: 'device_info',
        hidden: false,
        meta: {
          title: '测试',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/device_info.vue')
      },
      {
        path: '/openService',
        name: 'openService',
        hidden: false,
        meta: {
          title: '测试',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/openService.vue')
      },
      {
        path: '/alarmInfo',
        name: 'alarmInfo',
        hidden: false,
        meta: {
          title: '测试',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/alarmInfo.vue')
      },
      {
        path: '/calibrationInfo',
        name: 'calibrationInfo',
        hidden: false,
        meta: {
          title: '测试',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/calibrationInfo.vue')
      },
      {
        path: '/dataStatistics',
        name: 'dataStatistics',
        hidden: false,
        meta: {
          title: '测试',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/dataStatistics.vue')
      },
      {
        path: '/sceneConfig',
        name: 'sceneConfig',
        hidden: false,
        meta: {
          title: '场景配置',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/scene/SceneConfig.vue')
      },
      {
        path: '/eventAnalysis',
        name: 'EventAnalysis',
        hidden: false,
        meta: {
          title: '测试',
          icon: 'inbox',
          noCache: true
        },
        component: () => import('../views/Events/EventAnalysis.vue')
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
