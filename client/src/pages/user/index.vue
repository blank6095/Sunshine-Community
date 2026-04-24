<template>
  <view class="container">
    <view class="content">
      <text class="title">个人中心</text>
      <view class="user-info">
        <text class="avatar">👤</text>
        <text class="name">用户</text>
      </view>
      <view class="menu">
        <view class="menu-item" @click="goToProfile">
          <text class="menu-text">个人信息</text>
        </view>
        <view class="menu-item" @click="goToLogin">
          <text class="menu-text">退出登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const goToProfile = () => {
  uni.navigateTo({ url: '/pages/user/profile' })
}

const goToLogin = () => {
  uni.reLaunch({ url: '/pages/login/index' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.container {
  min-height: 100vh;
  background-color: $bg-color;
}

.content {
  padding: $spacing-md;
}

.title {
  font-size: $font-size-xl;
  font-weight: bold;
  display: block;
  color: $text-primary;
  margin-bottom: $spacing-md;
}

.user-info {
  background: $white;
  padding: $spacing-lg;
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}

.avatar {
  font-size: 100rpx;
}

.name {
  font-size: $font-size-lg;
  font-weight: bold;
  color: $text-primary;
}

.menu {
  background: $white;
  border-radius: $radius-md;
}

.menu-item {
  padding: $spacing-md;
  border-bottom: 1rpx solid $border-color;
}

.menu-text {
  font-size: $font-size-md;
  color: $text-primary;
}
</style>
