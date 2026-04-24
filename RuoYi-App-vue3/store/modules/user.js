import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import config from '@/config'
import storage from '@/utils/storage'
import constant from '@/utils/constant'
import { isHttp, isEmpty } from "@/utils/validate"
import { getInfo, login, logout } from '@/api/login'
import { getToken, removeToken, setToken, hasValidToken, clearAuthStorage, getAuthStatus } from '@/utils/auth'
import defAva from '@/static/images/profile.jpg'

const baseUrl = config.baseUrl

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const id = ref(storage.get(constant.id))
  const name = ref(storage.get(constant.name))
  const avatar = ref(storage.get(constant.avatar))
  const roles = ref(storage.get(constant.roles))
  const permissions = ref(storage.get(constant.permissions))
  const isLoading = ref(false)
  const loginState = ref(hasValidToken())

  // 计算属性
  const isLoggedIn = computed(() => hasValidToken())
  const authStatus = computed(() => getAuthStatus())

  const SET_TOKEN = (val, expireTime) => {
    token.value = val
    loginState.value = !!val
    if (val) {
      setToken(val, expireTime)
    }
  }
  const SET_ID = (val) => {
    id.value = val
    storage.set(constant.id, val)
  }
  const SET_NAME = (val) => {
    name.value = val
    storage.set(constant.name, val)
  }
  const SET_AVATAR = (val) => {
    avatar.value = val
    storage.set(constant.avatar, val)
  }
  const SET_ROLES = (val) => {
    roles.value = val
    storage.set(constant.roles, val)
  }
  const SET_PERMISSIONS = (val) => {
    permissions.value = val
    storage.set(constant.permissions, val)
  }

  const CLEAR_USER_STATE = () => {
    token.value = ''
    id.value = ''
    name.value = ''
    avatar.value = ''
    roles.value = []
    permissions.value = []
    loginState.value = false
  }

  const loginAction = (userInfo) => {
    const username = userInfo.username.trim()
    const password = userInfo.password
    const code = userInfo.code
    const uuid = userInfo.uuid
    return new Promise((resolve, reject) => {
      isLoading.value = true
      login(username, password, code, uuid).then(res => {
        const expireTime = res.expireTime || 7 * 24 * 60 * 60 * 1000
        SET_TOKEN(res.token, expireTime)
        isLoading.value = false
        resolve()
      }).catch(error => {
        isLoading.value = false
        reject(error)
      })
    })
  }

  const getInfoAction = () => {
    return new Promise((resolve, reject) => {
      if (!hasValidToken()) {
        reject(new Error('未登录或登录已过期'))
        return
      }
      
      isLoading.value = true
      getInfo().then(res => {
        const user = res.user
        let avatar = user.avatar || ""
        if (!isHttp(avatar)) {
          avatar = (isEmpty(avatar)) ? defAva : baseUrl + avatar
        }
        const userid = (isEmpty(user) || isEmpty(user.userId)) ? "" : user.userId
        const username = (isEmpty(user) || isEmpty(user.userName)) ? "" : user.userName
        if (res.roles && res.roles.length > 0) {
          SET_ROLES(res.roles)
          SET_PERMISSIONS(res.permissions)
        } else {
          SET_ROLES(['ROLE_DEFAULT'])
        }
        SET_ID(userid)
        SET_NAME(username)
        SET_AVATAR(avatar)
        isLoading.value = false
        resolve(res)
      }).catch(error => {
        isLoading.value = false
        reject(error)
      })
    })
  }

  const logOutAction = () => {
    return new Promise((resolve, reject) => {
      if (hasValidToken()) {
        logout(token.value).then(() => {
          clearSession()
          resolve()
        }).catch(() => {
          clearSession()
          resolve()
        })
      } else {
        clearSession()
        resolve()
      }
    })
  }

  const clearSession = () => {
    CLEAR_USER_STATE()
    clearAuthStorage()
    storage.clean()
  }

  const resetStore = () => {
    clearSession()
  }

  const checkAuthStatus = () => {
    loginState.value = hasValidToken()
    return loginState.value
  }

  return {
    token,
    id,
    name,
    avatar,
    roles,
    permissions,
    isLoading,
    loginState,
    isLoggedIn,
    authStatus,
    SET_TOKEN,
    SET_AVATAR,
    login: loginAction,
    getInfo: getInfoAction,
    logout: logOutAction,
    resetStore,
    clearSession,
    checkAuthStatus
  }
})
