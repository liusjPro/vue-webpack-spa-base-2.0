import Vue from 'vue'
import error from './error.vue'
// 共通API导入
import '@/assets/js/httpUser.js'

Vue.config.productionTip = false
console.log(process.env)

new Vue({
  render: h => h(error)
}).$mount('#app')