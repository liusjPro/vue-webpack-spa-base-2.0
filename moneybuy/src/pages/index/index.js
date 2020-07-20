import Vue from "vue";

import '../../assets/js/app'

import index from "./index.vue";
// Import App Component
import App from '../../components/app.vue';

Vue.config.productionTip = false;

// Init App
new Vue({
  render: (h) => h(App, index),
}).$mount("#app");



