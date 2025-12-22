import { baseUrl, appId } from './config.js'
function buildHeaders(token) {
  return {
    'app-id': appId,
    'Authorization': 'Bearer ' + (token || 'no login'),
    'Content-Type': 'application/json'
  }
}

function requestCore(path, method, data, needAuth) {
  const token = needAuth ? uni.getStorageSync('token') : null
  const header = buildHeaders(token)
  const url = baseUrl + path
  return new Promise((resolve, reject) => {
    uni.request({ url, method, data, header, success: res => resolve(res), fail: e => reject(e) })
  })
}

export function apiGet(path, data = {}, needAuth = true) {
  return requestCore(path, 'GET', data, needAuth)
}

export function apiPost(path, data = {}, needAuth = true) {
  return requestCore(path, 'POST', data, needAuth)
}

export function isLogin(url){
	console.log("跳转");
	if(uni.getStorageSync('user')){
		uni.navigateTo({
			url,
		})
		
	}
	else {
		uni.navigateTo({
			url:'/pages/goLogin/goLogin'
		})
	}
	
}
