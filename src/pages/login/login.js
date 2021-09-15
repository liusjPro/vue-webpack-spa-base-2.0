import Vue from 'vue'
import login from './login.vue'
// 共通API导入
import '@/assets/js/httpUser.js'

Vue.config.productionTip = false
console.log(process.env)

new Vue({
  render: h => h(login)
}).$mount('#app')