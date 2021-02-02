import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

// //给后台扔包前的准备工作
// import axios from 'axios'
// Vue.prototype.$http = axios
//     //每个组件都可通过this.$http发起axios请求
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//     //声明请求根路径




Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')