import axios from 'axios'
import { ElMessage } from 'element-plus'
// 创建axios实例
const http = axios.create({
  baseURL: '/api',
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
    // ,
    // 'Access-Control-Allow-Origin': 'https://www.xueqiu.com',
    // 'Access-Control-Allow-Credentials': true,
    // 'Access-Control-Allow-Methods': 'GET, POST',
    // 'Access-Control-Allow-Headers': 'Cookie, Origin'
  }
})

// 请求拦截器
http.interceptors.request.use(
  config => {
    // 示例：从localStorage获取token并添加到请求头
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 请求错误处理
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    // 直接返回响应数据中的data字段
    return response.data
  },
  error => {
    // 响应错误处理
    const { response } = error

    if (response) {
      // 根据状态码处理不同错误
      switch (response.status) {
        case 401:
          // 未授权，示例：跳转到登录页
          window.location.href = '/login'
          break
        case 403:
          ElMessage.error('权限不足，请联系管理员')
          break
        case 404:
          ElMessage.error('请求资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(`请求错误: ${response.status}`)
      }
    } else {
      // 网络错误
      ElMessage.error('网络连接异常，请检查网络')
    }

    return Promise.reject(error)
  }
)

export default http
