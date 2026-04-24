<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getDoctors, getAppointments, getDepartments } from '@/api'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const stats = ref({
  doctorCount: 0,
  departmentCount: 0,
  appointmentCount: 0,
  pendingAppointments: 0,
})

onMounted(async () => {
  loading.value = true
  try {
    const doctorsRes = await getDoctors()
    stats.value.doctorCount = doctorsRes.data.length

    const deptsRes = await getDepartments()
    stats.value.departmentCount = deptsRes.data.length

    const appointmentsRes = await getAppointments()
    const appointments = appointmentsRes.data
    stats.value.appointmentCount = appointments.length
    stats.value.pendingAppointments = appointments.filter((a: any) => a.status === 'PENDING').length
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
})

const statCards = computed(() => [
  { title: '医生总数', value: stats.value.doctorCount, icon: 'UserFilled', color: '#409eff' },
  { title: '科室总数', value: stats.value.departmentCount, icon: 'OfficeBuilding', color: '#67c23a' },
  { title: '预约总数', value: stats.value.appointmentCount, icon: 'Document', color: '#e6a23c' },
  { title: '待处理预约', value: stats.value.pendingAppointments, icon: 'Clock', color: '#f56c6c' },
])
</script>

<template>
  <div class="dashboard" v-loading="loading">
    <h2 class="page-title">管理工作台</h2>

    <el-row :gutter="12" class="stats-row">
      <el-col v-for="stat in statCards" :key="stat.title" :xs="12" :sm="12" :md="6" :lg="6">
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

    <el-row :gutter="12" class="actions-row">
      <el-col :xs="12" :sm="12" :md="6" :lg="6">
        <el-card class="action-card">
          <template #header>
            <div class="card-header">
              <span>快速操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <router-link to="/admin/doctors">
              <el-button type="primary" class="action-btn">
                <el-icon><UserFilled /></el-icon>医生管理
              </el-button>
            </router-link>
            <router-link to="/admin/departments">
              <el-button type="success" class="action-btn">
                <el-icon><OfficeBuilding /></el-icon>科室管理
              </el-button>
            </router-link>
            <router-link to="/admin/appointments">
              <el-button type="warning" class="action-btn">
                <el-icon><Document /></el-icon>预约管理
              </el-button>
            </router-link>
            <router-link to="/admin/users">
              <el-button type="info" class="action-btn">
                <el-icon><Avatar /></el-icon>用户管理
              </el-button>
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

.actions-row {
  margin-bottom: 1rem;
}

.action-card {
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
}

.action-card :deep(.el-card__header) {
  padding: 14px 18px;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  border-bottom: 1px solid var(--border-color);
}

.card-header span {
  font-weight: 600;
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  color: var(--text-primary);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding: 8px 0;
}

@media (min-width: 992px) {
  .quick-actions {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 576px) {
  .quick-actions {
    grid-template-columns: 1fr;
  }
}

.quick-actions a {
  text-decoration: none;
  display: block;
}

.action-btn {
  width: 100%;
  height: clamp(40px, 5vw, 44px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: clamp(0.8rem, 1vw, 0.9rem);
  border-radius: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border: none;
  font-weight: 500;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
}
</style>
