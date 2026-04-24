import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

export function register(data) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

export function refreshToken(token) {
  return request({
    url: '/auth/refresh',
    method: 'post',
    data: { token }
  })
}
