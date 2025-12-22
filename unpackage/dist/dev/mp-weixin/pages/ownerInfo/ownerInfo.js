"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_up_cell2 = common_vendor.resolveComponent("up-cell");
  const _easycom_up_cell_group2 = common_vendor.resolveComponent("up-cell-group");
  (_easycom_up_cell2 + _easycom_up_cell_group2)();
}
const _easycom_up_cell = () => "../../node-modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_up_cell_group = () => "../../node-modules/uview-plus/components/u-cell-group/u-cell-group.js";
if (!Math) {
  (_easycom_up_cell + _easycom_up_cell_group)();
}
const _sfc_main = {
  __name: "ownerInfo",
  setup(__props) {
    common_vendor.ref();
    common_vendor.onLoad(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "小区编码",
          value: common_vendor.index.getStorageSync("personal").communityId
        }),
        b: common_vendor.p({
          title: "小区名字",
          value: common_vendor.index.getStorageSync("user").communityName
        }),
        c: common_vendor.p({
          title: "小区信息"
        }),
        d: common_vendor.p({
          title: "姓名",
          value: common_vendor.index.getStorageSync("personal").name
        }),
        e: common_vendor.p({
          title: "手机号",
          value: common_vendor.index.getStorageSync("personal").link
        }),
        f: common_vendor.p({
          title: "业主信息"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ownerInfo/ownerInfo.js.map
