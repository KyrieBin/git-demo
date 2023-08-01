// 用户信息相关小仓库

// 引入小仓库
import { defineStore } from 'pinia'

// 引入存放接口文件
import api from '@/api'

// 引入ts类型  (小仓库的state参数、请求接口索要携带的参数、接口响应过来的数据)
import type { loginFormData, loginResponseData } from '@/api/type/user'

// 引入静态路由
import { routes, asyncRoutes, anyRoutes } from '@/router/routes'

import router from '@/router'

// @ts-ignore  忽略ts校验
import { cloneDeep } from 'lodash'

// 筛选匹配的路由
const fiterRoute = (asyncRoutes, newRoute) => {
    let arr: any = [];
    asyncRoutes.forEach(ele => {
        if (newRoute.indexOf(ele.name) !== -1) {
            if (ele.children && ele.children > 0) {
                ele.children = fiterRoute(ele.children, newRoute);
            }
            arr.push(ele);
        }
    });
    console.log('arr', arr);

    return arr;
}



// 引入小仓库数据类型
import { UserState } from './type/types'

// 创建小仓库
const useUserStore = defineStore('User', {
    state: (): UserState => {
        return {
            token: localStorage.getItem('token') || '',
            menuRoutes: routes,   //仓库菜单导航
            username: '',  //用户名
            avatar: '',  //头像
            routesY: []  //动态路由
        }
    },
    actions: {
        // 用户登录的方法
        async userLogin(d: loginFormData) {
            let res: loginResponseData = await api.getLogin(d);
            console.log('登录请求', res);
            if (res.code === 200) {
                this.token = res.data;
                localStorage.setItem('token', res.data);
                return this.token; //能保证当前async函数返回一个成功的promise
            } else {
                return Promise.reject(new Error(res.data.message))
            }
        },
        // 获取用户信息方法  登录成功后就获取
        async userInfo() {
            let res = await api.getInfo();
            console.log('用户信息', res);
            if (res.code === 200) {
                this.username = res.data.name;
                this.avatar = res.data.avatar;
                this.routesY = res.data.routes;
                // 深拷贝一下异步静态路由， 不然会影响其他用户登录显示的路由
                let haha = fiterRoute(cloneDeep(asyncRoutes), this.routesY);
                this.menuRoutes = [...routes, ...haha, anyRoutes];
                haha.forEach(ele => {
                    router.addRoute(ele)
                });
                console.log('当前路由------------------', router.getRoutes());
                return 'ok'
            }else{
                return Promise.reject('获取用户信息失败')
            }
        },
        // 退出登录方法
        async exitLogin() {
            let res = await api.getLogout();
            console.log('退出登录', res);

            if (res.code === 200) {
                localStorage.removeItem('token');
                this.token = '';
                this.username = '';
                this.avatar = '';
                this.routesY = []
            }
        }
    },
    getters: {

    }
})

export default useUserStore