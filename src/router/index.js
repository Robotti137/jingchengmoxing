import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/admin/Login')
const Manage = () => import('../components/admin/manage')
const Project = () => import('../components/admin/project')
const Maintain = () => import('../components/admin/maintain')
const Remote = () => import('../components/admin/remote')
const Application = () => import('../components/admin/application')

Vue.use(VueRouter)

let router = new VueRouter({
    mode: 'history',
    routes: [{
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
            children: [{
                    path: '/admin/manage/project',
                    component: Project,
                },
                {
                    path: '/admin/manage/maintain',
                    component: Maintain,
                },
                {
                    path: '/admin/manage/remote',
                    component: Remote,
                },
                {
                    path: '/admin/manage/application',
                    component: Application,
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
        next({
            path: '/admin/login'
        })
    } else {
        next()
    }
})

export default router