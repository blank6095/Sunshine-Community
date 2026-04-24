import axios from 'axios'
import { Toast } from 'vant'

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === 200 || res.code === 201) {
      return res
    }
    Toast.fail(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        Toast.fail('登录已过期，请重新登录')
      } else if (status === 403) {
        Toast.fail('无权访问')
      } else {
        Toast.fail(data?.message || '网络错误')
      }
    } else {
      Toast.fail('网络连接失败')
    }
    return Promise.reject(error)
  }
)

export default request
