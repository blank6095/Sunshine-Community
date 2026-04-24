<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const form = ref({
  username: '',
  password: '',
})

const rules = ref<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        console.log('[Login] 发起登录请求', { username: form.value.username })
        await userStore.login(form.value.username, form.value.password)
        ElMessage.success('登录成功')
        const redirect = (route.query.redirect as string) || '/'
        router.push(redirect)
      } catch (error: any) {
        console.error('[Login] 登录失败', error)
        const errorMessage = error?.response?.data?.message || 
                            error?.message || 
                            '登录失败，请检查用户名和密码'
        if (error?.response?.status === 401) {
          ElMessage.error('用户名或密码错误')
        } else if (error?.code === 'NETWORK_ERROR' || error?.code === 'TIMEOUT') {
          ElMessage.error('网络连接失败，请检查网络')
        } else {
          ElMessage.error(errorMessage)
        }
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="login-logo">
          <el-icon :size="48"><UserFilled /></el-icon>
        </div>
        <h1 class="login-title">医院挂号预约系统</h1>
        <p class="login-subtitle">Hospital Registration System</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" class="login-form" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" class="login-btn" @click="handleLogin">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-footer">
        <el-text size="small" type="info">医生或管理员请使用分配账号登录</el-text>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
export default {
  components: { User, Lock },
}
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 50%, #669df6 100%);
  background-size: cover;
  background-position: center;
  overflow: hidden;
  z-index: 1000;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(26, 115, 232, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(102, 157, 246, 0.4) 0%, transparent 50%);
  z-index: 0;
}

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.login-title {
  font-size: 24px;
  color: #303133;
  margin: 0 0 8px;
  font-weight: 600;
}

.login-subtitle {
  color: #909399;
  font-size: 14px;
  margin: 0;
}

.login-form {
  margin-top: 24px;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
  border: none;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.4);
}

.login-footer {
  text-align: center;
  margin-top: 16px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px;
    margin: 16px;
  }
}
</style>
