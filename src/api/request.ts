// axios二次封装

import axios from "axios";
// 弹出提示
import { ElMessage } from 'element-plus'

// 创建axios实例
const request = axios.create({
    baseURL: '/api',
    timeout: 5000
})
// 请求拦截器
request.interceptors.request.use(config => {
    if (localStorage.getItem('token')) {
        config.headers.token = localStorage.getItem('token')
    }
    // config配置对象有一个header属性(请求头)，用来存储公共参数 如token
    return config
})
// 响应拦截器
request.interceptors.response.use(response => {
    return response.data   //也可以直接返回response.data
}, error => {
    // 存储错误信息
    let message = '';
    // 获取http状态码
    let status = error.response.status;
    switch (status) {
        case 401:
            message = 'token过期'
            break;
        case 403:
            message = '无权限访问'
            break;
        case 404:
            message = '请求地址错误'
            break;
        case 500:
            message = '服务器的问题'
            break;
        default:
            message = '网络出现问题'
    }
    // 最后弹出错误状态
    ElMessage({
        showClose: true,
        message,
        type: 'error',
    })
    return Promise.reject(error);
})

export default request