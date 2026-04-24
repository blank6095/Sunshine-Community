import { getToken, hasValidToken, removeToken, isTokenExpired } from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'

const loginPage = "/pages/login"
const homePage = "/pages/hospital/index"

const whiteList = [
  '/pages/login',
  '/pages/register',
  '/pages/common/webview/index',
  '/pages/common/textview/index',
  '/pages/hospital/index'
]

function checkWhite(url) {
  const path = url.split('?')[0]
  return whiteList.some(page => path === page)
}

function getRedirectUrl() {
  const currentPage = getCurrentPages()
  if (currentPage.length === 0) return ''
  
  const currentRouter = currentPage[currentPage.length - 1]
  const route = '/' + currentRouter.route
  const options = currentRouter.options || {}
  
  if (checkWhite(route)) return ''
  
  const queryParams = Object.keys(options)
    .map(key => `${key}=${encodeURIComponent(options[key])}`)
    .join('&')
  
  const fullPath = route + (queryParams ? '?' + queryParams : '')
  return `?redirect=${encodeURIComponent(fullPath)}`
}

function handleAuthRedirect() {
  const redirect = getRedirectUrl()
  const redirectUrl = loginPage + redirect
  
  const userStore = useUserStore()
  userStore.logout().then(() => {
    uni.reLaunch({ url: redirectUrl })
  }).catch(() => {
    uni.reLaunch({ url: redirectUrl })
  })
}

let isNavigating = false
let navigationQueue = []

function processNavigation() {
  if (navigationQueue.length === 0) {
    isNavigating = false
    return
  }
  
  const nav = navigationQueue.shift()
  uni[nav.method]({
    url: nav.url,
    fail: (err) => {
      console.log('Navigation failed:', err)
      processNavigation()
    }
  })
}

function queueNavigate(method, url) {
  navigationQueue.push({ method, url })
  if (!isNavigating) {
    isNavigating = true
    processNavigation()
  }
}

let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"]
list.forEach(item => {
  uni.addInterceptor(item, {
    invoke(to) {
      if (checkWhite(to.url)) {
        if ((item === 'navigateTo' || item === 'redirectTo') && hasValidToken() && !isTokenExpired()) {
          const path = to.url.split('?')[0]
          if (path === loginPage) {
            queueNavigate('reLaunch', homePage)
            return false
          }
        }
        return true
      }
      
      if (!hasValidToken() || isTokenExpired()) {
        const redirect = getRedirectUrl()
        const redirectUrl = loginPage + redirect
        
        if (item === 'switchTab') {
          queueNavigate('reLaunch', redirectUrl)
        } else {
          queueNavigate('reLaunch', redirectUrl)
        }
        return false
      }
      
      if ((item === 'navigateTo' || item === 'redirectTo') && to.url.split('?')[0] === loginPage) {
        queueNavigate('reLaunch', homePage)
        return false
      }
      
      return true
    },
    fail(err) {
      console.log('Navigation interceptor error:', err)
    }
  })
})

export { handleAuthRedirect, checkWhite }
