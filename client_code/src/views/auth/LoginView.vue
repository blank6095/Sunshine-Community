<template>
  <div class="login-page page-container">
    <div class="login-header">
      <div class="logo">
        <van-icon name="medical" size="48" color="#4facfe" />
      </div>
      <h1 class="app-name">阳光医院预约挂号</h1>
      <p class="app-desc">便捷挂号 健康守护</p>
    </div>

    <div class="login-form">
      <van-form @submit="handleLogin">
        <van-cell-group inset>
          <van-field
            v-model="loginForm.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
          />
          <van-field
            v-model="loginForm.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
          />
        </van-cell-group>

        <div class="form-actions">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            登录
          </van-button>
        </div>
      </van-form>

      <div class="form-links">
        <router-link to="/register">注册新账号</router-link>
        <span class="divider">|</span>
        <router-link to="/forgot-password">忘记密码</router-link>
      </div>

      <div class="third-login">
        <div class="third-login-title">其他登录方式</div>
        <div class="third-login-icons">
          <van-icon name="wechat" size="36" color="#07c160" @click="thirdLogin('wechat')" />
          <van-icon name="alipay" size="36" color="#1677ff" @click="thirdLogin('alipay')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast, showNotify } from 'vant'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loginForm = ref({
  username: '',
  password: '',
})

const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true
  
  try {
    const userData = await authStore.login(loginForm.value)
    
    showNotify({
      type: 'success',
      message: `欢迎回来，${userData.user?.name || userData.user?.username || '用户'}！`,
      duration: 2000,
    })
    
    const redirectPath = route.query.redirect || '/'
    setTimeout(() => {
      router.replace(redirectPath)
    }, 300)
  } catch (err) {
    const errorMsg = err.message || '登录失败，请检查用户名和密码'
    errorMessage.value = errorMsg
    
    if (errorMsg.includes('用户不存在') || errorMsg.includes('密码错误')) {
      showNotify({
        type: 'danger',
        message: '用户名或密码错误，请重新输入',
        duration: 3000,
      })
    } else if (errorMsg.includes('网络连接') || errorMsg.includes('超时')) {
      showNotify({
        type: 'warning',
        message: '网络连接失败，请检查网络后重试',
        duration: 3000,
      })
    } else {
      showNotify({
        type: 'danger',
        message: errorMsg,
        duration: 3000,
      })
    }
  } finally {
    loading.value = false
  }
}

function thirdLogin(type) {
  Toast(`暂不支持${type === 'wechat' ? '微信' : '支付宝'}登录`)
}
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #e8f4ff 0%, #f5f7fa 40%);
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px 40px;
}

.logo {
  width: 80px;
  height: 80px;
  background: #fff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.2);
}

.app-name {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.app-desc {
  font-size: 14px;
  color: #999;
}

.login-form {
  padding: 20px;
}

.form-actions {
  margin-top: 24px;
  padding: 0 16px;
}

.form-links {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
  gap: 12px;
}

.form-links a {
  color: #4facfe;
}

.divider {
  color: #ddd;
}

.third-login {
  margin-top: 50px;
  text-align: center;
}

.third-login-title {
  font-size: 13px;
  color: #999;
  margin-bottom: 16px;
  position: relative;
}

.third-login-title::before,
.third-login-title::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 60px;
  height: 1px;
  background: #eee;
}

.third-login-title::before {
  left: 40px;
}

.third-login-title::after {
  right: 40px;
}

.third-login-icons {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.third-login-icons .van-icon {
  cursor: pointer;
  transition: opacity 0.2s;
}

.third-login-icons .van-icon:active {
  opacity: 0.7;
}
</style>
