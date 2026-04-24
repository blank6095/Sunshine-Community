import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDepartments, getDepartmentById } from '@/api/department'

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref([])
  const currentDepartment = ref(null)
  const loading = ref(false)

  async function fetchDepartments() {
    loading.value = true
    try {
      const res = await getDepartments()
      departments.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchDepartmentById(id) {
    loading.value = true
    try {
      const res = await getDepartmentById(id)
      currentDepartment.value = res.data
    } finally {
      loading.value = false
    }
  }

  function getDepartmentName(id) {
    const dept = departments.value.find((d) => d.id === id)
    return dept ? dept.name : ''
  }

  return {
    departments,
    currentDepartment,
    loading,
    fetchDepartments,
    fetchDepartmentById,
    getDepartmentName,
  }
})
