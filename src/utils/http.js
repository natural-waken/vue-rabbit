import axios from 'axios'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { useUserStore } from '@/stores/userStore'
import router from '@/router'

// 创建 axios 实例
const httpInstance = axios.create({
    // 基地址
    baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
    // 超时间
    timeout: 5000
})

// 拦截器            
// axios 请求拦截器
httpInstance.interceptors.request.use(config => {
    // 1. 从 pinia 中获取 token 数据
    const userStore = useUserStore()

    // 2. 按照后端的要求拼接 token
    const token = userStore.userInfo.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
}, e => Promise.reject(e))

// axios 响应式拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
    // 请求失败统一拦截错误提示
    ElMessage({
        type: 'warning',
        message: e.response.data.message
    })

    // 401  token  失效处理
    // 1. 清除本地用户数据
    // 2. 跳转到登录页
    if (e.response.status === 401) {
        useUserStore.clearUserInfo()
        router.push('/login')
    }


    return Promise.reject(e)
})


export default httpInstance















