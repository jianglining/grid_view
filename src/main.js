import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './quasar'
import animated from 'animate.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { LoadingBar } from 'quasar'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios

// 全局加载栏效果
LoadingBar.setDefaults({
  color: 'blue',
  size: '2px',
  position: 'top'
})

router.beforeEach((to, from, next) => {
  LoadingBar.start()
  next()
})

router.afterEach(() => {
  LoadingBar.stop()
})

Vue.config.productionTip = false
Vue.use(animated, mavonEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
