<template>
  <div class="schedule-item">
    <div class="schedule-time">
      <div class="date">{{ schedule.date }}</div>
      <div class="time">{{ formatTime(schedule.startTime) }} - {{ formatTime(schedule.endTime) }}</div>
    </div>
    <div class="schedule-info">
      <div class="slots">
        剩余号源：<span class="available" :class="{ low: schedule.availableSlots < 5 }">
          {{ schedule.availableSlots }}/{{ schedule.maxPatients }}
        </span>
      </div>
      <div class="status-badge" :class="schedule.status.toLowerCase()">
        {{ schedule.status === 'ACTIVE' ? '可预约' : '已取消' }}
      </div>
    </div>
    <div class="schedule-action" v-if="showAction && schedule.status === 'ACTIVE' && schedule.availableSlots > 0">
      <van-button type="primary" size="small" round @click="$emit('book', schedule)">
        预约
      </van-button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  schedule: {
    type: Object,
    required: true,
  },
  showAction: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['book'])

function formatTime(time) {
  if (!time) return ''
  return time.substring(0, 5)
}
</script>

<style scoped>
.schedule-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.schedule-time {
  flex-shrink: 0;
  text-align: center;
  padding-right: 14px;
  border-right: 1px solid #eee;
}

.date {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.time {
  font-size: 12px;
  color: #666;
}

.schedule-info {
  flex: 1;
  margin-left: 14px;
}

.slots {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.available {
  color: #07c160;
  font-weight: 500;
}

.available.low {
  color: #ee0a24;
}

.status-badge {
  display: inline-block;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-badge.active {
  background: #e8f8ef;
  color: #07c160;
}

.status-badge.cancelled {
  background: #f5f5f5;
  color: #999;
}

.schedule-action {
  flex-shrink: 0;
  margin-left: 14px;
}
</style>
