import Vue from "vue";

import '../../assets/js/app'

import index from "./index.vue";

import App from '../../components/app.vue';

Vue.config.productionTip = false;

// Init App
new Vue({
  render: (h) => h(App),
}).$mount("#app");

// Init App
new Vue({
  render: (h) => h(index),
}).$mount("#app1");
