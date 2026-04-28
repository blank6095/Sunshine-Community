<template>
  <div class="doctors-page page-container">
    <div class="page-header">
      <span class="page-title">医生列表</span>
    </div>

    <van-search
      v-model="searchText"
      placeholder="搜索医生姓名、专长"
      shape="round"
      background="#f5f7fa"
    />

    <div class="filter-bar">
      <van-dropdown-menu>
        <van-dropdown-item v-model="filterDepartment" :options="departmentOptions" title="科室" />
        <van-dropdown-item v-model="filterTitle" :options="titleOptions" title="职称" />
      </van-dropdown-menu>
    </div>

    <div class="page-content">
      <div v-if="doctorStore.loading" class="loading-container">
        <van-loading type="spinner" size="24" />
      </div>

      <template v-else>
        <DoctorCard
          v-for="doctor in filteredDoctors"
          :key="doctor.id"
          :doctor="doctor"
          @click="goToDoctor(doctor)"
        />

        <van-empty v-if="filteredDoctors.length === 0" description="未找到相关医生" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDoctorStore } from '@/stores/doctor'
import { useDepartmentStore } from '@/stores/department'
import DoctorCard from '@/components/base/DoctorCard.vue'

const router = useRouter()
const doctorStore = useDoctorStore()
const departmentStore = useDepartmentStore()

const searchText = ref('')
const filterDepartment = ref('all')
const filterTitle = ref('all')

onMounted(async () => {
  if (departmentStore.departments.length === 0) {
    await departmentStore.fetchDepartments()
  }
  await doctorStore.fetchDoctors()
})

const departmentOptions = computed(() => {
  const options = [{ text: '全部科室', value: 'all' }]
  departmentStore.departments.forEach((dept) => {
    options.push({ text: dept.name, value: dept.id.toString() })
  })
  return options
})

const titleOptions = [
  { text: '全部职称', value: 'all' },
  { text: '主任医师', value: '主任医师' },
  { text: '副主任医师', value: '副主任医师' },
  { text: '主治医师', value: '主治医师' },
  { text: '住院医师', value: '住院医师' },
]

const filteredDoctors = computed(() => {
  let result = doctorStore.doctors.filter(d => d.status === 'ACTIVE')

  if (searchText.value) {
    const keyword = searchText.value.toLowerCase()
    result = result.filter(
      (d) => d.userName.toLowerCase().includes(keyword) ||
             d.specialty?.toLowerCase().includes(keyword) ||
             d.bio?.toLowerCase().includes(keyword)
    )
  }

  if (filterDepartment.value !== 'all') {
    result = result.filter(
      (d) => d.departmentId?.toString() === filterDepartment.value
    )
  }

  if (filterTitle.value !== 'all') {
    result = result.filter(
      (d) => d.title === filterTitle.value
    )
  }

  return result
})

function goToDoctor(doctor) {
  router.push(`/doctors/${doctor.id}`)
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

.filter-bar {
  padding: 0 16px;
  background: #fff;
}
</style>
