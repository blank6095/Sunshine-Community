<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getSchedulesByDoctor, getAppointmentsByDoctor } from '@/api'
import { ElMessage } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { Schedule, Appointment } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const schedules = ref<Schedule[]>([])
const appointments = ref<Appointment[]>([])
const todayAppointments = ref<Appointment[]>([])

onMounted(async () => {
  loading.value = true
  try {
    if (userStore.user) {
      const [schedulesRes, appointmentsRes] = await Promise.all([
        getSchedulesByDoctor(userStore.user.id),
        getAppointmentsByDoctor(userStore.user.id),
      ])
      schedules.value = schedulesRes.data
      appointments.value = appointmentsRes.data

      const today = dayjs().format('YYYY-MM-DD')
      todayAppointments.value = appointments.value.filter((a) =>
        a.appointmentTime.startsWith(today) && a.status !== 'CANCELLED'
      )
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
})

const stats = computed(() => {
  const today = dayjs().format('YYYY-MM-DD')
  const todaySchedules = schedules.value.filter((s) => s.date === today && s.status === 'ACTIVE')
  const pendingCount = appointments.value.filter((a) => a.status === 'PENDING').length
  const confirmedCount = appointments.value.filter((a) => a.status === 'CONFIRMED').length
  const completedCount = appointments.value.filter((a) => a.status === 'COMPLETED').length
  const totalSlots = todaySchedules.reduce((sum, s) => sum + s.maxPatients, 0)
  const bookedSlots = todaySchedules.reduce((sum, s) => sum + (s.maxPatients - s.availableSlots), 0)

  return [
    { title: '今日排班', value: todaySchedules.length, icon: 'Calendar', color: '#409eff' },
    { title: '待确认', value: pendingCount, icon: 'Clock', color: '#e6a23c' },
    { title: '已确认', value: confirmedCount, icon: 'CircleCheck', color: '#00bcd4' },
    { title: '已完成', value: completedCount, icon: 'SuccessFilled', color: '#67c23a' },
    { title: '今日号源', value: totalSlots, icon: 'Tickets', color: '#9c27b0' },
    { title: '已预约', value: bookedSlots, icon: 'User', color: '#f56c6c' },
  ]
})

const completionRate = computed(() => {
  const completed = appointments.value.filter((a) => a.status === 'COMPLETED').length
  if (appointments.value.length === 0) return 0
  return Math.round((completed / appointments.value.length) * 100)
})

const pendingRate = computed(() => {
  const pending = appointments.value.filter((a) => a.status === 'PENDING').length
  if (appointments.value.length === 0) return 0
  return Math.round((pending / appointments.value.length) * 100)
})

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    PENDING: 'warning',
    CONFIRMED: 'primary',
    COMPLETED: 'success',
    CANCELLED: 'danger',
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    PENDING: '待确认',
    CONFIRMED: '已确认',
    COMPLETED: '已完成',
    CANCELLED: '已取消',
  }
  return map[status] || status
}

const formatTime = (time: string) => {
  return time.replace('T', ' ')
}
</script>

