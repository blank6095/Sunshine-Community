const TokenKey = 'App-Token'
const TokenExpireKey = 'Token-Expire-Time'
const TokenRefreshKey = 'Token-Refresh-Time'

// 获取Token
export function getToken() {
  return uni.getStorageSync(TokenKey)
}

// 设置Token
export function setToken(token, expireTime = 7 * 24 * 60 * 60 * 1000) {
  uni.setStorageSync(TokenKey, token)
  if (expireTime) {
    setTokenExpireTime(Date.now() + expireTime)
  }
}

// 删除Token
export function removeToken() {
  uni.removeStorageSync(TokenKey)
  uni.removeStorageSync(TokenExpireKey)
  uni.removeStorageSync(TokenRefreshKey)
}

// 检查是否有有效的Token
export function hasValidToken() {
  const token = getToken()
  return token && token.length > 0 && !isTokenExpired()
}

// 获取Token过期时间
export function getTokenExpireTime() {
  const expireTime = uni.getStorageSync(TokenExpireKey)
  return expireTime || 0
}

// 设置Token过期时间
export function setTokenExpireTime(time) {
  uni.setStorageSync(TokenExpireKey, time)
}

// 检查Token是否过期
export function isTokenExpired() {
  const expireTime = getTokenExpireTime()
  if (!expireTime) return false
  return Date.now() > expireTime
}

// 检查Token是否接近过期（30分钟内）
export function isTokenNearExpiry() {
  const expireTime = getTokenExpireTime()
  if (!expireTime) return false
  const thirtyMinutes = 30 * 60 * 1000
  return Date.now() > (expireTime - thirtyMinutes)
}

// 清除所有认证相关存储
export function clearAuthStorage() {
  removeToken()
  // 可以在这里添加其他需要清除的认证相关存储
}

// 获取认证状态
export function getAuthStatus() {
  return {
    hasToken: !!getToken(),
    isExpired: isTokenExpired(),
    isNearExpiry: isTokenNearExpiry(),
    isValid: hasValidToken()
  }
}
