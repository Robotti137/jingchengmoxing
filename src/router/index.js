import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/admin/Login'
import Manage from '../components/admin/manage/Manage'
import Specification from '../components/admin/manage/Specification'

Vue.use(VueRouter)

let router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Login
        },
        {
            path: '/admin/login',
            component: Login
        },
        {
            path: '/admin',
            component: Manage
        },
        {
            path: '/admin/manage',
            component: Manage,
            children: [
                {
                    path: '/admin/manage/specification',
                    component: Specification,
                }
            ]
        }
    ]
})

//判断用户是否登录
router.beforeEach((to, from, next) => {
    if (to.path === '/admin/login') {
        next()
        return
    }
    next()
    let userinfo = JSON.parse(sessionStorage.getItem('jcmx-userinfo'))
    if (!userinfo) {
        next({ path: '/admin/login' })
    } else {
        next()
    }
})

export default router