<template>
  <div class="history-page page-container">
    <div class="page-header">
      <van-icon name="arrow-left" size="20" @click="$router.back()" style="position: absolute; left: 16px; cursor: pointer;" />
      <span class="page-title">预约记录</span>
    </div>

    <div class="page-content">
      <div v-if="appointmentStore.loading" class="loading-container">
        <van-loading type="spinner" size="24" />
      </div>

      <template v-else>
        <AppointmentCard
          v-for="appt in appointmentStore.appointments"
          :key="appt.id"
          :appointment="appt"
          :show-actions="false"
          @click="viewDetail(appt)"
        />

        <van-empty v-if="appointmentStore.appointments.length === 0" description="暂无历史记录" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppointmentStore } from '@/stores/appointment'
import AppointmentCard from '@/components/base/AppointmentCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const appointmentStore = useAppointmentStore()

onMounted(async () => {
  const patientId = authStore.userId
  if (patientId) {
    await appointmentStore.fetchPatientAppointments(patientId)
  }
})

function viewDetail(appt) {
  router.push(`/appointments/${appt.id}`)
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
</style>
