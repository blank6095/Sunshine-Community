<template>
  <view class="normal-login-container">
    <view class="logo-content align-center justify-center flex">
      <view class="logo-icon">
        <uni-icons type="heart-filled" size="50" color="#2979ff"></uni-icons>
      </view>
      <view class="title-wrap">
        <text class="title">用户注册</text>
        <text class="subtitle">智慧医院 · 健康服务</text>
      </view>
    </view>
    
    <view class="login-form-content">
      <view class="input-item flex align-center">
        <view class="iconfont icon-user icon"></view>
        <input v-model="registerForm.username" class="input" type="text" placeholder="请输入账号" maxlength="30" />
      </view>
      <view class="input-item flex align-center">
        <view class="iconfont icon-password icon"></view>
        <input v-model="registerForm.password" type="password" class="input" placeholder="请输入密码" maxlength="20" />
      </view>
      <view class="input-item flex align-center">
        <view class="iconfont icon-password icon"></view>
        <input v-model="registerForm.confirmPassword" type="password" class="input" placeholder="请确认密码" maxlength="20" />
      </view>
      <view class="input-item flex align-center">
        <uni-icons type="person" size="20" color="#2979ff" class="icon"></uni-icons>
        <input v-model="registerForm.name" class="input" type="text" placeholder="请输入真实姓名" maxlength="20" />
      </view>
      <view class="input-item flex align-center">
        <uni-icons type="phone" size="20" color="#2979ff" class="icon"></uni-icons>
        <input v-model="registerForm.phone" class="input" type="number" placeholder="请输入手机号码" maxlength="11" />
      </view>
      <view class="input-item flex align-center">
        <uni-icons type="contact" size="20" color="#2979ff" class="icon"></uni-icons>
        <input v-model="registerForm.idCard" class="input" type="idcard" placeholder="请输入身份证号" maxlength="18" />
      </view>
      <view class="input-item flex align-center gender-select">
        <uni-icons type="contact-filled" size="20" color="#2979ff" class="icon"></uni-icons>
        <view class="gender-options">
          <view class="gender-item" :class="{ active: registerForm.gender === '男' }" @click="registerForm.gender = '男'">男</view>
          <view class="gender-item" :class="{ active: registerForm.gender === '女' }" @click="registerForm.gender = '女'">女</view>
        </view>
      </view>
      <view class="input-item flex align-center">
        <uni-icons type="calendar" size="20" color="#2979ff" class="icon"></uni-icons>
        <picker mode="date" :value="registerForm.birthday" @change="onDateChange">
          <view class="picker-input">
            <text :class="{ placeholder: !registerForm.birthday }">{{ registerForm.birthday || '请选择出生日期' }}</text>
          </view>
        </picker>
      </view>
      <view class="input-item flex align-center" style="width: 60%;margin: 0px;" v-if="captchaEnabled">
        <view class="iconfont icon-code icon"></view>
        <input v-model="registerForm.code" type="number" class="input" placeholder="请输入验证码" maxlength="4" />
        <view class="login-code"> 
          <image :src="codeUrl" @click="getCode" class="login-code-img"></image>
        </view>
      </view>
      <view class="action-btn">
        <button @click="handleRegister()" class="register-btn cu-btn block bg-blue lg round">注册</button>
      </view>
    </view>
    <view class="xieyi text-center">
      <text @click="handleUserLogin" class="text-blue">使用已有账号登录</text>
    </view>
  </view>
</template>

