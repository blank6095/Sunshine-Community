import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getAppointmentsByPatient,
  createAppointment,
  updateAppointment,
  getAppointmentsByPatientAndStatus,
} from '@/api/appointment'

export const useAppointmentStore = defineStore('appointment', () => {
  const appointments = ref([])
  const currentAppointment = ref(null)
  const loading = ref(false)

  async function fetchPatientAppointments(patientId) {
    loading.value = true
    try {
      const res = await getAppointmentsByPatient(patientId)
      appointments.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchPatientAppointmentsByStatus(patientId, status) {
    loading.value = true
    try {
      const res = await getAppointmentsByPatientAndStatus(patientId, status)
      appointments.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function createNewAppointment(data) {
    loading.value = true
    try {
      const res = await createAppointment(data)
      currentAppointment.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function cancelAppointment(id) {
    loading.value = true
    try {
      const res = await updateAppointment(id, { status: 'CANCELLED' })
      return res.data
    } finally {
      loading.value = false
    }
  }

  function getAppointmentStatusText(status) {
    const statusMap = {
      PENDING: '待确认',
      CONFIRMED: '已确认',
      COMPLETED: '已完成',
      CANCELLED: '已取消',
    }
    return statusMap[status] || status
  }

  return {
    appointments,
    currentAppointment,
    loading,
    fetchPatientAppointments,
    fetchPatientAppointmentsByStatus,
    createNewAppointment,
    cancelAppointment,
    getAppointmentStatusText,
  }
})
