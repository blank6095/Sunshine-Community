<template>
  <view class="mine-container" :style="{height: `${windowHeight}px`}">
    <view class="header-section">
      <view class="header-bg"></view>
      <view class="header-content">
        <view class="user-card">
          <view class="avatar-section" @click="handleToAvatar">
            <image v-if="avatar" :src="avatar" class="user-avatar" mode="aspectFill"></image>
            <view v-else class="user-avatar default-avatar">
              <uni-icons type="person-filled" size="40" color="#fff"></uni-icons>
            </view>
          </view>
          <view class="user-info" @click="handleToInfo">
            <view v-if="!name" class="login-tip">点击登录</view>
            <view v-else>
              <text class="user-name">{{ name }}</text>
              <text class="user-role">患者用户</text>
            </view>
          </view>
          <view class="arrow-icon" @click="handleToInfo">
            <uni-icons type="right" size="18" color="#fff"></uni-icons>
          </view>
        </view>
      </view>
    </view>

    <view class="content-section">
      <view class="quick-actions">
        <view class="action-item" @click="goToAppointment">
          <view class="action-icon" style="background: #e8f4ff;">
            <uni-icons type="calendar" size="24" color="#2979ff"></uni-icons>
          </view>
          <text class="action-text">我的预约</text>
        </view>
        <view class="action-item" @click="goToMedicalRecord">
          <view class="action-icon" style="background: #fff8e6;">
            <uni-icons type="list" size="24" color="#ff9900"></uni-icons>
          </view>
          <text class="action-text">就诊记录</text>
        </view>
        <view class="action-item" @click="goToGuide">
          <view class="action-icon" style="background: #e8f8e8;">
            <uni-icons type="help" size="24" color="#19be6b"></uni-icons>
          </view>
          <text class="action-text">就医指南</text>
        </view>
        <view class="action-item" @click="goToAnnouncement">
          <view class="action-icon" style="background: #fff0f0;">
            <uni-icons type="sound" size="24" color="#fa3534"></uni-icons>
          </view>
          <text class="action-text">医院公告</text>
        </view>
      </view>

      <view class="menu-list">
        <view class="list-cell list-cell-arrow" @click="handleToEditInfo">
          <view class="menu-item-box">
            <uni-icons type="person" size="20" color="#2979ff" class="menu-icon"></uni-icons>
            <view>个人信息</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleToPwd">
          <view class="menu-item-box">
            <uni-icons type="locked" size="20" color="#ff9900" class="menu-icon"></uni-icons>
            <view>修改密码</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleHelp">
          <view class="menu-item-box">
            <uni-icons type="help" size="20" color="#19be6b" class="menu-icon"></uni-icons>
            <view>常见问题</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleAbout">
          <view class="menu-item-box">
            <uni-icons type="info" size="20" color="#fa3534" class="menu-icon"></uni-icons>
            <view>关于我们</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleToSetting">
          <view class="menu-item-box">
            <uni-icons type="gear" size="20" color="#666" class="menu-icon"></uni-icons>
            <view>设置</view>
          </view>
        </view>
      </view>

      <view class="logout-btn" v-if="name" @click="handleLogout">
        <text>退出登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
  import { useUserStore } from '@/store'
  import { computed, getCurrentInstance } from "vue"

  const { proxy } = getCurrentInstance()
  const userStore = useUserStore()
  const name = computed(() => userStore.name)
  const avatar = computed(() => userStore.avatar)
  const windowHeight = computed(() => uni.getSystemInfoSync().windowHeight - 50)

  function handleToInfo() {
    proxy.$tab.navigateTo('/pages/mine/info/index')
  }

  function handleToEditInfo() {
    proxy.$tab.navigateTo('/pages/mine/info/edit')
  }

  function handleToPwd() {
    proxy.$tab.navigateTo('/pages/mine/pwd/index')
  }

  function handleToSetting() {
    proxy.$tab.navigateTo('/pages/mine/setting/index')
  }

  function handleToLogin() {
    proxy.$tab.reLaunch('/pages/login')
  }

  function handleToAvatar() {
    proxy.$tab.navigateTo('/pages/mine/avatar/index')
  }
      
  function handleHelp() {
    proxy.$tab.navigateTo('/pages/mine/help/index')
  }
      
  function handleAbout() {
    proxy.$tab.navigateTo('/pages/mine/about/index')
  }

  function goToAppointment() {
    proxy.$tab.navigateTo('/pages/hospital/my-appointment')
  }

  function goToMedicalRecord() {
    proxy.$modal.showToast('功能开发中')
  }

  function goToGuide() {
    proxy.$tab.navigateTo('/pages/hospital/guide')
  }

  function goToAnnouncement() {
    proxy.$tab.navigateTo('/pages/hospital/announcement')
  }

  function handleLogout() {
    uni.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          userStore.logOut().then(() => {
            proxy.$tab.reLaunch('/pages/login')
          })
        }
      }
    })
  }
</script>

<style lang="scss" scoped>
  page {
    background-color: #f5f7fa;
  }

  .mine-container {
    width: 100%;
    height: 100%;

    .header-section {
      position: relative;
      
      .header-bg {
        height: 200rpx;
        background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
      }
      
      .header-content {
        position: relative;
        margin-top: -100rpx;
        padding: 0 30rpx;
        
        .user-card {
          display: flex;
          align-items: center;
          background: #fff;
          padding: 30rpx;
          border-radius: 20rpx;
          box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
          
          .avatar-section {
            margin-right: 24rpx;
            
            .user-avatar {
              width: 120rpx;
              height: 120rpx;
              border-radius: 50%;
              overflow: hidden;
              
              &.default-avatar {
                background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
          }
          
          .user-info {
            flex: 1;
            
            .login-tip {
              font-size: 32rpx;
              color: #2979ff;
            }
            
            .user-name {
              display: block;
              font-size: 36rpx;
              font-weight: bold;
              color: #333;
            }
            
            .user-role {
              display: block;
              font-size: 26rpx;
              color: #999;
              margin-top: 8rpx;
            }
          }
          
          .arrow-icon {
            padding: 10rpx;
          }
        }
      }
    }

    .content-section {
      padding: 20rpx;
      
      .quick-actions {
        display: flex;
        justify-content: space-around;
        background: #fff;
        padding: 30rpx 20rpx;
        border-radius: 16rpx;
        margin-bottom: 20rpx;
        
        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          
          .action-icon {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12rpx;
          }
          
          .action-text {
            font-size: 26rpx;
            color: #333;
          }
        }
      }
      
      .menu-list {
        background: #fff;
        border-radius: 16rpx;
        overflow: hidden;
        margin-bottom: 20rpx;

        .list-cell {
          padding: 24rpx 30rpx;
          border-bottom: 1rpx solid #f0f0f0;
          
          &:last-child {
            border-bottom: none;
          }
          
          &.list-cell-arrow::before {
            content: '';
            position: absolute;
            right: 30rpx;
            top: 50%;
            transform: translateY(-50%);
            width: 12rpx;
            height: 12rpx;
            border-top: 2rpx solid #ccc;
            border-right: 2rpx solid #ccc;
            transform: translateY(-50%) rotate(45deg);
          }

          .menu-item-box {
            display: flex;
            align-items: center;
            
            .menu-icon {
              margin-right: 20rpx;
            }
            
            view {
              font-size: 30rpx;
              color: #333;
            }
          }
        }
      }
      
      .logout-btn {
        background: #fff;
        padding: 30rpx;
        border-radius: 16rpx;
        text-align: center;
        
        text {
          font-size: 30rpx;
          color: #fa3534;
        }
      }
    }
  }
</style>
