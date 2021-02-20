import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'


Vue.use(VueRouter)

const router = new VueRouter({
        routes: [
            { path: '/', redirect: '/login' }, // 访问根路径自动重定向到login
            { path: '/login', component: Login },
            {
                path: '/home',
                component: Home,
                //home重定向到welcome 
                redirect: '/welcome',
                //children添加home下子路由
                children: [
                    { path: '/Welcome', component: Welcome },
                    //由所访问路径决定
                    { path: '/users', component: Users },
                    { path: '/rights', component: Rights },
                    { path: '/roles', component: Roles },
                    { path: '/categories', component: Cate },
                    { path: '/params', component: Params }

                ]
            }
        ]
    })
    //挂载路由导航守卫
router.beforeEach((to, from, next) => {
    //to将要访问的路径
    //from 代表从哪个路径跳转来
    //next是一个函数，表示放行
    // next()放行 next('/login')表示强制跳转
    if (to.path === '/login') return next();

    // 获取token，判断对不对
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router