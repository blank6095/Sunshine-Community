"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_config = require("../../utils/config.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_up_cell2 = common_vendor.resolveComponent("up-cell");
  const _easycom_up_cell_group2 = common_vendor.resolveComponent("up-cell-group");
  const _easycom_up_button2 = common_vendor.resolveComponent("up-button");
  (_easycom_up_cell2 + _easycom_up_cell_group2 + _easycom_up_button2)();
}
const _easycom_up_cell = () => "../../node-modules/uview-plus/components/u-cell/u-cell.js";
const _easycom_up_cell_group = () => "../../node-modules/uview-plus/components/u-cell-group/u-cell-group.js";
const _easycom_up_button = () => "../../node-modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  (_easycom_up_cell + _easycom_up_cell_group + _easycom_up_button)();
}
const _sfc_main = {
  __name: "park",
  setup(__props) {
    const carInfo = common_vendor.ref({
      carNum: "",
      areaNum: ""
    });
    const getInfo = async () => {
      const res = await utils_request.apiGet("/app/owner.queryAppOwnerCars", {
        page: 1,
        row: 10,
        communityId: utils_config.DEFAULT_COMMUNITY_ID
      });
      if (!res === 0) {
        common_vendor.index.showToast({
          icon: "error",
          title: "访问车位信息失败"
        });
        return;
      }
      carInfo.value = res.data.data[0];
    };
    common_vendor.onLoad(() => {
      getInfo();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "车牌号",
          value: carInfo.value.carNum
        }),
        b: common_vendor.p({
          title: "车位号",
          value: carInfo.value.areaNum
        }),
        c: common_vendor.p({
          title: "车位信息"
        }),
        d: common_vendor.o(($event) => common_vendor.unref(utils_request.isLogin)("/pages/parkApply/parkApply")),
        e: common_vendor.p({
          type: "primary",
          plain: true,
          text: "申请车位"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/park/park.js.map
