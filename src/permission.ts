// 鉴权  项目中路由能不能被权限访问设置

import router from "./router";

// 引入滚动条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

import { getToken } from "./unitl/token";

import pinia from "./store";
import useUserStore from "./store/modules/user";
const userStore = useUserStore(pinia);


// 全局守卫  项目中所有路由的切换都会触发的钩子函数

// 全局前置守卫
router.beforeEach( async(to: any, from: any, next: any) => {
    // 滚动条开始
    nprogress.start();

    // 获取token
    let token = getToken();

    if (!token) {
        if (to.path === '/login') {
            next()
        } else {
            next('/login')
        }
    } else {
        if (to.path === '/login') {
            next('/')
        } else {
            // 有token并且跳转到非登录页  判断有用户信息吗
            if (userStore.username) {
                next()
            } else {
                try {
                    await userStore.userInfo();
                    //刷新的时候是异步路由，有可能出现获取到用户信息但是异步路由还没加载完，导致页面空白
                    next({...to})
                } catch (error) {
                    // 如果获取不到用户信息说明token过期了  
                    // 就退出登录
                    userStore.exitLogin();
                    next('/login')
                }

            }
        }
    }
})


// 全局后置守卫
router.afterEach((to: any) => {
    nprogress.done();  //滚动条结束

    // 左上角文字
    document.title = '硅谷甄选 - ' + to.meta.title;
})