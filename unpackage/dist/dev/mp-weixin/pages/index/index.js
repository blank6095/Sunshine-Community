"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_up_notice_bar2 = common_vendor.resolveComponent("up-notice-bar");
  _easycom_up_notice_bar2();
}
const _easycom_up_notice_bar = () => "../../node-modules/uview-plus/components/u-notice-bar/u-notice-bar.js";
if (!Math) {
  _easycom_up_notice_bar();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const service1List = [
      {
        title: "咨询投诉",
        icon: "/static/service/phone.png"
      },
      {
        title: "家庭成员",
        icon: "/static/service/family.png"
      },
      {
        title: "访客通行",
        icon: "/static/service/lock.png"
      }
    ];
    const service2List = [
      {
        title: "生活缴费",
        icon: "/static/service/living.png"
      },
      {
        title: "房屋费",
        icon: "/static/service/house.png"
      },
      {
        title: "车位申请",
        icon: "/static/service/love.png"
      },
      {
        title: "一键开门",
        icon: "/static/service/door.png"
      }
    ];
    const goto = (e) => {
      common_vendor.index.switchTab({
        url: "/pages/service/service"
      });
    };
    const contact = () => {
      if (!common_vendor.index.getStorageSync("user")) {
        common_vendor.index.showToast({
          title: "请登录"
        });
        return;
      }
      common_vendor.index.showModal({
        title: "拨打电话",
        content: "您确认拨打，阳光小区物业客服电话吗？" + common_vendor.index.getStorageSync("user").communityTel,
        cancelText: "取消",
        confirmText: "确认",
        success: (e) => {
          if (e.confirm) {
            common_vendor.index.makePhoneCall({
              phoneNumber: common_vendor.index.getStorageSync("user").communityTel
            });
          }
        },
        fail: () => {
          return;
        }
      });
    };
    const goApply = (e) => {
      if (e === "车位申请") {
        utils_request.isLogin("/pages/parkApply/parkApply");
      }
      common_vendor.index.__f__("log", "at pages/index/index.vue:124", e);
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_assets._imports_1,
        c: common_vendor.f(service1List, (it, index, i0) => {
          return {
            a: it.icon,
            b: common_vendor.t(it.title),
            c: index
          };
        }),
        d: common_vendor.o(($event) => goto()),
        e: common_vendor.f(service2List, (it, index, i0) => {
          return {
            a: it.icon,
            b: common_vendor.t(it.title),
            c: index,
            d: common_vendor.o(($event) => goApply(it.title), index)
          };
        }),
        f: common_vendor.p({
          text: _ctx.text1,
          mode: "closable",
          speed: "250",
          url: "/pages/componentsB/tag/tag"
        }),
        g: common_assets._imports_2,
        h: common_vendor.o(($event) => common_vendor.unref(utils_request.isLogin)("/pages/baoxiu/baoxiu")),
        i: common_assets._imports_3,
        j: common_vendor.o(() => {
        }),
        k: common_vendor.o(($event) => contact()),
        l: common_assets._imports_4
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
