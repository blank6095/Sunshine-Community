<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ScheduleNotification from '@/components/ScheduleNotification.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapse = ref(false)
const windowWidth = ref(window.innerWidth)

const isAdmin = computed(() => userStore.isAdmin)

const doctorMenus = [
  { path: '/doctor/dashboard', title: '工作台', icon: 'HomeFilled' },
  { path: '/doctor/schedule', title: '日程管理', icon: 'Calendar' },
  { path: '/doctor/appointments', title: '预约管理', icon: 'Document' },
  { path: '/doctor/profile', title: '个人信息', icon: 'User' },
]

const adminMenus = [
  { path: '/admin/dashboard', title: '工作台', icon: 'HomeFilled' },
  { path: '/admin/doctors', title: '医生管理', icon: 'UserFilled' },
  { path: '/admin/departments', title: '科室管理', icon: 'OfficeBuilding' },
  { path: '/admin/schedules', title: '排班管理', icon: 'Calendar' },
  { path: '/admin/appointments', title: '预约管理', icon: 'Document' },
  { path: '/admin/users', title: '用户管理', icon: 'Avatar' },
]

const menus = computed(() => (isAdmin.value ? adminMenus : doctorMenus))

const sidebarWidth = computed(() => {
  if (isCollapse.value) return '64px'
  if (windowWidth.value <= 768) return '64px'
  return '220px'
})

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
  if (windowWidth.value <= 768) {
    isCollapse.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
</script>

<template>
  <div class="main-layout">
    <el-container>
      <el-aside :width="sidebarWidth" class="aside">
        <div class="logo">
          <el-icon :size="28"><School /></el-icon>
          <span v-show="!isCollapse" class="logo-text">挂号系统</span>
        </div>
        <el-menu
          :default-active="route.path"
          :collapse="isCollapse"
          router
          background-color="#ffffff"
          text-color="#303133"
          active-text-color="#409eff"
          class="menu"
        >
          <el-menu-item v-for="menu in menus" :key="menu.path" :index="menu.path">
            <el-icon><component :is="menu.icon" /></el-icon>
            <template #title>{{ menu.title }}</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="header-left">
            <el-icon class="collapse-btn" @click="toggleSidebar">
              <Fold v-if="!isCollapse" />
              <Expand v-else />
            </el-icon>
          </div>
          <div class="header-right">
            <ScheduleNotification />
            <el-dropdown trigger="click">
              <span class="user-info">
                <el-avatar :size="32">{{ userStore.user?.name?.charAt(0) }}</el-avatar>
                <span class="username">{{ userStore.user?.name }}</span>
                <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main class="main-content">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.main-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.el-container {
  width: 100%;
  height: 100%;
  flex: 1;
}

.aside {
  background: #fff;
  border-right: 1px solid var(--border-color);
  transition: width 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
}

.logo {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid var(--border-color);
  color: var(--primary-color);
  flex-shrink: 0;
  padding: 0 8px;
}

.logo-text {
  font-size: clamp(14px, 1.5vw, 18px);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu {
  border-right: none;
  height: calc(100% - var(--header-height));
  overflow-y: auto;
  overflow-x: hidden;
}

.header {
  background: #fff;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(10px, 2vw, 20px);
  height: var(--header-height) !important;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: var(--text-regular);
  transition: all 0.2s ease;
  padding: 4px;
  border-radius: 4px;
}

.collapse-btn:hover {
  color: var(--primary-color);
  background-color: rgba(64, 158, 255, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.user-info:hover {
  background-color: var(--background-color);
}

.username {
  font-size: clamp(12px, 1.2vw, 14px);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 12px;
  color: var(--text-secondary);
}

.main-content {
  background: var(--background-color);
  padding: clamp(12px, 2vw, 24px);
  overflow-y: auto;
  overflow-x: hidden;
  min-height: calc(100vh - var(--header-height));
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .aside {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
  }

  .header {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .username {
    display: none;
  }

  .header-right {
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 8px;
  }

  .header {
    padding: 0 10px;
  }
  
  .logo {
    padding: 0 6px;
  }
}
</style>
