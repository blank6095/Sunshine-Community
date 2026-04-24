import config from '@/config'
import { getToken, hasValidToken, removeToken, isTokenExpired } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { useUserStore } from '@/store/modules/user'
import { toast, showConfirm, tansParams } from '@/utils/common'

let timeout = 10000
const baseUrl = config.baseUrl
let isRefreshing = false
let refreshSubscribers = []

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback)
}

function onTokenRefreshed(token) {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

function redirectToLogin() {
  const currentPage = getCurrentPages()
  const currentRoute = currentPage.length > 0 ? currentPage[currentPage.length - 1].route : ''
  const currentOptions = currentPage.length > 0 ? currentPage[currentPage.length - 1].options || {} : {}
  
  let redirectUrl = '/pages/login'
  if (currentRoute && !currentRoute.includes('login')) {
    const queryString = Object.keys(currentOptions)
      .map(key => `${key}=${encodeURIComponent(currentOptions[key])}`)
      .join('&')
    redirectUrl += `?redirect=${encodeURIComponent('/' + currentRoute + (queryString ? '?' + queryString : ''))}`
  }
  
  const userStore = useUserStore()
  userStore.logout().then(() => {
    uni.reLaunch({ url: redirectUrl })
  }).catch(() => {
    uni.reLaunch({ url: redirectUrl })
  })
}

function handleAuthError(message) {
  if (isRefreshing) return
  isRefreshing = true
  
  showConfirm('登录状态已过期，您可以继续留在该页面，或者重新登录?').then(res => {
    isRefreshing = false
    onTokenRefreshed(null)
    if (res.confirm) {
      redirectToLogin()
    }
  }).catch(() => {
    isRefreshing = false
    onTokenRefreshed(null)
    redirectToLogin()
  })
}

const request = config => {
  const isToken = (config.headers || {}).isToken === false
  config.header = config.header || {}
  
  if (hasValidToken() && !isToken) {
    if (isTokenExpired()) {
      handleAuthError('登录状态已过期')
      return Promise.reject(new Error('Token 已过期'))
    }
    config.header['Authorization'] = 'Bearer ' + getToken()
  }
  
  if (config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1)
    config.url = url
  }
  
  return new Promise((resolve, reject) => {
    uni.request({
      method: config.method || 'get',
      timeout: config.timeout || timeout,
      url: config.baseUrl || baseUrl + config.url,
      data: config.data,
      header: config.header,
      dataType: 'json'
    }).then(response => {
      const res = response
      const statusCode = res.statusCode
      const code = res.data?.code
      const msg = errorCode[code] || res.data?.msg || errorCode['default']
      
      if (statusCode === 401) {
        handleAuthError('登录状态已过期，请重新登录')
        reject(new Error('401: 登录状态已过期'))
      } else if (statusCode === 403) {
        toast('没有权限访问该资源')
        reject(new Error('403: 没有权限'))
      } else if (statusCode === 500) {
        toast(msg || '服务器内部错误')
        reject(new Error('500: ' + (msg || '服务器内部错误')))
      } else if (code !== 200 && code !== undefined) {
        toast(msg)
        reject(code)
      }
      
      resolve(res.data)
    }).catch(error => {
      let { message } = error
      if (message === 'Network Error') {
        toast('网络连接失败，请检查网络')
      } else if (message.includes('timeout')) {
        toast('请求超时，请稍后重试')
      } else if (message.includes('Request failed with status code')) {
        const status = message.slice(-3)
        if (status === '401') {
          handleAuthError('登录状态已过期')
        } else if (status === '403') {
          toast('没有权限访问该资源')
        } else {
          toast('系统接口' + status + '异常')
        }
      } else {
        toast('请求失败，请稍后重试')
      }
      reject(error)
    })
  })
}

export { request as default, redirectToLogin }
