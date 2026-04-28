<template>
  <div class="schedules-page page-container">
    <div class="page-header">
      <span class="page-title">排班查询</span>
    </div>

    <div class="filter-container">
      <van-cell-group inset>
        <van-field
          v-model="selectedDate"
          label="选择日期"
          placeholder="请选择日期"
          is-link
          readonly
          @click="showDatePicker = true"
        />
      </van-cell-group>
    </div>

    <div class="page-content">
      <div v-if="loading" class="loading-container">
        <van-loading type="spinner" size="24" />
      </div>

      <template v-else>
        <ScheduleCard
          v-for="schedule in schedules"
          :key="schedule.id"
          :schedule="schedule"
          @book="onBookSchedule"
        />

        <van-empty v-if="schedules.length === 0" description="暂无排班信息" />
      </template>
    </div>

    <van-popup v-model:show="showDatePicker" round position="bottom">
      <van-calendar @confirm="onDateConfirm" :show-confirm="false" />
    </van-popup>

    <van-popup v-model:show="showBookDialog" round position="bottom">
      <div class="book-dialog">
        <h3 class="dialog-title">确认预约</h3>
        <div class="book-info">
          <p>医生：{{ selectedSchedule?.doctorName }}</p>
          <p>科室：{{ selectedSchedule?.departmentName }}</p>
          <p>时间：{{ selectedSchedule?.date }} {{ formatTime(selectedSchedule?.startTime) }}-{{ formatTime(selectedSchedule?.endTime) }}</p>
        </div>
        <van-field
          v-model="symptoms"
          label="症状描述"
          placeholder="请描述您的症状（选填）"
          rows="2"
          autosize
          type="textarea"
        />
        <div class="dialog-actions">
          <van-button block round type="primary" @click="confirmBooking" :loading="booking">
            确认预约
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { getSchedulesByDate } from '@/api/schedule'
import { useAuthStore } from '@/stores/auth'
import { useAppointmentStore } from '@/stores/appointment'
import ScheduleCard from '@/components/base/ScheduleCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const appointmentStore = useAppointmentStore()

const selectedDate = ref('')
const showDatePicker = ref(false)
const schedules = ref([])
const loading = ref(false)
const showBookDialog = ref(false)
const selectedSchedule = ref(null)
const symptoms = ref('')
const booking = ref(false)

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

onMounted(async () => {
  selectedDate.value = formatDate(new Date())
  await fetchSchedules()
})

async function fetchSchedules() {
  if (!selectedDate.value) return
  loading.value = true
  try {
    const res = await getSchedulesByDate(selectedDate.value)
    schedules.value = res.data
  } finally {
    loading.value = false
  }
}

function onDateConfirm(value) {
  selectedDate.value = formatDate(value)
  showDatePicker.value = false
  fetchSchedules()
}

function formatTime(time) {
  if (!time) return ''
  return time.substring(0, 5)
}

function onBookSchedule(schedule) {
  if (!authStore.isLoggedIn) {
    Toast.fail('请先登录')
    router.push('/login')
    return
  }
  selectedSchedule.value = schedule
  symptoms.value = ''
  showBookDialog.value = true
}

async function confirmBooking() {
  booking.value = true
  try {
    const appointmentTime = `${selectedSchedule.value.date}T${selectedSchedule.value.startTime}`
    const data = {
      patient: { id: authStore.userId },
      doctor: { id: selectedSchedule.value.doctorId },
      schedule: { id: selectedSchedule.value.id },
      appointmentTime: appointmentTime,
      symptoms: symptoms.value,
    }
    await appointmentStore.createNewAppointment(data)
    Toast.success('预约成功')
    showBookDialog.value = false
    router.push('/appointments')
  } catch (err) {
  } finally {
    booking.value = false
  }
}
</script>

<style scoped>
.page-header {
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

.filter-container {
  padding: 12px 16px;
}

.book-dialog {
  padding: 20px;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
}

.book-info {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 16px;
}

.book-info p {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.book-info p:last-child {
  margin-bottom: 0;
}

.dialog-actions {
  margin-top: 16px;
}
</style>
