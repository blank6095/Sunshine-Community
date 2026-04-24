import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getDoctors,
  getDoctorById,
  getDoctorsByDepartment,
  getDoctorsByStatus,
} from '@/api/doctor'

export const useDoctorStore = defineStore('doctor', () => {
  const doctors = ref([])
  const currentDoctor = ref(null)
  const loading = ref(false)

  async function fetchDoctors() {
    loading.value = true
    try {
      const res = await getDoctors()
      doctors.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchDoctorById(id) {
    loading.value = true
    try {
      const res = await getDoctorById(id)
      currentDoctor.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchDoctorsByDepartment(departmentId) {
    loading.value = true
    try {
      const res = await getDoctorsByDepartment(departmentId)
      doctors.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchActiveDoctors() {
    loading.value = true
    try {
      const res = await getDoctorsByStatus('ACTIVE')
      doctors.value = res.data
    } finally {
      loading.value = false
    }
  }

  function getDoctorName(id) {
    const doctor = doctors.value.find((d) => d.id === id)
    return doctor ? doctor.userName : ''
  }

  return {
    doctors,
    currentDoctor,
    loading,
    fetchDoctors,
    fetchDoctorById,
    fetchDoctorsByDepartment,
    fetchActiveDoctors,
    getDoctorName,
  }
})
