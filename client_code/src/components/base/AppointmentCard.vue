<template>
  <div class="appointment-card">
    <div class="appt-header">
      <span class="appt-id">预约号：{{ appointment.id }}</span>
      <span class="status-badge" :class="appointment.status.toLowerCase()">
        {{ statusText }}
      </span>
    </div>
    <div class="appt-content">
      <div class="appt-row">
        <van-icon name="manager-o" size="14" />
        医生：{{ appointment.doctorName }}
      </div>
      <div class="appt-row">
        <van-icon name="label-o" size="14" />
        科室：{{ appointment.departmentName }}
      </div>
      <div class="appt-row">
        <van-icon name="clock-o" size="14" />
        时间：{{ formatTime(appointment.appointmentTime) }}
      </div>
      <div class="appt-row" v-if="appointment.symptoms">
        <van-icon name="records" size="14" />
        症状：{{ appointment.symptoms }}
      </div>
    </div>
    <div class="appt-actions" v-if="showActions">
      <van-button v-if="appointment.status === 'PENDING' || appointment.status === 'CONFIRMED'" 
        size="small" plain type="danger" @click="$emit('cancel', appointment)">
        取消预约
      </van-button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
  showActions: {
    type: Boolean,
    default: true,
  },
})

const statusTextMap = {
  PENDING: '待确认',
  CONFIRMED: '已确认',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
}

const statusText = statusTextMap[props.appointment.status] || props.appointment.status

function formatTime(time) {
  if (!time) return ''
  return time.replace('T', ' ').substring(0, 16)
}

defineEmits(['cancel'])
</script>

<style scoped>
.appointment-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.appt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.appt-id {
  font-size: 13px;
  color: #999;
}

.status-badge {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 4px;
}

.status-badge.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status-badge.confirmed {
  background: #e6f7ff;
  color: #1890ff;
}

.status-badge.completed {
  background: #e8f8ef;
  color: #07c160;
}

.status-badge.cancelled {
  background: #f5f5f5;
  color: #999;
}

.appt-content {
  margin-bottom: 12px;
}

.appt-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.appt-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}
</style>
