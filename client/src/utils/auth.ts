export const getToken = () => uni.getStorageSync('token') || ''
export const setToken = (val: string) => uni.setStorageSync('token', val)
export const removeToken = () => uni.removeStorageSync('token')
