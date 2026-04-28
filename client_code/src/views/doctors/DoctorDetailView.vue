<template>
  <div class="doctor-detail-page page-container">
    <div class="page-header">
      <van-icon name="arrow-left" size="20" @click="$router.back()" style="position: absolute; left: 16px; cursor: pointer;" />
      <span class="page-title">医生详情</span>
    </div>

    <div v-if="doctorStore.loading" class="loading-container">
      <van-loading type="spinner" size="24" />
    </div>

    <template v-else-if="doctor">
      <div class="doctor-header-card">
        <div class="doctor-avatar-lg">
          <van-icon name="manager" size="48" color="#fff" />
        </div>
        <div class="doctor-main-info">
          <h2 class="doctor-name">{{ doctor.userName }}</h2>
          <div class="doctor-title-badge" v-if="doctor.title">{{ doctor.title }}</div>
          <div class="doctor-dept">
            <van-icon name="label-o" size="14" />
            {{ doctor.departmentName }}
          </div>
        </div>
      </div>

      <div class="page-content">
        <van-cell-group inset class="info-group">
          <van-cell title="专长" :value="doctor.specialty || '暂无'" />
        </van-cell-group>

        <van-cell-group inset class="info-group">
          <van-cell title="简介" />
          <div class="bio-content">{{ doctor.bio || '暂无简介' }}</div>
        </van-cell-group>

        <div class="section-title">
          <span>出诊排班</span>
        </div>

        <div v-if="scheduleLoading" class="loading-container">
          <van-loading type="spinner" size="24" />
        </div>

        <template v-else>
          <ScheduleCard
            v-for="schedule in schedules"
            :key="schedule.id"
            :schedule="schedule"
            @book="onBookSchedule"
          />

          <van-empty v-if="schedules.length === 0" description="暂无出诊排班" />
        </template>
      </div>
    </template>

    <van-popup v-model:show="showBookDialog" round position="bottom">
      <div class="book-dialog">
        <h3 class="dialog-title">确认预约</h3>
        <div class="book-info">
          <p>医生：{{ doctor?.userName }}</p>
          <p>科室：{{ doctor?.departmentName }}</p>
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
import { useRoute, useRouter } from 'vue-router'
import { Toast } from 'vant'
import { useDoctorStore } from '@/stores/doctor'
import { useAppointmentStore } from '@/stores/appointment'
import { useAuthStore } from '@/stores/auth'
import { getSchedulesByDoctor } from '@/api/schedule'
import ScheduleCard from '@/components/base/ScheduleCard.vue'

const route = useRoute()
const router = useRouter()
const doctorStore = useDoctorStore()
const appointmentStore = useAppointmentStore()
const authStore = useAuthStore()

const doctor = ref(null)
const schedules = ref([])
const scheduleLoading = ref(false)
const showBookDialog = ref(false)
const selectedSchedule = ref(null)
const symptoms = ref('')
const booking = ref(false)

onMounted(async () => {
  const id = route.params.id
  await doctorStore.fetchDoctorById(id)
  doctor.value = doctorStore.currentDoctor

  await fetchSchedules()
})

async function fetchSchedules() {
  scheduleLoading.value = true
  try {
    const res = await getSchedulesByDoctor(doctor.value.id)
    schedules.value = res.data
  } finally {
    scheduleLoading.value = false
  }
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
      doctor: { id: doctor.value.id },
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

.doctor-header-card {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 24px;
  display: flex;
  align-items: center;
  color: #fff;
}

.doctor-avatar-lg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doctor-main-info {
  margin-left: 16px;
}

.doctor-name {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
}

.doctor-title-badge {
  display: inline-block;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 10px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.doctor-dept {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  opacity: 0.9;
}

.info-group {
  margin-bottom: 16px;
}

.bio-content {
  padding: 12px 16px;
  font-size: 14px;
  color: #666;
  line-height: 1.8;
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
