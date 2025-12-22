"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "goLogin",
  setup(__props) {
    const login = () => {
      common_vendor.index.redirectTo({
        url: "/pages/login/login"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => login()),
        b: common_vendor.gei(_ctx, "")
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/goLogin/goLogin.js.map
