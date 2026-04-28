<template>
  <div class="forgot-password-page page-container">
    <div class="page-header">
      <van-icon name="arrow-left" size="20" @click="$router.back()" style="position: absolute; left: 16px; cursor: pointer;" />
      <span class="page-title">忘记密码</span>
    </div>

    <div class="page-content">
      <div class="tips">
        <van-icon name="info-o" size="24" color="#fa8c16" />
        <p>请联系医院客服进行密码重置</p>
        <p class="phone">客服电话：400-888-8888</p>
      </div>

      <van-cell-group inset>
        <van-field
          v-model="phone"
          label="手机号"
          placeholder="请输入注册手机号"
          :rules="[{ required: true, message: '请输入手机号' }]"
        />
      </van-cell-group>

      <van-button round block type="primary" style="margin-top: 24px;" @click="handleSubmit" :loading="loading">
        提交申请
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Toast } from 'vant'

const phone = ref('')
const loading = ref(false)

function handleSubmit() {
  if (!phone.value) {
    Toast.fail('请输入手机号')
    return
  }
  loading.value = true
  setTimeout(() => {
    Toast.success('申请已提交，客服将尽快联系您')
    loading.value = false
  }, 1000)
}
</script>

<style scoped>
.tips {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: #fff7e6;
  border-radius: 12px;
  margin-bottom: 20px;
}

.tips p {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.tips .phone {
  font-size: 18px;
  color: #fa8c16;
  font-weight: 600;
}
</style>
