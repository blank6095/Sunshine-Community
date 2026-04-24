import { get, put } from '@/api/request'

export function getCurrentUser() {
  return get('/user/me')
}

export function updateUserInfo(data: any) {
  return put('/user/me', data)
}
