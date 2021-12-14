import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import jsmediatags from "jsmediatags";

Vue.config.productionTip = false;

new Vue({
	jsmediatags,
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");

require('./freqtimeupdate.js')