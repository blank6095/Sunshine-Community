export function setToken(token: string) {
  uni.setStorageSync('token', token)
}

export function getToken(): string {
  return uni.getStorageSync('token') || ''
}

export function removeToken() {
  uni.removeStorageSync('token')
}

export function setUserInfo(info: any) {
  uni.setStorageSync('userInfo', info)
}

export function getUserInfo() {
  return uni.getStorageSync('userInfo') || null
}

export function removeUserInfo() {
  uni.removeStorageSync('userInfo')
}