<template>
  <div class="dashboard" v-loading="loading">
    <div class="page-header">
      <h2 class="page-title">欢迎，{{ userStore.user?.name }}</h2>
      <div class="header-time">
        {{ new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }) }}
      </div>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col v-for="stat in stats" :key="stat.title" :xs="12" :sm="8" :md="6" :lg="4">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <el-icon :size="28" color="#fff"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="content-row">
      <el-col :xs="24" :md="16">
        <el-card class="appointment-card">
          <template #header>
            <div class="card-header">
              <span>今日预约</span>
              <el-button type="primary" link @click="router.push('/doctor/appointments')">
                查看全部<el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </template>
          <el-empty v-if="todayAppointments.length === 0" description="今日暂无预约" />
          <el-table v-else :data="todayAppointments" size="small" style="width: 100%">
            <el-table-column prop="patientName" label="患者" width="100" />
            <el-table-column prop="appointmentTime" label="预约时间" width="160">
              <template #default="{ row }">
                {{ formatTime(row.appointmentTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="symptoms" label="症状描述" min-width="150" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusText(row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button v-if="row.status === 'PENDING'" size="small" type="success" link @click="router.push('/doctor/appointments')">
                  确认
                </el-button>
                <el-button v-if="row.status === 'CONFIRMED'" size="small" type="primary" link @click="router.push('/doctor/appointments')">
                  完成
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="8">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <span>工作概览</span>
            </div>
          </template>
          <div class="analysis-content">
            <div class="analysis-item">
              <div class="analysis-label">完成率</div>
              <div class="analysis-value" :style="{ color: completionRate >= 60 ? '#67c23a' : '#e6a23c' }">
                {{ completionRate }}%
              </div>
              <el-progress :percentage="completionRate" :color="completionRate >= 60 ? '#67c23a' : '#e6a23c'" :stroke-width="8" />
            </div>
            <div class="analysis-item">
              <div class="analysis-label">待处理占比</div>
              <div class="analysis-value" :style="{ color: pendingRate <= 30 ? '#67c23a' : pendingRate <= 50 ? '#e6a23c' : '#f56c6c' }">
                {{ pendingRate }}%
              </div>
              <el-progress :percentage="pendingRate" :color="pendingRate <= 30 ? '#67c23a' : pendingRate <= 50 ? '#e6a23c' : '#f56c6c'" :stroke-width="8" />
            </div>
            <div class="analysis-item">
              <div class="analysis-label">总预约数</div>
              <div class="analysis-value">{{ appointments.length }}</div>
            </div>
            <div class="analysis-item">
              <div class="analysis-label">总排班数</div>
              <div class="analysis-value">{{ schedules.length }}</div>
            </div>
          </div>
        </el-card>

        <el-card class="quick-card" style="margin-top: 16px">
          <template #header>
            <div class="card-header">
              <span>快速操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <router-link to="/doctor/schedule" class="quick-link">
              <el-icon color="#409eff"><Calendar /></el-icon>
              <span>日程管理</span>
            </router-link>
            <router-link to="/doctor/appointments" class="quick-link">
              <el-icon color="#67c23a"><Document /></el-icon>
              <span>预约管理</span>
            </router-link>
            <router-link to="/doctor/profile" class="quick-link">
              <el-icon color="#e6a23c"><User /></el-icon>
              <span>个人信息</span>
            </router-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard {
  padding: clamp(12px, 2vw, 24px);
  width: 100%;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  margin: 0;
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  color: var(--text-primary);
  font-weight: 600;
  position: relative;
  padding-left: 12px;
}

.page-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 1.2em;
  background: linear-gradient(135deg, var(--primary-color), #669df6);
  border-radius: 2px;
}

.header-time {
  font-size: clamp(0.8rem, 1vw, 0.9rem);
  color: var(--text-secondary);
  padding: 6px 12px;
  background: var(--background-color);
  border-radius: 6px;
}

.stats-row {
  margin-bottom: 1.5rem;
}

.stat-card {
  margin-bottom: 0.75rem;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 8px 0;
}

.stat-icon {
  width: clamp(44px, 7vw, 60px);
  height: clamp(44px, 7vw, 60px);
  min-width: 44px;
  min-height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: clamp(1.35rem, 2.5vw, 1.85rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: clamp(0.75rem, 1.2vw, 0.85rem);
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.content-row {
  margin-bottom: 1rem;
}

.appointment-card,
.analysis-card,
.quick-card {
  border-radius: 10px;
  overflow: hidden;
  height: 100%;
}

.appointment-card :deep(.el-card__header),
.analysis-card :deep(.el-card__header),
.quick-card :deep(.el-card__header) {
  padding: 14px 18px;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  border-bottom: 1px solid var(--border-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  color: var(--text-primary);
}

.analysis-content {
  padding: 8px 0;
}

.analysis-item {
  margin-bottom: 1.25rem;
}

.analysis-item:last-child {
  margin-bottom: 0;
}

.analysis-label {
  font-size: clamp(0.75rem, 1vw, 0.85rem);
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.analysis-value {
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--primary-color);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
  padding: 8px 0;
}

.quick-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  background: var(--background-color);
}

.quick-link:hover {
  background: #ecf5ff;
  transform: translateY(-2px);
}

.quick-link .el-icon {
  font-size: 24px;
}

.quick-link span {
  font-size: clamp(0.75rem, 1vw, 0.85rem);
  color: var(--text-regular);
  font-weight: 500;
}

@media (max-width: 768px) {
  .dashboard {
    padding: clamp(10px, 1.5vw, 16px);
  }

  .stats-row {
    margin-bottom: 1rem;
  }

  .stat-card {
    margin-bottom: 0.625rem;
  }

  .stat-content {
    gap: 0.75rem;
  }

  .quick-actions {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.625rem;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: 10px;
  }

  .stat-icon {
    width: 42px;
    height: 42px;
    min-width: 42px;
    min-height: 42px;
    border-radius: 10px;
  }

  .stat-icon .el-icon {
    font-size: 20px !important;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>