import { defineStore } from 'pinia'
import { login, register, refreshToken } from '@/api/auth'
import { getUserById, updateUser } from '@/api/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isLoggedIn: !!localStorage.getItem('token'),
  }),

  getters: {
    userId: (state) => state.user?.id || null,
    userName: (state) => state.user?.name || '',
    userRole: (state) => state.user?.role || '',
  },

  actions: {
    async login(credentials) {
      const res = await login(credentials)
      this.token = res.data.token
      this.user = res.data.user
      this.isLoggedIn = true
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      return res.data
    },

    async register(data) {
      const res = await register(data)
      return res.data
    },

    async fetchUser() {
      if (!this.userId) return
      const res = await getUserById(this.userId)
      this.user = res.data
      localStorage.setItem('user', JSON.stringify(res.data))
    },

    async updateProfile(data) {
      const res = await updateUser(this.userId, data)
      this.user = res.data
      localStorage.setItem('user', JSON.stringify(res.data))
      return res.data
    },

    async refresh() {
      const res = await refreshToken({ token: this.token })
      this.token = res.data.token
      localStorage.setItem('token', res.data.token)
      return res.data
    },

    logout() {
      this.token = ''
      this.user = null
      this.isLoggedIn = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
