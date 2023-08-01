import { createRouter, createWebHashHistory } from 'vue-router'

// 引入静态路由
import { routes } from './routes'

// 创建路由器
const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
    // 页面滚动后不在顶部时，跳转到其他页回归顶部
    scrollBehavior() {
        return {
            left: 0,
            top: 0
        }
    }
})


export default router