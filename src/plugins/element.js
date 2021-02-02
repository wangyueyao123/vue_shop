import Vue from 'vue'
import { Button, Form, FormItem, Input } from 'element-ui'
//导入弹窗提示组件
import { Message } from 'element-ui'


Vue.use(Button)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Form)

Vue.prototype.$message = Message
    //全局都可通过this.$message访问