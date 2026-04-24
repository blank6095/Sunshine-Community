<template>
  <view class="normal-login-container">
    <view class="logo-content align-center justify-center flex">
      <view class="logo-icon">
        <uni-icons type="heart-filled" size="50" color="#2979ff"></uni-icons>
      </view>
      <view class="title-wrap">
        <text class="title">智慧医院</text>
        <text class="subtitle">便捷挂号 · 健康相伴</text>
      </view>
    </view>
    <view class="login-form-content">
      <view class="input-item flex align-center">
        <view class="iconfont icon-user icon"></view>
        <input v-model="loginForm.username" class="input" type="text" placeholder="请输入账号" maxlength="30" />
      </view>
      <view class="input-item flex align-center">
        <view class="iconfont icon-password icon"></view>
        <input v-model="loginForm.password" type="password" class="input" placeholder="请输入密码" maxlength="20" />
      </view>
      <!-- <view class="input-item flex align-center" style="width: 60%;margin: 0px;" v-if="captchaEnabled">
        <view class="iconfont icon-code icon"></view>
        <input v-model="loginForm.code" type="number" class="input" placeholder="请输入验证码" maxlength="4" />
        <view class="login-code"> 
          <image :src="codeUrl" @click="getCode" class="login-code-img"></image>
        </view>
      </view> -->
      <view class="action-btn">
        <button @click="handleLogin" class="login-btn cu-btn block bg-blue lg round">登录</button>
      </view>
      <view class="reg text-center" v-if="register">
        <text class="text-grey1">没有账号？</text>
        <text @click="handleUserRegister" class="text-blue">立即注册</text>
      </view>
      <view class="xieyi text-center">
        <text class="text-grey1">登录即代表同意</text>
        <text @click="handleUserAgrement" class="text-blue">《用户协议》</text>
        <text @click="handlePrivacy" class="text-blue">《隐私协议》</text>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { ref, getCurrentInstance } from "vue"
  import { onLoad } from  "@dcloudio/uni-app"
  import { getToken } from '@/utils/auth'
  import { getCodeImg } from '@/api/login'
  import { useConfigStore, useUserStore } from '@/store'

  const { proxy } = getCurrentInstance()
  const globalConfig = useConfigStore().config
  const codeUrl = ref("")
  const captchaEnabled = ref(true)
  const register = ref(true)
  const redirectUrl = ref('')
  const loginForm = ref({
    username: "",
    password: "",
    code: "",
    uuid: ""
  })

  function handleUserRegister() {
    if (redirectUrl.value) {
      proxy.$tab.navigateTo(`/pages/register?redirect=${encodeURIComponent(redirectUrl.value)}`)
    } else {
      proxy.$tab.redirectTo(`/pages/register`)
    }
  }

  function handlePrivacy() {
    let site = globalConfig.appInfo.agreements[0]
    proxy.$tab.navigateTo(`/pages/common/webview/index?title=${site.title}&url=${site.url}`)
  }

  function handleUserAgrement() {
    let site = globalConfig.appInfo.agreements[1]
    proxy.$tab.navigateTo(`/pages/common/webview/index?title=${site.title}&url=${site.url}`)
  }

  function getCode() {
    getCodeImg().then(res => {
      captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled
        if (captchaEnabled.value) {
          codeUrl.value = 'data:image/gif;base64,' + res.img
          loginForm.value.uuid = res.uuid
        }
    })
  }

  async function handleLogin() {
    if (loginForm.value.username === "") {
      proxy.$modal.msgError("请输入账号")
    } else if (loginForm.value.password === "") {
      proxy.$modal.msgError("请输入密码")
    } else {
      proxy.$modal.loading("登录中，请耐心等待...")
      pwdLogin()
    }
  }

  async function pwdLogin() {
    useUserStore().login(loginForm.value).then(() => {
      proxy.$modal.closeLoading()
      loginSuccess()
    }).catch(() => {
      proxy.$modal.closeLoading()
      if (captchaEnabled.value) {
        getCode()
      }
    })
  }

  function loginSuccess() {
    useUserStore().getInfo().then(res => {
      if (redirectUrl.value) {
        const decodedUrl = decodeURIComponent(redirectUrl.value)
        proxy.$tab.reLaunch(decodedUrl)
      } else {
        proxy.$tab.reLaunch('/pages/hospital/index')
      }
    }).catch(() => {
      proxy.$tab.reLaunch('/pages/hospital/index')
    })
  }

  onLoad((options) => {
    if (options.redirect) {
      redirectUrl.value = options.redirect
    }
    
    if (getToken()) {
      proxy.$tab.reLaunch('/pages/hospital/index')
    }
  })

  getCode()
</script>

<style lang="scss" scoped>
  page {
    background: linear-gradient(180deg, #e8f4ff 0%, #ffffff 100%);
  }

  .normal-login-container {
    width: 100%;
    min-height: 100vh;

    .logo-content {
      width: 100%;
      text-align: center;
      padding-top: 15%;
      flex-direction: column;
      align-items: center;

      .logo-icon {
        width: 120rpx;
        height: 120rpx;
        background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
        border-radius: 30rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20rpx;
        box-shadow: 0 8rpx 24rpx rgba(41, 121, 255, 0.3);
      }

      .title-wrap {
        .title {
          display: block;
          font-size: 48rpx;
          font-weight: bold;
          color: #333;
        }
        
        .subtitle {
          display: block;
          font-size: 26rpx;
          color: #666;
          margin-top: 10rpx;
        }
      }
    }

    .login-form-content {
      text-align: center;
      margin: 40rpx auto;
      width: 85%;

      .input-item {
        margin: 24rpx auto;
        background-color: #fff;
        height: 100rpx;
        border-radius: 50rpx;
        box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
        border: 2rpx solid #f0f0f0;

        .icon {
          font-size: 40rpx;
          margin-left: 30rpx;
          color: #2979ff;
        }

        .input {
          width: 100%;
          font-size: 30rpx;
          line-height: 20px;
          text-align: left;
          padding-left: 20rpx;
        }

      }

      .login-btn {
        margin-top: 50rpx;
        height: 100rpx;
        background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
        box-shadow: 0 8rpx 24rpx rgba(41, 121, 255, 0.3);
      }
      
      .reg {
        margin-top: 30rpx;
      }
      
      .xieyi {
        color: #333;
        margin-top: 40rpx;
      }
      
      .login-code {
        height: 38px;
        float: right;
      
        .login-code-img {
          height: 38px;
          position: absolute;
          margin-left: 10px;
          width: 200rpx;
        }
      }
    }
  }
</style>
