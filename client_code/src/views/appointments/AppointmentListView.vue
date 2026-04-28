<template>
  <div class="appointments-page page-container">
    <div class="page-header">
      <span class="page-title">我的预约</span>
    </div>

    <div class="tabs-container">
      <van-tabs v-model:active="activeTab" sticky>
        <van-tab title="全部" name="all" />
        <van-tab title="待确认" name="PENDING" />
        <van-tab title="已确认" name="CONFIRMED" />
        <van-tab title="已完成" name="COMPLETED" />
        <van-tab title="已取消" name="CANCELLED" />
      </van-tabs>
    </div>

    <div class="page-content">
      <div v-if="appointmentStore.loading" class="loading-container">
        <van-loading type="spinner" size="24" />
      </div>

      <template v-else>
        <AppointmentCard
          v-for="appt in filteredAppointments"
          :key="appt.id"
          :appointment="appt"
          @cancel="onCancelAppointment"
        />

        <van-empty v-if="filteredAppointments.length === 0" description="暂无预约记录">
          <van-button round type="primary" @click="$router.push('/departments')">
            去预约挂号
          </van-button>
        </van-empty>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppointmentStore } from '@/stores/appointment'
import { showConfirmDialog, Toast } from 'vant'
import AppointmentCard from '@/components/base/AppointmentCard.vue'

const authStore = useAuthStore()
const appointmentStore = useAppointmentStore()

const activeTab = ref('all')

onMounted(async () => {
  await fetchAppointments()
})

watch(activeTab, async () => {
  await fetchAppointments()
})

async function fetchAppointments() {
  const patientId = authStore.userId
  if (!patientId) return

  if (activeTab.value === 'all') {
    await appointmentStore.fetchPatientAppointments(patientId)
  } else {
    await appointmentStore.fetchPatientAppointmentsByStatus(patientId, activeTab.value)
  }
}

const filteredAppointments = computed(() => {
  return appointmentStore.appointments
})

function onCancelAppointment(appt) {
  showConfirmDialog({
    title: '取消预约',
    message: '确定要取消该预约吗？',
  }).then(async () => {
    await appointmentStore.cancelAppointment(appt.id)
    Toast.success('已取消预约')
    await fetchAppointments()
  }).catch(() => {})
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

.tabs-container {
  background: #fff;
}
</style>
