"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_up_avatar2 = common_vendor.resolveComponent("up-avatar");
  const _easycom_up_input2 = common_vendor.resolveComponent("up-input");
  const _easycom_up_form_item2 = common_vendor.resolveComponent("up-form-item");
  const _easycom_up_form2 = common_vendor.resolveComponent("up-form");
  const _easycom_up_button2 = common_vendor.resolveComponent("up-button");
  const _easycom_up_checkbox2 = common_vendor.resolveComponent("up-checkbox");
  const _easycom_up_toast2 = common_vendor.resolveComponent("up-toast");
  (_easycom_up_avatar2 + _easycom_up_input2 + _easycom_up_form_item2 + _easycom_up_form2 + _easycom_up_button2 + _easycom_up_checkbox2 + _easycom_up_toast2)();
}
const _easycom_up_avatar = () => "../../node-modules/uview-plus/components/u-avatar/u-avatar.js";
const _easycom_up_input = () => "../../node-modules/uview-plus/components/u-input/u-input.js";
const _easycom_up_form_item = () => "../../node-modules/uview-plus/components/u-form-item/u-form-item.js";
const _easycom_up_form = () => "../../node-modules/uview-plus/components/u-form/u-form.js";
const _easycom_up_button = () => "../../node-modules/uview-plus/components/u-button/u-button.js";
const _easycom_up_checkbox = () => "../../node-modules/uview-plus/components/u-checkbox/u-checkbox.js";
const _easycom_up_toast = () => "../../node-modules/uview-plus/components/u-toast/u-toast.js";
if (!Math) {
  (_easycom_up_avatar + _easycom_up_input + _easycom_up_form_item + _easycom_up_form + _easycom_up_button + _easycom_up_checkbox + _easycom_up_toast)();
}
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const form = common_vendor.ref({
      username: "14755449966",
      password: "123456"
    });
    const agree = common_vendor.ref(false);
    const toastRef = common_vendor.ref(null);
    const submit = async () => {
      if (!agree.value) {
        return toastRef.value && toastRef.value.show({
          type: "error",
          message: "请先同意协议"
        });
      }
      try {
        const res = await utils_request.apiPost("/app/user.ownerUserLogin", form.value, false);
        const data = res.data || {};
        if (data.code === 0) {
          const info = data.data || {};
          common_vendor.index.setStorageSync("token", info.token || "");
          common_vendor.index.setStorageSync("user", info);
          common_vendor.index.setStorageSync("communityId", info.communityId || "");
          common_vendor.index.showToast({
            icon: "success",
            title: "登录成功",
            duration: 1e3
          });
          const timer = setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/my/my",
              // 兜底处理：如果跳转失败（比如页面路径错误），清除定时器
              fail: () => {
                clearTimeout(timer);
              }
            });
            clearTimeout(timer);
          }, 1e3);
          const infoLoad = async () => {
            const res2 = await apiGet("/app/owner.queryCurrentOwner", {
              page: 1,
              row: 10,
              communityId: DEFAULT_COMMUNITY_ID
            });
            common_vendor.index.__f__("log", "at pages/login/login.vue:73", res2.data.data);
            common_vendor.index.setStorageSync("personal", res2.data.data);
          };
          infoLoad();
        } else {
          toastRef.value && toastRef.value.show({
            type: "error",
            message: data.msg || "登录失败"
          });
        }
      } catch (e) {
        toastRef.value && toastRef.value.show({
          type: "error",
          message: "网络异常"
        });
      }
    };
    const quickLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/register/register"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          size: "80"
        }),
        b: common_vendor.o(($event) => form.value.username = $event),
        c: common_vendor.p({
          border: "bottom",
          placeholder: "请输入手机号",
          modelValue: form.value.username
        }),
        d: common_vendor.p({
          label: "用户名",
          prop: "username",
          ["label-width"]: "100rpx"
        }),
        e: common_vendor.o(($event) => form.value.password = $event),
        f: common_vendor.p({
          type: "password",
          border: "bottom",
          placeholder: "请输入密码",
          modelValue: form.value.password
        }),
        g: common_vendor.p({
          label: "密码",
          prop: "password",
          ["label-width"]: "100rpx"
        }),
        h: common_vendor.p({
          model: form.value
        }),
        i: common_vendor.o(submit),
        j: common_vendor.p({
          type: "primary"
        }),
        k: common_vendor.o(quickLogin),
        l: common_vendor.p({
          type: "success"
        }),
        m: common_vendor.o(($event) => agree.value = $event),
        n: common_vendor.p({
          usedAlone: true,
          checked: agree.value
        }),
        o: common_vendor.sr(toastRef, "e4e4508d-9", {
          "k": "toastRef"
        }),
        p: common_vendor.gei(_ctx, "")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
