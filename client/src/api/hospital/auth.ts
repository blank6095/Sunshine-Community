import { post, get } from '@/api/request'

export function login(data: { username: string; password: string }) {
  return post('/auth/login', data)
}

export function register(data: { username: string; password: string; realName: string; phone: string; idCard: string }) {
  return post('/auth/register', data)
}

export function refreshToken() {
  return post('/auth/refresh')
}

export function getUserInfo() {
  return get('/system/user/info')
}
