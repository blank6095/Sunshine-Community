import axios from 'axios'
import { Toast } from 'vant'

const request = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
})

const errorCodeMessages = {
  1001: '用户不存在',
  1002: '用户名或密码错误',
  1003: '用户名已存在',
  1004: '手机号码已被注册',
  1005: '身份证号已被使用',
  1006: '邮箱已被注册',
  2001: '科室不存在',
  2002: '科室名称已存在',
  3001: '医生不存在',
  3002: '该用户不是医生角色',
  4001: '排班不存在',
  4002: '该排班已取消',
  4003: '该排班已满',
  5001: '预约不存在',
  5002: '预约已完成，无法操作',
  5003: '预约已取消，无法操作',
  5004: '预约时间已过，无法操作',
}

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    Toast.fail('请求发送失败')
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === 200 || res.code === 201) {
      return res
    }
    
    const errorMsg = errorCodeMessages[res.code] || res.message || '请求失败'
    Toast.fail(errorMsg)
    return Promise.reject(new Error(errorMsg))
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        Toast.fail('登录已过期，请重新登录')
        setTimeout(() => {
          window.location.href = '/login'
        }, 500)
      } else if (status === 403) {
        Toast.fail('无权访问该资源')
      } else if (status === 400) {
        const errorMsg = errorCodeMessages[data?.code] || data?.message || '请求参数错误，请检查输入'
        Toast.fail(errorMsg)
      } else if (status === 404) {
        Toast.fail('请求的资源不存在')
      } else if (status === 500) {
        Toast.fail('服务器内部错误，请稍后重试')
      } else {
        Toast.fail(data?.message || '网络错误')
      }
    } else if (error.code === 'ECONNABORTED') {
      Toast.fail('请求超时，请检查网络连接')
    } else {
      Toast.fail('网络连接失败，请检查网络设置')
    }
    return Promise.reject(error)
  }
)

export default request
