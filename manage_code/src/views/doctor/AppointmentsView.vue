<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAppointmentsByDoctor, updateAppointment } from '@/api'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Appointment } from '@/types'

const userStore = useUserStore()
const loading = ref(false)
const appointments = ref<Appointment[]>([])
const statusFilter = ref('')

const loadAppointments = async () => {
  loading.value = true
  try {
    if (userStore.user) {
      const res = await getAppointmentsByDoctor(userStore.user.id)
      let data = res.data
      if (statusFilter.value) {
        data = data.filter((a: any) => a.status === statusFilter.value)
      }
      appointments.value = data
    }
  } catch (error) {
    ElMessage.error('加载预约列表失败')
  } finally {
    loading.value = false
  }
}

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

const handleComplete = async (row: any) => {
  try {
    await updateAppointment(row.id, { status: 'COMPLETED' })
    ElMessage.success('标记完成')
    loadAppointments()
  } catch (error) {
    ElMessage.error('操作失败')
  }
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
      <h2>预约管理</h2>
      <el-select v-model="statusFilter" placeholder="筛选状态" clearable style="width: 150px" @change="loadAppointments">
        <el-option label="待确认" value="PENDING" />
        <el-option label="已确认" value="CONFIRMED" />
        <el-option label="已完成" value="COMPLETED" />
        <el-option label="已取消" value="CANCELLED" />
      </el-select>
    </div>

    <el-table v-loading="loading" :data="appointments" style="width: 100%">
      <el-table-column prop="patientName" label="患者姓名" width="120" />
      <el-table-column prop="patientId" label="患者ID" width="100" />
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
          <el-button v-if="row.status === 'CONFIRMED'" size="small" type="primary" @click="handleComplete(row)">
            完成
          </el-button>
          <el-button v-if="row.status === 'PENDING' || row.status === 'CONFIRMED'" size="small" type="danger" @click="handleCancel(row)">
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.appointments-view {
  padding: 10px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
