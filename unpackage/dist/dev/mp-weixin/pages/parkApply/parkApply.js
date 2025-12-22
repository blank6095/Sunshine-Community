"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
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
  __name: "parkApply",
  setup(__props) {
    const parkInfo = common_vendor.ref({
      carNum: "",
      carBrand: "",
      carColor: "",
      remark: "",
      carType: "",
      communityId: "2025072783670006",
      ownerId: common_vendor.index.getStorageSync("personal").memberId,
      state: common_vendor.index.getStorageSync("personal").ownerTypeCd,
      applyPersonName: common_vendor.index.getStorageSync("personal").name,
      applyPersonLink: common_vendor.index.getStorageSync("personal").link,
      applyPersonId: common_vendor.index.getStorageSync("personal").ownerId,
      userId: common_vendor.index.getStorageSync("personal").ownerId
    });
    const typeCode = common_vendor.ref(0);
    const typeIndex = common_vendor.ref(0);
    const types = ["家用小汽车", "客车", "货车"];
    const chiose = (e) => {
      typeIndex.value = e.detail.value;
      typeCode.value = typeIndex.value + 9001;
      parkInfo.value.carType = typeCode.value;
    };
    const submit = async () => {
      if (!parkInfo.value.carBrand || !parkInfo.value.carNum) {
        common_vendor.index.showToast({
          icon: "none",
          title: "请完善信息"
        });
        return;
      }
      const res = await utils_request.apiPost("/app/parkingSpaceApply.saveParkingSpaceApply", parkInfo);
      if (res.data.code === 0) {
        common_vendor.index.showToast({
          icon: "success",
          title: "车位申请成功"
        });
      } else {
        common_vendor.index.showToast({
          icon: "error",
          title: "车位申请失败"
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: parkInfo.value.carNum,
        b: common_vendor.o(($event) => parkInfo.value.carNum = $event.detail.value),
        c: common_vendor.p({
          title: "车牌号"
        }),
        d: parkInfo.value.carBrand,
        e: common_vendor.o(($event) => parkInfo.value.carBrand = $event.detail.value),
        f: common_vendor.p({
          title: "品牌"
        }),
        g: parkInfo.value.carColor,
        h: common_vendor.o(($event) => parkInfo.value.carColor = $event.detail.value),
        i: common_vendor.p({
          title: "颜色"
        }),
        j: common_vendor.t(types[typeIndex.value]),
        k: types,
        l: common_vendor.o(chiose),
        m: common_vendor.p({
          title: "车牌号"
        }),
        n: parkInfo.value.remark,
        o: common_vendor.o(($event) => parkInfo.value.remark = $event.detail.value),
        p: common_vendor.p({
          title: "备注"
        }),
        q: common_vendor.p({
          title: "车位申请"
        }),
        r: common_vendor.o(($event) => submit())
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6cfc6c2f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/parkApply/parkApply.js.map
