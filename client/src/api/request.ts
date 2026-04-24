import { getToken, setToken, removeToken } from '@/utils/storage'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

const requestInterceptors = {
  requestBefore: (config: UniApp.RequestOptions) => {
    const token = getToken()
    if (token) {
      config.header = {
        ...config.header,
        'Authorization': `Bearer ${token}`
      }
    }
    uni.showLoading({ title: '加载中...', mask: true })
    return config
  },
  requestAfter: (response: UniApp.Response<any>) => {
    uni.hideLoading()
    return response
  }
}

const responseInterceptors = {
  success: (response: UniApp.Response<any>) => {
    const { statusCode, data } = response

    if (statusCode === 200) {
      if (data.code === 200) {
        return data.data
      } else if (data.code === 401) {
        handleUnauthorized()
        return Promise.reject(new Error(data.msg || '登录已过期'))
      } else if (data.code === 403) {
        uni.showToast({ title: '无权限访问', icon: 'none' })
        return Promise.reject(new Error(data.msg || '无权限访问'))
      } else if (data.code === 500) {
        uni.showToast({ title: '服务器错误', icon: 'none' })
        return Promise.reject(new Error(data.msg || '服务器错误'))
      } else {
        uni.showToast({ title: data.msg || '请求失败', icon: 'none' })
        return Promise.reject(new Error(data.msg))
      }
    } else if (statusCode === 401) {
      handleUnauthorized()
      return Promise.reject(new Error('登录已过期，请重新登录'))
    } else if (statusCode === 403) {
      uni.showToast({ title: '无权限访问', icon: 'none' })
      return Promise.reject(new Error('无权限访问'))
    } else if (statusCode === 404) {
      uni.showToast({ title: '请求地址不存在', icon: 'none' })
      return Promise.reject(new Error('请求地址不存在'))
    } else if (statusCode >= 500) {
      uni.showToast({ title: '服务器错误', icon: 'none' })
      return Promise.reject(new Error('服务器错误'))
    } else {
      uni.showToast({ title: '网络错误', icon: 'none' })
      return Promise.reject(new Error('网络错误'))
    }
  },
  fail: (error: any) => {
    uni.hideLoading()
    uni.showToast({ title: '网络连接失败', icon: 'none' })
    return Promise.reject(error)
  }
}

function handleUnauthorized() {
  removeToken()
  uni.reLaunch({ url: '/pages/login/index' })
}

export function request<T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  customHeader?: Record<string, string>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const config: UniApp.RequestOptions = requestInterceptors.requestBefore({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...customHeader
      },
      timeout: 15000
    })

    uni.request({
      ...config,
      success: (res) => {
        requestInterceptors.requestAfter(res)
        const result = responseInterceptors.success(res)
        if (result instanceof Promise) {
          result.then(resolve).catch(reject)
        } else {
          resolve(result as T)
        }
      },
      fail: (err) => {
        responseInterceptors.fail(err)
        reject(err)
      }
    })
  })
}

export function get<T = any>(url: string, params?: any, customHeader?: Record<string, string>) {
  let queryString = ''
  if (params) {
    queryString = '?' + Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&')
  }
  return request<T>(url + queryString, 'GET', undefined, customHeader)
}

export function post<T = any>(url: string, data?: any, customHeader?: Record<string, string>) {
  return request<T>(url, 'POST', data, customHeader)
}

export function put<T = any>(url: string, data?: any, customHeader?: Record<string, string>) {
  return request<T>(url, 'PUT', data, customHeader)
}

export function del<T = any>(url: string, data?: any, customHeader?: Record<string, string>) {
  return request<T>(url, 'DELETE', data, customHeader)
}

export function uploadFile(
  url: string,
  filePath: string,
  name: string,
  formData?: Record<string, string>
): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.showLoading({ title: '上传中...' })
    const token = getToken()
    uni.uploadFile({
      url: BASE_URL + url,
      filePath,
      name,
      formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        uni.hideLoading()
        const data = JSON.parse(res.data)
        if (data.code === 200) {
          resolve(data.data)
        } else {
          uni.showToast({ title: data.msg || '上传失败', icon: 'none' })
          reject(new Error(data.msg))
        }
      },
      fail: (err) => {
        uni.hideLoading()
        uni.showToast({ title: '上传失败', icon: 'none' })
        reject(err)
      }
    })
  })
}
