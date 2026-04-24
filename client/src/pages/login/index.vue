<template>
  <view class="container">
    <view class="login-header">
      <view class="logo">
        <text class="logo-icon">🏥</text>
      </view>
      <text class="app-name">智慧医院</text>
      <text class="app-slogan">让就医更简单</text>
    </view>

    <view class="login-form">
      <view class="form-title">
        <text class="form-title-text">欢迎登录</text>
      </view>

      <view class="input-group">
        <view class="input-item">
          <text class="input-icon">👤</text>
          <input 
            class="input" 
            type="text" 
            placeholder="请输入用户名/手机号" 
            v-model="loginForm.username"
            @input="validateForm"
          />
        </view>
        <view class="input-item">
          <text class="input-icon">🔒</text>
          <input 
            class="input" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="请输入密码" 
            v-model="loginForm.password"
            @input="validateForm"
          />
          <text class="eye-icon" @click="togglePassword">{{ showPassword ? '👁️' : '👁️‍🗨️' }}</text>
        </view>
      </view>

      <view class="form-options">
        <view class="remember-me">
          <checkbox-group @change="onRememberChange">
            <label class="checkbox-label">
              <checkbox :checked="rememberMe" color="#1890ff"/>
              <text class="checkbox-text">记住我</text>
            </label>
          </checkbox-group>
        </view>
        <text class="forgot-password" @click="goToForgot">忘记密码？</text>
      </view>

      <view 
        class="login-btn" 
        :class="{ 'login-btn-disabled': !isFormValid || isLoading }"
        @click="handleLogin"
      >
        <text class="login-btn-text">{{ isLoading ? '登录中...' : '登录' }}</text>
      </view>

      <view class="register-link">
        <text class="register-link-text">还没有账号？</text>
        <text class="register-btn" @click="goToRegister">立即注册</text>
      </view>
    </view>

    <view class="third-party-login">
      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">其他登录方式</text>
        <view class="divider-line"></view>
      </view>
      <view class="third-party-icons">
        <view class="third-party-item" @click="thirdPartyLogin('wechat')">
          <text class="third-party-icon">💬</text>
          <text class="third-party-text">微信</text>
        </view>
        <view class="third-party-item" @click="thirdPartyLogin('qq')">
          <text class="third-party-icon">📱</text>
          <text class="third-party-text">QQ</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '@/store/modules/user'

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      showPassword: false,
      rememberMe: false,
      isLoading: false
    }
  },
  computed: {
    isFormValid() {
      return this.loginForm.username.length > 0 && this.loginForm.password.length >= 6
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    onRememberChange(e) {
      this.rememberMe = e.detail.value.length > 0
    },
    validateForm() {
      this.$forceUpdate()
    },
    async handleLogin() {
      if (!this.isFormValid || this.isLoading) return

      try {
        this.isLoading = true
        const userStore = useUserStore()
        await userStore.login(this.loginForm)
        
        setTimeout(() => {
          uni.switchTab({ url: '/pages/index/index' })
        }, 500)
      } catch (error) {
        console.error('登录失败:', error)
      } finally {
        this.isLoading = false
      }
    },
    goToRegister() {
      uni.navigateTo({ url: '/pages/login/register' })
    },
    goToForgot() {
      uni.showToast({ title: '功能开发中', icon: 'none' })
    },
    thirdPartyLogin(type) {
      uni.showToast({ title: `${type}登录开发中`, icon: 'none' })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 50%, #0043a8 100%);
}

.login-header {
  padding: 100px 50px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 140px;
  height: 140px;
  background: white;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.logo-icon {
  font-size: 70px;
}

.app-name {
  font-size: 48px;
  font-weight: bold;
  color: white;
  margin-bottom: 12px;
}

.app-slogan {
  font-size: 28px;
  color: rgba(255, 255, 255, 0.8);
}

.login-form {
  background: white;
  margin: 0 30px;
  border-radius: 40px 40px 0 0;
  padding: 60px 40px;
  min-height: calc(100vh - 400px);
}

.form-title {
  margin-bottom: 50px;
}

.form-title-text {
  font-size: 40px;
  font-weight: bold;
  color: #333;
}

.input-group {
  margin-bottom: 30px;
}

.input-item {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 50px;
  padding: 30px;
  margin-bottom: 24px;
}

.input-icon {
  font-size: 32px;
  margin-right: 20px;
}

.input {
  flex: 1;
  font-size: 28px;
  color: #333;
}

.eye-icon {
  font-size: 32px;
  padding: 10px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 0 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
}

.checkbox-text {
  font-size: 26px;
  color: #666;
}

.forgot-password {
  font-size: 26px;
  color: #1890ff;
}

.login-btn {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-radius: 50px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(24, 144, 255, 0.3);
}

.login-btn-disabled {
  background: #ccc;
  box-shadow: none;
}

.login-btn-text {
  font-size: 32px;
  font-weight: bold;
  color: white;
}

.register-link {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
}

.register-link-text {
  font-size: 26px;
  color: #999;
}

.register-btn {
  font-size: 26px;
  color: #1890ff;
  font-weight: bold;
}

.third-party-login {
  padding: 60px 40px 40px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 50px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.divider-text {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.8);
}

.third-party-icons {
  display: flex;
  justify-content: center;
  gap: 80px;
}

.third-party-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.third-party-icon {
  font-size: 48px;
}

.third-party-text {
  font-size: 24px;
  color: white;
}
</style>
