//import Vue from 'vue'
//import ElementUI from 'element-ui'
//import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
//import Axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL='/api'
Vue.config.productionTip = false

//Vue.use(ElementUI)

new Vue({
  el: '#app',
  render: h => h(App),
  router:router
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
