<template>
  <div class="home-page page-container">
    <div class="home-header">
      <div class="header-bg">
        <div class="header-content">
          <h1 class="greeting">您好，{{ authStore.user?.name || '访客' }}</h1>
          <p class="sub-text">阳光医院为您提供便捷预约挂号服务</p>
          <div class="quick-stats" v-if="authStore.isLoggedIn">
            <div class="stat-item" @click="$router.push('/appointments')">
              <span class="stat-num">{{ pendingCount }}</span>
              <span class="stat-label">待就诊</span>
            </div>
            <div class="stat-item" @click="$router.push('/appointments/history')">
              <span class="stat-num">{{ totalCount }}</span>
              <span class="stat-label">总预约</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-content">
      <van-grid :column-num="4" :border="false" class="quick-nav">
        <van-grid-item icon="records" text="我的预约" @click="$router.push('/appointments')" />
        <van-grid-item icon="shop-o" text="科室导航" @click="$router.push('/departments')" />
        <van-grid-item icon="manager-o" text="医生查询" @click="$router.push('/doctors')" />
        <van-grid-item icon="clock-o" text="排班查询" @click="$router.push('/schedules')" />
      </van-grid>

      <div class="section-title">
        <span>热门科室</span>
        <span class="more" @click="$router.push('/departments')">查看全部</span>
      </div>

      <div class="hot-depts-scroll" v-if="departmentStore.departments.length > 0">
        <DepartmentCard
          v-for="dept in hotDepartments"
          :key="dept.id"
          :department="dept"
          @click="goToDepartment(dept)"
        />
      </div>

      <div class="section-title">
        <span>推荐医生</span>
        <span class="more" @click="$router.push('/doctors')">查看全部</span>
      </div>

      <div v-if="doctorStore.loading" class="loading-container">
        <van-loading type="spinner" size="24" />
      </div>

      <div v-else>
        <DoctorCard
          v-for="doctor in recommendedDoctors"
          :key="doctor.id"
          :doctor="doctor"
          @click="goToDoctor(doctor)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDepartmentStore } from '@/stores/department'
import { useDoctorStore } from '@/stores/doctor'
import { useAppointmentStore } from '@/stores/appointment'
import DepartmentCard from '@/components/base/DepartmentCard.vue'
import DoctorCard from '@/components/base/DoctorCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const departmentStore = useDepartmentStore()
const doctorStore = useDoctorStore()
const appointmentStore = useAppointmentStore()

const pendingCount = ref(0)
const totalCount = ref(0)

onMounted(async () => {
  await departmentStore.fetchDepartments()
  await doctorStore.fetchActiveDoctors()

  if (authStore.isLoggedIn && authStore.userId) {
    await appointmentStore.fetchPatientAppointments(authStore.userId)
    const appts = appointmentStore.appointments
    totalCount.value = appts.length
    pendingCount.value = appts.filter(a => 
      a.status === 'PENDING' || a.status === 'CONFIRMED'
    ).length
  }
})

const hotDepartments = computed(() => {
  return departmentStore.departments.filter(d => d.status === 'ACTIVE').slice(0, 4)
})

const recommendedDoctors = computed(() => {
  return doctorStore.doctors.slice(0, 5)
})

function goToDepartment(dept) {
  router.push(`/departments/${dept.id}`)
}

function goToDoctor(doctor) {
  router.push(`/doctors/${doctor.id}`)
}
</script>

<style scoped>
.home-header {
  position: relative;
}

.header-bg {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 24px 16px 60px;
  border-radius: 0 0 24px 24px;
  color: #fff;
}

.header-content {
  max-width: 960px;
  margin: 0 auto;
}

.greeting {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.sub-text {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 20px;
}

.quick-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
}

.stat-num {
  display: block;
  font-size: 24px;
  font-weight: 600;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}

.quick-nav {
  margin-top: -40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 10px 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 24px 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.more {
  font-size: 13px;
  color: #4facfe;
  font-weight: normal;
  cursor: pointer;
}
</style>
