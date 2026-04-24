<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Bell, CircleCheck, Warning } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

interface Notification {
  id: number
  type: 'schedule_created' | 'schedule_updated' | 'schedule_cancelled' | 'conflict_warning' | 'reminder'
  title: string
  message: string
  time: string
  read: boolean
  scheduleId?: number
  scheduleDate?: string
}

const userStore = useUserStore()
const notifications = ref<Notification[]>([])
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
const dropdownVisible = ref(false)

let timer: any = null

const simulateNotifications = () => {
  const today = dayjs().format('YYYY-MM-DD')
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')
  
  notifications.value = [
    {
      id: 1,
      type: 'schedule_created',
      title: '新增排班',
      message: '您已被安排于明日出诊，时间为 09:00-17:00',
      time: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      read: false,
      scheduleDate: tomorrow,
    },
    {
      id: 2,
      type: 'conflict_warning',
      title: '排班冲突提醒',
      message: '检测到您的排班时间可能重叠，请及时处理',
      time: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
      read: false,
    },
    {
      id: 3,
      type: 'reminder',
      title: '排班提醒',
      message: '您明日有排班，请提前做好准备',
      time: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      read: true,
      scheduleDate: tomorrow,
    },
  ]
}

const markAsRead = (notification: Notification) => {
  notification.read = true
}

const markAllAsRead = () => {
  notifications.value.forEach(n => {
    n.read = true
  })
  ElMessage.success('全部已读')
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'schedule_created':
    case 'schedule_updated':
      return CircleCheck
    case 'conflict_warning':
      return Warning
    default:
      return Bell
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'schedule_created':
    case 'schedule_updated':
      return '#67c23a'
    case 'conflict_warning':
      return '#e6a23c'
    default:
      return '#409eff'
  }
}

onMounted(() => {
  simulateNotifications()
  
  timer = setInterval(() => {
    simulateNotifications()
  }, 300000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <el-popover
    v-model:visible="dropdownVisible"
    placement="bottom"
    width="350"
    trigger="click"
    :show-arrow="false"
  >
    <template #reference>
      <div class="notification-bell">
        <el-icon :size="20" color="#606266">
          <Bell />
        </el-icon>
        <el-badge v-if="unreadCount > 0" :value="unreadCount" class="badge" />
      </div>
    </template>

    <div class="notification-dropdown">
      <div class="notification-header">
        <span class="header-title">排班通知</span>
        <el-button size="small" link type="primary" @click="markAllAsRead">全部已读</el-button>
      </div>

      <div class="notification-list">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{ 'is-unread': !notification.read }"
          @click="markAsRead(notification)"
        >
          <div class="notification-icon" :style="{ backgroundColor: getTypeColor(notification.type) }">
            <el-icon :size="16" color="#fff">
              <component :is="getTypeIcon(notification.type)" />
            </el-icon>
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ notification.time }}</div>
          </div>
        </div>

        <el-empty v-if="notifications.length === 0" description="暂无通知" :image-size="60" />
      </div>
    </div>
  </el-popover>
</template>

<style scoped>
.notification-bell {
  position: relative;
  cursor: pointer;
  padding: 0 8px;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
}

.notification-dropdown {
  max-height: 400px;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.header-title {
  font-weight: 600;
  font-size: 1rem;
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f5f7fa;
}

.notification-item.is-unread {
  background-color: #ecf5ff;
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.notification-message {
  font-size: 0.75rem;
  color: #606266;
  margin-bottom: 4px;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.7rem;
  color: #909399;
}
</style>
