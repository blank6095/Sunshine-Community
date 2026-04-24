<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import { getAppointments, updateAppointment, deleteAppointment } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Appointment } from '@/types'
import PaginationBar from '@/components/PaginationBar.vue'

const loading = ref(false)
const appointments = ref<Appointment[]>([])
const searchQuery = ref('')
const statusFilter = ref('')

const loadAppointments = async () => {
  loading.value = true
  try {
    const res = await getAppointments()
    appointments.value = res.data
  } catch (error) {
    ElMessage.error('加载预约列表失败')
  } finally {
    loading.value = false
  }
}

const filteredAppointments = computed(() => {
  let result = appointments.value

  if (statusFilter.value) {
    result = result.filter((a) => a.status === statusFilter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (a) =>
        a.patientName?.toLowerCase().includes(q) ||
        a.doctorName?.toLowerCase().includes(q) ||
        a.departmentName?.toLowerCase().includes(q)
    )
  }

  return result
})

const handleConfirm = async (row: any) => {
  try {
    await updateAppointment(row.id, { status: 'CONFIRMED' })
    ElMessage.success('确认成功')
    loadAppointments()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleCancel = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要取消该预约吗？', '提示', { type: 'warning' })
    await updateAppointment(row.id, { status: 'CANCELLED' })
    ElMessage.success('取消成功')
    loadAppointments()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该预约吗？', '提示', { type: 'warning' })
    await deleteAppointment(row.id)
    ElMessage.success('删除成功')
    loadAppointments()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleReset = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}

const currentPage = ref(1)
const pageSize = ref(10)

const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAppointments.value.slice(start, end)
})

const handlePageChange = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    COMPLETED: 'info',
    CANCELLED: 'danger',
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    PENDING: '待确认',
    CONFIRMED: '已确认',
    COMPLETED: '已完成',
    CANCELLED: '已取消',
  }
  return texts[status] || status
}

onMounted(() => {
  loadAppointments()
})
</script>

<template>
  <div class="appointments-view">
    <div class="page-header">
      <h2 class="page-title">预约管理</h2>
      <div class="header-actions">
        <el-button @click="handleReset" :icon="RefreshLeft">重置筛选</el-button>
      </div>
    </div>

    <el-card class="filter-card" shadow="never">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="8" :md="6">
          <el-input
            v-model="searchQuery"
            placeholder="搜索患者/医生/科室"
            :prefix-icon="Search"
            clearable
          />
        </el-col>
        <el-col :xs="24" :sm="8" :md="5">
          <el-select v-model="statusFilter" placeholder="筛选状态" clearable style="width: 100%">
            <el-option label="全部状态" value="" />
            <el-option label="待确认" value="PENDING" />
            <el-option label="已确认" value="CONFIRMED" />
            <el-option label="已完成" value="COMPLETED" />
            <el-option label="已取消" value="CANCELLED" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="8" :md="4">
          <el-tag size="large" type="info">
            总计：{{ filteredAppointments.length }} 条
          </el-tag>
        </el-col>
      </el-row>
    </el-card>

    <el-table v-loading="loading" :data="paginatedAppointments" style="width: 100%; margin-top: 16px" stripe>
      <el-table-column prop="patientName" label="患者姓名" width="120" />
      <el-table-column prop="patientId" label="患者ID" width="100" />
      <el-table-column prop="doctorName" label="医生姓名" width="120" />
      <el-table-column prop="departmentName" label="科室" width="120" />
      <el-table-column prop="appointmentTime" label="预约时间" width="180">
        <template #default="{ row }">
          {{ row.appointmentTime.replace('T', ' ') }}
        </template>
      </el-table-column>
      <el-table-column prop="symptoms" label="症状描述" min-width="150" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-button v-if="row.status === 'PENDING'" size="small" type="success" @click="handleConfirm(row)">
            确认
          </el-button>
          <el-button v-if="row.status === 'PENDING' || row.status === 'CONFIRMED'" size="small" type="danger" @click="handleCancel(row)">
            取消
          </el-button>
          <el-button size="small" type="info" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <PaginationBar
      v-if="filteredAppointments.length > 0"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="filteredAppointments.length"
      @change="handlePageChange"
    />
  </div>
</template>

<style scoped>
.appointments-view {
  padding: clamp(12px, 2vw, 24px);
  width: 100%;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.75rem;
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

.header-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-card {
  border-radius: 8px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
}

.filter-card :deep(.el-card__body) {
  padding: clamp(0.75rem, 2vw, 1rem);
}

@media (max-width: 768px) {
  .appointments-view {
    padding: clamp(10px, 1.5vw, 16px);
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
  }
}
</style>
