<template>
  <div class="profile-page page-container">
    <div class="profile-header">
      <div class="user-card">
        <div class="avatar">
          <van-icon name="manager" size="40" color="#fff" />
        </div>
        <div class="user-info" v-if="authStore.user">
          <div class="user-name">{{ authStore.user.name }}</div>
          <div class="user-phone">{{ authStore.user.phone }}</div>
        </div>
        <div class="user-info" v-else>
          <router-link to="/login" class="login-link">立即登录</router-link>
        </div>
      </div>
    </div>

    <div class="page-content" v-if="authStore.isLoggedIn">
      <van-cell-group inset class="menu-group">
        <van-cell title="基本资料" is-link @click="$router.push('/profile/edit')" />
        <van-cell title="就诊人管理" is-link @click="$router.push('/profile/patients')" />
        <van-cell title="账号安全" is-link @click="$router.push('/profile/security')" />
      </van-cell-group>

      <van-cell-group inset class="menu-group" style="margin-top: 16px;">
        <van-cell title="我的预约" is-link @click="$router.push('/appointments')" />
        <van-cell title="预约记录" is-link @click="$router.push('/appointments/history')" />
      </van-cell-group>

      <van-cell-group inset class="menu-group" style="margin-top: 16px;">
        <van-cell title="帮助中心" is-link />
        <van-cell title="关于我们" is-link />
      </van-cell-group>

      <div class="logout-btn">
        <van-button round block type="danger" plain @click="handleLogout">
          退出登录
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showConfirmDialog } from 'vant'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  showConfirmDialog({
    title: '确认退出',
    message: '确定要退出登录吗？',
  }).then(() => {
    authStore.logout()
    router.push('/login')
  }).catch(() => {})
}
</script>

<style scoped>
.profile-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 30px 16px 50px;
  border-radius: 0 0 24px 24px;
}

.user-card {
  display: flex;
  align-items: center;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  margin-left: 16px;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.user-phone {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.login-link {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.menu-group {
  margin-top: -30px;
}

.menu-group .van-cell {
  padding: 14px 16px;
}

.logout-btn {
  margin-top: 30px;
  padding: 0 16px;
}
</style>
