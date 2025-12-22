"use strict";
const common_vendor = require("../common/vendor.js");
const utils_config = require("./config.js");
function buildHeaders(token) {
  return {
    "app-id": utils_config.appId,
    "Authorization": "Bearer " + (token || "no login"),
    "Content-Type": "application/json"
  };
}
function requestCore(path, method, data, needAuth) {
  const token = needAuth ? common_vendor.index.getStorageSync("token") : null;
  const header = buildHeaders(token);
  const url = utils_config.baseUrl + path;
  return new Promise((resolve, reject) => {
    common_vendor.index.request({ url, method, data, header, success: (res) => resolve(res), fail: (e) => reject(e) });
  });
}
function apiGet(path, data = {}, needAuth = true) {
  return requestCore(path, "GET", data, needAuth);
}
function apiPost(path, data = {}, needAuth = true) {
  return requestCore(path, "POST", data, needAuth);
}
function isLogin(url) {
  common_vendor.index.__f__("log", "at utils/request.js:28", "跳转");
  if (common_vendor.index.getStorageSync("user")) {
    common_vendor.index.navigateTo({
      url
    });
  } else {
    common_vendor.index.navigateTo({
      url: "/pages/goLogin/goLogin"
    });
  }
}
exports.apiGet = apiGet;
exports.apiPost = apiPost;
exports.isLogin = isLogin;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
