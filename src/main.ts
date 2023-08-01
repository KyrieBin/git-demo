import { createApp } from 'vue'

import App from '@/App.vue'

// 引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入pinia
import pinia from './store'

// 注册路由
import router from './router'

// 引入全局图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// @ts-ignore  <=  加上这个命令就不会报红色警告了
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'   //国际化

const app = createApp(App)

// 注册路由
app.use(router)

// 注册pinia
app.use(pinia)

// Ui组件库国际化
app.use(ElementPlus, {
    locale: zhCn,
})

// 注册全局图标库
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 注册全局组件   常规使用方法
// import Svg from '@/components/SvgIcon'
// app.component('Svg', Svg);

// 非常规使用方法  （自定义插件的方法）
import Overall from '@/components/Overall'
app.use(Overall)

// svg插件需要的配置
import 'virtual:svg-icons-register'

// 引入全局样式
import '@/styles/index.scss'

// 引入路由权限文件
import './permission'

// 挂载  写在最下边
app.mount('#app')