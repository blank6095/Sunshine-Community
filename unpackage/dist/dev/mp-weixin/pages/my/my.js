"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_up_avatar2 = common_vendor.resolveComponent("up-avatar");
  const _easycom_up_cell2 = common_vendor.resolveComponent("up-cell");
  const _easycom_up_cell_group2 = common_vendor.resolveComponent("up-cell-group");
  (_easycom_up_avatar2 + _easycom_up_cell2 + _easycom_up_cell_group2)();
}
const _easycom_up_avatar = () => "../../node-modules/uview-plus/components/u-avatar/u-avatar.js";
const _easycom_up_cell = () => "../../node-modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_up_cell_group = () => "../../node-modules/uview-plus/components/u-cell-group/u-cell-group.js";
if (!Math) {
  (_easycom_up_avatar + _easycom_up_cell + _easycom_up_cell_group)();
}
const _sfc_main = {
  __name: "my",
  setup(__props) {
    const user = common_vendor.ref(common_vendor.index.getStorageSync("user"));
    const infoList = [
      { title: "业主信息", iocn: "/static/service/trumpet.png" },
      { title: "我的车位", iocn: "/static/service/park.png" },
      { title: "访客通行", iocn: "/static/service/lock.png" },
      { title: "投诉咨询", iocn: "/static/service/phone.png" },
      { title: "投票问卷", iocn: "/static/service/love.png" }
    ];
    const tishi = () => {
      common_vendor.index.showToast({
        title: "设置暂未开放"
      });
    };
    const goto = (e) => {
      if (e === "我的车位") {
        utils_request.isLogin("/pages/park/park");
      }
      if (e === "业主信息") {
        utils_request.isLogin("/pages/ownerInfo/ownerInfo");
      }
    };
    common_vendor.onLoad(() => {
      user.value = common_vendor.index.getStorageSync("user");
      common_vendor.index.__f__("log", "at pages/my/my.vue:58", user.value);
    });
    const logout = () => {
      common_vendor.index.removeStorageSync("user");
      common_vendor.index.removeStorageSync("personal");
      common_vendor.index.reLaunch({
        url: "/pages/my/my"
      });
    };
    const login = () => {
      common_vendor.index.reLaunch({
        url: "/pages/login/login"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(user.value ? user.value.userName : null),
        b: common_vendor.t(user.value ? user.value.communityName : "请登录"),
        c: common_vendor.o(($event) => login()),
        d: user.value
      }, user.value ? {
        e: common_assets._imports_0$1
      } : {}, {
        f: common_vendor.f(infoList, (item, index, i0) => {
          return {
            a: item.iocn,
            b: common_vendor.t(item.title),
            c: index,
            d: common_vendor.o(($event) => goto(item.title), index)
          };
        }),
        g: common_vendor.o(($event) => tishi()),
        h: common_vendor.p({
          title: "设置",
          isLink: true
        }),
        i: common_vendor.p({
          title: "房屋认证",
          isLink: true
        }),
        j: user.value
      }, user.value ? {
        k: common_vendor.o(($event) => logout()),
        l: common_vendor.p({
          title: "退出登录",
          isLink: true
        })
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my.js.map
