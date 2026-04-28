<template>
  <div class="security-page page-container">
    <div class="page-header">
      <van-icon name="arrow-left" size="20" @click="$router.back()" style="position: absolute; left: 16px; cursor: pointer;" />
      <span class="page-title">账号安全</span>
    </div>

    <div class="page-content">
      <van-cell-group inset>
        <van-cell title="修改密码" is-link @click="showChangePassword = true" />
        <van-cell title="登录设备管理" is-link />
      </van-cell-group>

      <van-cell-group inset style="margin-top: 16px;">
        <van-cell title="账号注销" class="danger-cell" is-link />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showChangePassword = ref(false)
</script>

<style scoped>
.page-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
}

.danger-cell {
  color: #ee0a24;
}
</style>
