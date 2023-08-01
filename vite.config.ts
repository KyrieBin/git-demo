
import { defineConfig, loadEnv } from 'vite'

import vue from '@vitejs/plugin-vue'

import path from 'path'

//引入svg需要用到插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

// 新写法
export default defineConfig(({ command, mode }) => {
  // 获取各种环境下对应的变量
  // let env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹(路径为存放所有svg图标的文件夹不单个svg图标)
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      }),
      viteMockServe({
        enable: true,//保证开发阶段可以使用mock接口
      })
    ],

    resolve: {
      alias: {
        '@': path.resolve("./src") // 路径别名
      },
      extensions: ['.js', '.json', '.ts', '.vue'] // 使用路径别名时想要省略的后缀名，可以自己 增减
    },

    css: { // 使用scss变量配置
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/variable.scss";' // 加载全局样式，使用scss特性变量
        }
      },
    },

    //代理跨域
    server: {
      proxy: {
        '/api': {
          //获取数据的服务器地址设置
          target: 'http://sph-api.atguigu.cn',
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
  }
})
