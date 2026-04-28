<template>
  <div class="department-detail-page page-container">
    <div class="page-header">
      <van-icon name="arrow-left" size="20" @click="$router.back()" style="position: absolute; left: 16px; cursor: pointer;" />
      <span class="page-title">科室详情</span>
    </div>

    <div v-if="departmentStore.loading" class="loading-container">
      <van-loading type="spinner" size="24" />
    </div>

    <template v-else-if="department">
      <div class="dept-info-card">
        <h2 class="dept-name">{{ department.name }}</h2>
        <p class="dept-desc">{{ department.description || '暂无描述' }}</p>
        <div class="dept-status">
          <van-tag :type="department.status === 'ACTIVE' ? 'success' : 'default'">
            {{ department.status === 'ACTIVE' ? '正常开诊' : '暂停服务' }}
          </van-tag>
        </div>
      </div>

      <div class="page-content">
        <div class="section-title">
          <span>科室医生</span>
          <span class="count">({{ doctors.length }})</span>
        </div>

        <DoctorCard
          v-for="doctor in doctors"
          :key="doctor.id"
          :doctor="doctor"
          @click="goToDoctor(doctor)"
        />

        <van-empty v-if="doctors.length === 0" description="该科室暂无医生" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDepartmentStore } from '@/stores/department'
import { useDoctorStore } from '@/stores/doctor'
import DoctorCard from '@/components/base/DoctorCard.vue'

const route = useRoute()
const router = useRouter()
const departmentStore = useDepartmentStore()
const doctorStore = useDoctorStore()

const department = ref(null)
const doctors = ref([])

onMounted(async () => {
  const id = route.params.id
  await departmentStore.fetchDepartmentById(id)
  department.value = departmentStore.currentDepartment
  
  await doctorStore.fetchDoctorsByDepartment(id)
  doctors.value = doctorStore.doctors
})

function goToDoctor(doctor) {
  router.push(`/doctors/${doctor.id}`)
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

.dept-info-card {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 24px;
  color: #fff;
}

.dept-name {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
}

.dept-desc {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 12px;
  line-height: 1.6;
}

.count {
  font-size: 14px;
  font-weight: normal;
  color: #999;
}
</style>
