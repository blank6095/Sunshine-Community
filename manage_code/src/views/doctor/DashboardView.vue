<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { getSchedulesByDoctor, getAppointmentsByDoctor } from '@/api'
import { ElMessage } from 'element-plus'
import type { Schedule, Appointment } from '@/types'

const userStore = useUserStore()
const loading = ref(false)
const scheduleCount = ref(0)
const appointmentCount = ref(0)
const pendingAppointments = ref(0)
const todaySchedules = ref<Schedule[]>([])

onMounted(async () => {
  loading.value = true
  try {
    if (userStore.user) {
      const schedulesRes = await getSchedulesByDoctor(userStore.user.id)
      todaySchedules.value = schedulesRes.data
      scheduleCount.value = schedulesRes.data.length

      const appointmentsRes = await getAppointmentsByDoctor(userStore.user.id)
      const appointments: Appointment[] = appointmentsRes.data
      appointmentCount.value = appointments.length
      pendingAppointments.value = appointments.filter((a) => a.status === 'PENDING').length
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
})

const stats = computed(() => [
  { title: '今日排班', value: scheduleCount.value, icon: 'Calendar', color: '#409eff' },
  { title: '总预约数', value: appointmentCount.value, icon: 'Document', color: '#67c23a' },
  { title: '待确认预约', value: pendingAppointments.value, icon: 'Clock', color: '#e6a23c' },
])
</script>

<template>
  <div class="dashboard" v-loading="loading">
    <h2 class="page-title">欢迎，{{ userStore.user?.name }}</h2>

    <el-row :gutter="12" class="stats-row">
      <el-col v-for="stat in stats" :key="stat.title" :xs="12" :sm="8" :md="8">
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

    <el-card class="schedule-card">
      <template #header>
        <div class="card-header">
          <span>今日排班</span>
        </div>
      </template>
      <el-empty v-if="todaySchedules.length === 0" description="暂无排班" />
      <el-table v-else :data="todaySchedules" style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="startTime" label="开始时间" width="100" />
        <el-table-column prop="endTime" label="结束时间" width="100" />
        <el-table-column prop="maxPatients" label="最大预约人数" min-width="120" />
        <el-table-column prop="availableSlots" label="剩余名额" min-width="100" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">
              {{ row.status === 'ACTIVE' ? '正常' : '已取消' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.dashboard {
  padding: clamp(12px, 2vw, 24px);
  width: 100%;
  box-sizing: border-box;
}

.page-title {
  margin: 0 0 1.5rem;
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

.schedule-card {
  margin-top: 0.75rem;
  border-radius: 10px;
  overflow: hidden;
}

.schedule-card :deep(.el-card__header) {
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
}
</style>