<script setup>
  import { getCodeImg, register } from '@/api/login'
  import { ref, getCurrentInstance } from "vue"
  import { onLoad } from "@dcloudio/uni-app"
  import { useConfigStore } from '@/store'

  const { proxy } = getCurrentInstance()
  const globalConfig = useConfigStore().config
  const codeUrl = ref("")
  const captchaEnabled = ref(true)
  const redirectUrl = ref('')
  const registerForm = ref({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    idCard: "",
    gender: "男",
    birthday: "",
    code: "",
    uuid: ""
  })

  function handleUserLogin() {
    if (redirectUrl.value) {
      proxy.$tab.navigateTo(`/pages/login?redirect=${encodeURIComponent(redirectUrl.value)}`)
    } else {
      proxy.$tab.navigateTo(`/pages/login`)
    }
  }

  function getCode() {
    getCodeImg().then(res => {
      captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled
        if (captchaEnabled.value) {
          codeUrl.value = 'data:image/gif;base64,' + res.img
          registerForm.value.uuid = res.uuid
      }
    })
  }

  function onDateChange(e) {
    registerForm.value.birthday = e.detail.value
    const birthYear = new Date(e.detail.value).getFullYear()
    const currentYear = new Date().getFullYear()
    registerForm.value.age = currentYear - birthYear
  }

  function validatePhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone)
  }

  function validateIdCard(idCard) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)
  }

  async function handleRegister() {
    if (registerForm.value.username === "") {
      proxy.$modal.msgError("请输入账号")
    } else if (registerForm.value.password === "") {
      proxy.$modal.msgError("请输入密码")
    } else if (registerForm.value.confirmPassword === "") {
      proxy.$modal.msgError("请确认密码")
    } else if (registerForm.value.password !== registerForm.value.confirmPassword) {
      proxy.$modal.msgError("两次输入的密码不一致")
    } else if (registerForm.value.name === "") {
      proxy.$modal.msgError("请输入真实姓名")
    } else if (!validatePhone(registerForm.value.phone)) {
      proxy.$modal.msgError("请输入正确的手机号码")
    } else if (!validateIdCard(registerForm.value.idCard)) {
      proxy.$modal.msgError("请输入正确的身份证号")
    } else if (registerForm.value.code === "" && captchaEnabled.value) {
      proxy.$modal.msgError("请输入验证码")
    } else {
      proxy.$modal.loading("注册中，请耐心等待...")
      userRegister()
    }
  }

  async function userRegister() {
    const data = {
      username: registerForm.value.username,
      password: registerForm.value.password,
      name: registerForm.value.name,
      phone: registerForm.value.phone,
      idCard: registerForm.value.idCard,
      gender: registerForm.value.gender,
      age: registerForm.value.age || 25,
      role: 'PATIENT',
      code: registerForm.value.code,
      uuid: registerForm.value.uuid
    }
    
    register(data).then(res => {
      proxy.$modal.closeLoading()
      uni.showModal({
        title: "注册成功",
        content: "恭喜您，账号注册成功！请登录使用",
        success: function (res) {
          if (res.confirm) {
            if (redirectUrl.value) {
              uni.redirectTo({ url: `/pages/login?redirect=${encodeURIComponent(redirectUrl.value)}` })
            } else {
              uni.redirectTo({ url: `/pages/login` })
            }
          }
        }
      })
    }).catch(() => {
      proxy.$modal.closeLoading()
      if (captchaEnabled.value) {
        getCode()
      }
    })
  }

  onLoad((options) => {
    if (options.redirect) {
      redirectUrl.value = options.redirect
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
    padding-bottom: 40rpx;

    .logo-content {
      width: 100%;
      text-align: center;
      padding-top: 10%;
      flex-direction: column;
      align-items: center;

      .logo-icon {
        width: 100rpx;
        height: 100rpx;
        background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
        border-radius: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16rpx;
        box-shadow: 0 8rpx 24rpx rgba(41, 121, 255, 0.3);
      }

      .title-wrap {
        .title {
          display: block;
          font-size: 40rpx;
          font-weight: bold;
          color: #333;
        }
        
        .subtitle {
          display: block;
          font-size: 24rpx;
          color: #666;
          margin-top: 8rpx;
        }
      }
    }

    .login-form-content {
      text-align: center;
      margin: 30rpx auto;
      width: 85%;

      .input-item {
        margin: 20rpx auto;
        background-color: #fff;
        height: 90rpx;
        border-radius: 45rpx;
        box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
        border: 2rpx solid #f0f0f0;

        .icon {
          margin-left: 30rpx;
          flex-shrink: 0;
        }
        
        .iconfont.icon {
          font-size: 40rpx;
          color: #2979ff;
        }

        .input {
          width: 100%;
          font-size: 28rpx;
          line-height: 20px;
          text-align: left;
          padding-left: 20rpx;
        }
        
        .picker-input {
          width: 100%;
          text-align: left;
          padding-left: 20rpx;
          font-size: 28rpx;
          
          .placeholder {
            color: #999;
          }
        }
        
        &.gender-select {
          .gender-options {
            display: flex;
            margin-left: 20rpx;
            
            .gender-item {
              padding: 10rpx 40rpx;
              margin-right: 20rpx;
              border-radius: 30rpx;
              font-size: 28rpx;
              color: #666;
              background: #f5f7fa;
              
              &.active {
                background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
                color: #fff;
              }
            }
          }
        }
      }

      .register-btn {
        margin-top: 40rpx;
        height: 90rpx;
        background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
        box-shadow: 0 8rpx 24rpx rgba(41, 121, 255, 0.3);
      }

      .xieyi {
        color: #333;
        margin-top: 30rpx;
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
