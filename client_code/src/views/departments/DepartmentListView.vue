<template>
  <div class="departments-page page-container">
    <div class="page-header">
      <span class="page-title">科室导航</span>
    </div>

    <van-search
      v-model="searchText"
      placeholder="搜索科室"
      shape="round"
      background="#f5f7fa"
    />

    <div class="page-content">
      <div v-if="departmentStore.loading" class="loading-container">
        <van-loading type="spinner" size="24" />
      </div>

      <template v-else>
        <div class="hot-departments" v-if="hotDepartments.length > 0 && !searchText">
          <div class="section-title">
            <span>热门科室</span>
          </div>
          <div class="hot-tags">
            <van-tag
              v-for="dept in hotDepartments"
              :key="dept.id"
              type="primary"
              size="large"
              round
              @click="goToDepartment(dept)"
            >
              {{ dept.name }}
            </van-tag>
          </div>
        </div>

        <div class="department-list">
          <div class="section-title">
            <span>全部科室</span>
            <span class="count">({{ filteredDepartments.length }})</span>
          </div>

          <DepartmentCard
            v-for="dept in filteredDepartments"
            :key="dept.id"
            :department="dept"
            @click="goToDepartment(dept)"
          />

          <van-empty v-if="filteredDepartments.length === 0" description="未找到相关科室" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDepartmentStore } from '@/stores/department'
import DepartmentCard from '@/components/base/DepartmentCard.vue'

const router = useRouter()
const departmentStore = useDepartmentStore()

const searchText = ref('')

onMounted(async () => {
  if (departmentStore.departments.length === 0) {
    await departmentStore.fetchDepartments()
  }
})

const filteredDepartments = computed(() => {
  if (!searchText.value) return departmentStore.departments
  const keyword = searchText.value.toLowerCase()
  return departmentStore.departments.filter(
    (d) => d.name.toLowerCase().includes(keyword) ||
           d.description?.toLowerCase().includes(keyword)
  )
})

const hotDepartments = computed(() => {
  return departmentStore.departments.filter(d => d.status === 'ACTIVE').slice(0, 6)
})

function goToDepartment(dept) {
  router.push(`/departments/${dept.id}`)
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

.hot-departments {
  margin-bottom: 20px;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hot-tags .van-tag {
  cursor: pointer;
}

.department-list .count {
  font-size: 14px;
  font-weight: normal;
  color: #999;
}
</style>
