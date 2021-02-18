import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

// //给后台扔包前的准备工作
import axios from 'axios'
//声明请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // axios.defaults.baseURL = 'http://10.19.9.225:8888/api/private/v1/'

Vue.prototype.$http = axios
    //每个组件都可通过this.$http发起axios请求


//请求拦截器
axios.interceptors.request.use(config => {
    console.log(config)
        //为请求头对象(config.header)，添加token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem("token")
        // 必须return config 
        // 令牌在token中
    return config
})



Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')