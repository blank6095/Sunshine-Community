export function toast(content) {
  uni.showToast({
    icon: 'none',
    title: content
  })
}

export function showConfirm(content, title = '提示') {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: title,
      content: content,
      cancelText: '取消',
      confirmText: '确定',
      success: function(res) {
        resolve(res)
      },
      fail: function(err) {
        reject(err)
      }
    })
  })
}

export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    var part = encodeURIComponent(propName) + "="
    if (value !== null && value !== "" && typeof (value) !== "undefined") {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
            let params = propName + '[' + key + ']'
            var subPart = encodeURIComponent(params) + "="
            result += subPart + encodeURIComponent(value[key]) + "&"
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&"
      }
    }
  }
  return result
}

export function showLoading(content = '加载中...') {
  uni.showLoading({
    title: content,
    mask: true
  })
}

export function hideLoading() {
  uni.hideLoading()
}

export function showErrorModal(content, title = '错误') {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function(res) {
        resolve(res)
      }
    })
  })
}

export function showSuccessToast(content) {
  uni.showToast({
    icon: 'success',
    title: content
  })
}

export function redirectToWithParam(url, params = {}) {
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
  const fullUrl = queryString ? `${url}?${queryString}` : url
  uni.redirectTo({ url: fullUrl })
}

export function navigateToWithParam(url, params = {}) {
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
  const fullUrl = queryString ? `${url}?${queryString}` : url
  uni.navigateTo({ url: fullUrl })
}

export function getCurrentPageUrl() {
  const pages = getCurrentPages()
  if (pages.length === 0) return ''
  const currentPage = pages[pages.length - 1]
  const route = '/' + currentPage.route
  const options = currentPage.options || {}
  const queryString = Object.keys(options)
    .map(key => `${key}=${encodeURIComponent(options[key])}`)
    .join('&')
  return route + (queryString ? '?' + queryString : '')
}
