import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { setToken, getToken, removeToken, setUserInfo, getUserInfo, removeUserInfo } from '@/utils/storage'
import { login as apiLogin, getUserInfo as apiGetUserInfo, register as apiRegister } from '@/api/hospital/auth'
import type { UserInfo } from '@/types'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const userInfo = ref<UserInfo | null>(getUserInfo())
  const isLoading = ref(false)

  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  async function login(loginForm: { username: string; password: string }) {
    try {
      isLoading.value = true
      const result = await apiLogin(loginForm)
      token.value = result.token
      setToken(result.token)
      await fetchUserInfo()
      uni.showToast({ title: '登录成功', icon: 'success' })
      return result
    } catch (error: any) {
      uni.showToast({ title: error.message || '登录失败', icon: 'none' })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUserInfo() {
    try {
      isLoading.value = true
      const result = await apiGetUserInfo()
      userInfo.value = result
      setUserInfo(result)
      return result
    } catch (error: any) {
      console.error('获取用户信息失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function register(registerForm: { username: string; password: string; phone: string; idCard: string; realName: string }) {
    try {
      isLoading.value = true
      const result = await apiRegister(registerForm)
      uni.showToast({ title: '注册成功', icon: 'success' })
      return result
    } catch (error: any) {
      uni.showToast({ title: error.message || '注册失败', icon: 'none' })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    removeToken()
    removeUserInfo()
    uni.reLaunch({ url: '/pages/login/index' })
  }

  function setUserToken(t: string) {
    token.value = t
    setToken(t)
  }

  function setUser(data: UserInfo) {
    userInfo.value = data
    setUserInfo(data)
  }

  return {
    token,
    userInfo,
    isLoading,
    isLoggedIn,
    login,
    fetchUserInfo,
    register,
    logout,
    setUserToken,
    setUser
  }
})
