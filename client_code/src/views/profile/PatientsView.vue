<template>
  <div class="patients-page page-container">
    <div class="page-header">
      <van-icon name="arrow-left" size="20" @click="$router.back()" style="position: absolute; left: 16px; cursor: pointer;" />
      <span class="page-title">就诊人管理</span>
    </div>

    <div class="page-content">
      <van-empty v-if="patients.length === 0" description="暂无就诊人">
        <van-button round type="primary" @click="showAddDialog = true">添加就诊人</van-button>
      </van-empty>

      <van-cell-group v-else inset>
        <van-cell v-for="patient in patients" :key="patient.id" :title="patient.name" :label="`${patient.gender} | ${patient.age}岁 | ${patient.phone}`" is-link>
          <template #extra>
            <van-icon name="edit" color="#4facfe" @click.stop="editPatient(patient)" />
          </template>
        </van-cell>
      </van-cell-group>

      <van-button round block type="primary" style="margin-top: 20px;" v-if="patients.length > 0" @click="showAddDialog = true">
        添加就诊人
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const patients = ref([
  { id: 1, name: '本人', gender: '男', age: 30, phone: '13800138000' },
])

const showAddDialog = ref(false)

function editPatient(patient) {
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
