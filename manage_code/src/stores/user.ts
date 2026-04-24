import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'
import { login as loginApi, refreshToken as refreshTokenApi } from '@/api'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const user = ref<User | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  )

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isDoctor = computed(() => user.value?.role === 'DOCTOR')
  const isPatient = computed(() => user.value?.role === 'PATIENT')

  async function login(username: string, password: string) {
    console.log('[Auth] 登录请求', { username })
    const response = await loginApi({ username, password })
    console.log('[Auth] 登录响应', { code: response.code, message: response.message })

    if (response.code !== 200 && response.code !== 201) {
      throw new Error(response.message || '登录失败')
    }

    const { token: newToken, user: newUser } = response.data
    if (!newToken || !newUser) {
      throw new Error('登录响应数据不完整')
    }

    token.value = newToken
    user.value = newUser
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    console.log('[Auth] 登录成功', { username, role: newUser?.role })
  }

  async function refreshAuthToken() {
    if (!token.value) return
    try {
      const response = await refreshTokenApi(token.value)
      token.value = response.data.token
      localStorage.setItem('token', token.value)
    } catch (error) {
      logout()
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    isLoggedIn,
    isAdmin,
    isDoctor,
    isPatient,
    login,
    logout,
    refreshAuthToken,
  }
})
