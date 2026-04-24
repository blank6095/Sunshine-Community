<template>
  <view class="container">
    <view class="header">
      <view class="header-bg"></view>
      <view class="header-content">
        <view class="header-top">
          <view class="logo-section">
            <text class="logo-icon">🏥</text>
            <view class="logo-text">
              <text class="app-name">智慧医院</text>
              <text class="app-slogan">让就医更简单</text>
            </view>
          </view>
          <view class="user-avatar" @click="goToUser">
            <text>{{ isLoggedIn ? userAvatar : '👤' }}</text>
          </view>
        </view>
        
        <view class="search-bar" @click="goToDepartment">
          <text class="search-icon">🔍</text>
          <text class="search-placeholder">搜索科室、医生...</text>
        </view>
      </view>
    </view>

    <view class="content">
      <view class="quick-actions">
        <view class="section-header">
          <text class="section-title">快捷服务</text>
          <text class="section-more" @click="goToDepartment">更多 ></text>
        </view>
        <view class="action-grid">
          <view class="action-item" @click="goToDepartment">
            <view class="action-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <text>🏥</text>
            </view>
            <text class="action-text">选择科室</text>
          </view>
          <view class="action-item" @click="goToDoctor">
            <view class="action-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
              <text>👨‍⚕️</text>
            </view>
            <text class="action-text">选择医生</text>
          </view>
          <view class="action-item" @click="goToRecord">
            <view class="action-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
              <text>📋</text>
            </view>
            <text class="action-text">预约记录</text>
          </view>
          <view class="action-item" @click="goToAnnouncement">
            <view class="action-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
              <text>📢</text>
            </view>
            <text class="action-text">医院公告</text>
          </view>
        </view>
      </view>

      <view class="departments">
        <view class="section-header">
          <text class="section-title">热门科室</text>
          <text class="section-more" @click="goToDepartment">全部 ></text>
        </view>
        <scroll-view class="department-scroll" scroll-x="true">
          <view class="department-list">
            <view class="department-card" v-for="dept in hotDepartments" :key="dept.id" @click="goToDepartmentDetail(dept.id)">
              <view class="dept-icon">{{ dept.icon }}</view>
              <text class="dept-name">{{ dept.name }}</text>
              <text class="dept-desc">{{ dept.desc }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="announcements">
        <view class="section-header">
          <text class="section-title">就医指南</text>
        </view>
        <view class="guide-list">
          <view class="guide-item" v-for="guide in guides" :key="guide.id">
            <text class="guide-icon">{{ guide.icon }}</text>
            <view class="guide-content">
              <text class="guide-title">{{ guide.title }}</text>
              <text class="guide-desc">{{ guide.desc }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="auth-section" v-if="!isLoggedIn">
        <view class="auth-card">
          <text class="auth-title">登录后享受更多服务</text>
          <view class="auth-buttons">
            <view class="auth-btn login-btn" @click="goToLogin">
              <text>登录</text>
            </view>
            <view class="auth-btn register-btn" @click="goToRegister">
              <text>注册</text>
            </view>
          </view>
        </view>
      </view>

      <view class="user-welcome" v-else>
        <view class="welcome-card">
          <text class="welcome-text">欢迎回来，{{ userInfo?.realName || '用户' }}</text>
          <text class="welcome-desc">您有 {{ appointmentCount }} 条预约</text>
        </view>
      </view>
    </view>

    <view class="tab-bar">
      <view class="tab-item active">
        <text class="tab-icon">🏠</text>
        <text class="tab-text">首页</text>
      </view>
      <view class="tab-item" @click="goToDepartment">
        <text class="tab-icon">📋</text>
        <text class="tab-text">科室</text>
      </view>
      <view class="tab-item" @click="goToRecord">
        <text class="tab-icon">📅</text>
        <text class="tab-text">预约</text>
      </view>
      <view class="tab-item" @click="goToUser">
        <text class="tab-icon">👤</text>
        <text class="tab-text">我的</text>
      </view>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '@/store/modules/user'

export default {
  data() {
    return {
      hotDepartments: [
        { id: 1, icon: '🫁', name: '呼吸内科', desc: '呼吸道疾病' },
        { id: 2, icon: '🫀', name: '心血管内科', desc: '心脏疾病' },
        { id: 3, icon: '🦴', name: '骨科', desc: '骨科疾病' },
        { id: 4, icon: '👶', name: '儿科', desc: '儿童疾病' },
        { id: 5, icon: '👁️', name: '眼科', desc: '眼科疾病' }
      ],
      guides: [
        { id: 1, icon: '📝', title: '预约挂号', desc: '支持当日预约和未来7天预约' },
        { id: 2, icon: '💳', title: '在线支付', desc: '支持微信、支付宝支付' },
        { id: 3, icon: '📱', title: '电子病历', desc: '随时查看历史就诊记录' }
      ],
      appointmentCount: 0
    }
  },
  computed: {
    isLoggedIn() {
      return useUserStore().isLoggedIn
    },
    userInfo() {
      return useUserStore().userInfo
    },
    userAvatar() {
      return this.userInfo?.realName?.charAt(0) || '👤'
    }
  },
  onShow() {
    if (this.isLoggedIn) {
      this.fetchAppointmentCount()
    }
  },
  methods: {
    goToDepartment() {
      uni.switchTab({ url: '/pages/department/index' })
    },
    goToDoctor() {
      uni.navigateTo({ url: '/pages/doctor/index' })
    },
    goToRecord() {
      uni.switchTab({ url: '/pages/record/index' })
    },
    goToUser() {
      uni.switchTab({ url: '/pages/user/index' })
    },
    goToLogin() {
      uni.navigateTo({ url: '/pages/login/index' })
    },
    goToRegister() {
      uni.navigateTo({ url: '/pages/login/register' })
    },
    goToDepartmentDetail(id) {
      uni.navigateTo({ url: `/pages/department/detail?id=${id}` })
    },
    goToAnnouncement() {
      uni.showToast({ title: '公告功能开发中', icon: 'none' })
    },
    async fetchAppointmentCount() {
      try {
        // Simulated count - in real app would call API
        this.appointmentCount = 0
      } catch (error) {
        console.error('获取预约数量失败:', error)
      }
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 120px;
}

.header {
  position: relative;
  padding: 0 0 60px 0;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 50%, #0043a8 100%);
  border-radius: 0 0 40px 40px;
}

.header-content {
  position: relative;
  z-index: 10;
  padding: 40px 30px 0 30px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  font-size: 48px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.app-name {
  font-size: 36px;
  font-weight: bold;
  color: white;
}

.app-slogan {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.8);
}

.user-avatar {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 50px;
  padding: 24px 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-icon {
  font-size: 28px;
  margin-right: 16px;
}

.search-placeholder {
  font-size: 28px;
  color: #999;
}

.content {
  padding: 30px;
  margin-top: -40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.section-more {
  font-size: 26px;
  color: #1890ff;
}

.quick-actions {
  background: white;
  border-radius: 24px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.action-icon {
  width: 100px;
  height: 100px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-text {
  font-size: 24px;
  color: #666;
}

.departments {
  background: white;
  border-radius: 24px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.department-scroll {
  white-space: nowrap;
}

.department-list {
  display: inline-flex;
  gap: 20px;
  padding: 10px 0;
}

.department-card {
  width: 200px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20px;
  padding: 24px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.dept-icon {
  font-size: 56px;
}

.dept-name {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.dept-desc {
  font-size: 22px;
  color: #999;
}

.announcements {
  background: white;
  border-radius: 24px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.guide-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.guide-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 16px;
}

.guide-icon {
  font-size: 40px;
}

.guide-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.guide-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.guide-desc {
  font-size: 24px;
  color: #999;
}

.auth-section,
.user-welcome {
  margin-bottom: 30px;
}

.auth-card,
.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 40px;
  text-align: center;
}

.auth-title {
  font-size: 30px;
  font-weight: bold;
  color: white;
  display: block;
  margin-bottom: 30px;
}

.auth-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.auth-btn {
  padding: 20px 50px;
  border-radius: 50px;
  font-size: 28px;
  font-weight: bold;
}

.login-btn {
  background: white;
  color: #667eea;
}

.register-btn {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  border: 2px solid white;
}

.welcome-text {
  font-size: 30px;
  font-weight: bold;
  color: white;
  display: block;
  margin-bottom: 12px;
}

.welcome-desc {
  font-size: 26px;
  color: rgba(255, 255, 255, 0.9);
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110px;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.tab-icon {
  font-size: 40px;
}

.tab-text {
  font-size: 22px;
  color: #999;
}

.tab-item.active .tab-text {
  color: #1890ff;
}
</style>
