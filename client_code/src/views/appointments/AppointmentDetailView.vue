<template>
  <div class="appointment-detail-page page-container">
    <div class="page-header">
      <van-icon name="arrow-left" size="20" @click="$router.back()" style="position: absolute; left: 16px; cursor: pointer;" />
      <span class="page-title">预约详情</span>
    </div>

    <div v-if="loading" class="loading-container">
      <van-loading type="spinner" size="24" />
    </div>

    <template v-else-if="appointment">
      <div class="status-card">
        <van-icon :name="statusIcon" size="48" :color="statusColor" />
        <div class="status-text" :style="{ color: statusColor }">
          {{ statusText }}
        </div>
      </div>

      <div class="page-content">
        <van-cell-group inset>
          <van-cell title="预约编号" :value="appointment.id.toString()" />
          <van-cell title="医生姓名" :value="appointment.doctorName" />
          <van-cell title="科室" :value="appointment.departmentName" />
          <van-cell title="预约时间" :value="formatTime(appointment.appointmentTime)" />
          <van-cell title="症状描述" :value="appointment.symptoms || '无'" />
          <van-cell title="创建时间" :value="formatTime(appointment.createdAt)" />
        </van-cell-group>

        <div class="action-buttons">
          <van-button
            v-if="appointment.status === 'PENDING' || appointment.status === 'CONFIRMED'"
            round
            block
            type="danger"
            @click="onCancel"
          >
            取消预约
          </van-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showConfirmDialog, Toast } from 'vant'
import { getAppointmentById } from '@/api/appointment'
import { updateAppointment } from '@/api/appointment'

const route = useRoute()
const router = useRouter()

const appointment = ref(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await getAppointmentById(route.params.id)
    appointment.value = res.data
  } finally {
    loading.value = false
  }
})

const statusTextMap = {
  PENDING: '待确认',
  CONFIRMED: '已确认',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
}

const statusColorMap = {
  PENDING: '#fa8c16',
  CONFIRMED: '#1890ff',
  COMPLETED: '#07c160',
  CANCELLED: '#999',
}

const statusIconMap = {
  PENDING: 'clock-o',
  CONFIRMED: 'passed',
  COMPLETED: 'checked',
  CANCELLED: 'clear',
}

const statusText = computed(() => statusTextMap[appointment.value?.status] || '')
const statusColor = computed(() => statusColorMap[appointment.value?.status] || '#999')
const statusIcon = computed(() => statusIconMap[appointment.value?.status] || 'info-o')

function formatTime(time) {
  if (!time) return ''
  return time.replace('T', ' ').substring(0, 16)
}

function onCancel() {
  showConfirmDialog({
    title: '取消预约',
    message: '确定要取消该预约吗？',
  }).then(async () => {
    await updateAppointment(appointment.value.id, { status: 'CANCELLED' })
    Toast.success('已取消预约')
    appointment.value.status = 'CANCELLED'
  }).catch(() => {})
}
</script>

<style scoped>
.page-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
}

.status-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background: #fff;
}

.status-text {
  margin-top: 12px;
  font-size: 20px;
  font-weight: 600;
}

.action-buttons {
  margin-top: 24px;
  padding: 0 16px;
}
</style>
