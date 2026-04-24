<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Phone, OfficeBuilding } from '@element-plus/icons-vue'
import { getDoctors, getDepartments, createDoctor, updateDoctor, deleteDoctor } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { Doctor, Department } from '@/types'

const loading = ref(false)
const doctors = ref<Doctor[]>([])
const departments = ref<Department[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加医生')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const searchQuery = ref('')

const form = ref({
  id: null as number | null,
  userId: null as number | null,
  departmentId: null as number | null,
  title: '',
  specialty: '',
  bio: '',
  status: 'ACTIVE',
})

const rules = {
  userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
  departmentId: [{ required: true, message: '请选择科室', trigger: 'change' }],
  title: [{ required: true, message: '请输入职称', trigger: 'blur' }],
}

const filteredDoctors = ref<Doctor[]>([])

const applyFilter = () => {
  if (!searchQuery.value.trim()) {
    filteredDoctors.value = doctors.value
    return
  }
  const q = searchQuery.value.toLowerCase()
  filteredDoctors.value = doctors.value.filter((d) =>
    d.userName?.toLowerCase().includes(q) ||
    d.departmentName?.toLowerCase().includes(q) ||
    d.title?.toLowerCase().includes(q)
  )
}

const loadDoctors = async () => {
  loading.value = true
  try {
    const res = await getDoctors()
    doctors.value = res.data
    filteredDoctors.value = res.data
  } catch (error) {
    ElMessage.error('加载医生列表失败')
  } finally {
    loading.value = false
  }
}

const loadDepartments = async () => {
  try {
    const res = await getDepartments()
    departments.value = res.data
  } catch (error) {
    console.error('加载科室列表失败')
  }
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加医生'
  form.value = { id: null, userId: null, departmentId: null, title: '', specialty: '', bio: '', status: 'ACTIVE' }
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  isEdit.value = true
  dialogTitle.value = '编辑医生'
  form.value = {
    id: row.id,
    userId: row.userId,
    departmentId: row.departmentId,
    title: row.title,
    specialty: row.specialty,
    bio: row.bio,
    status: row.status,
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value && form.value.id) {
          await updateDoctor(form.value.id, {
            department: { id: form.value.departmentId! },
            title: form.value.title,
            specialty: form.value.specialty,
            bio: form.value.bio,
            status: form.value.status as 'ACTIVE' | 'INACTIVE',
          })
          ElMessage.success('更新成功')
        } else {
          await createDoctor({
            user: { id: form.value.userId! },
            department: { id: form.value.departmentId! },
            title: form.value.title,
            specialty: form.value.specialty,
            bio: form.value.bio,
          })
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadDoctors()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该医生吗？', '提示', { type: 'warning' })
    await deleteDoctor(row.id)
    ElMessage.success('删除成功')
    loadDoctors()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const getStatusType = (status: string) => {
  return status === 'ACTIVE' ? 'success' : 'danger'
}

const getStatusText = (status: string) => {
  return status === 'ACTIVE' ? '在职' : '离职'
}

onMounted(() => {
  loadDoctors()
  loadDepartments()
})
</script>

<template>
  <div class="doctors-view">
    <div class="page-header">
      <h2 class="page-title">医生管理</h2>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索姓名/科室/职称"
          :prefix-icon="Search"
          clearable
          style="width: 220px; margin-right: 12px"
          @input="applyFilter"
          @clear="applyFilter"
        />
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>添加医生
        </el-button>
      </div>
    </div>

    <el-table v-loading="loading" :data="filteredDoctors" style="width: 100%" stripe>
      <el-table-column label="医生信息" min-width="200">
        <template #default="{ row }">
          <div class="doctor-info">
            <el-avatar :size="36" :style="{ backgroundColor: '#409eff' }">
              {{ row.userName?.charAt(0) || '未' }}
            </el-avatar>
            <div class="doctor-details">
              <div class="doctor-name">
                {{ row.userName || '未知' }}
              </div>
              <div class="doctor-contact">
                <el-icon><Phone /></el-icon>{{ row.userPhone || '未设置' }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="科室/职称" min-width="180">
        <template #default="{ row }">
          <div class="dept-info">
            <div class="dept-name">
              <el-icon><OfficeBuilding /></el-icon>
              {{ row.departmentName || '未分配' }}
            </div>
            <div class="title-badge">
              <el-tag effect="plain" size="small">{{ row.title || '未设置' }}</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="specialty" label="专业领域" min-width="150" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" effect="dark" size="small">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template #default="{ row }">
          <el-button size="small" link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户" prop="userId">
          <el-input-number v-model="form.userId" :min="1" placeholder="输入用户ID" style="width: 100%" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="科室" prop="departmentId">
          <el-select v-model="form.departmentId" placeholder="选择科室" style="width: 100%">
            <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-input v-model="form.title" placeholder="如：主任医师" />
        </el-form-item>
        <el-form-item label="专业领域">
          <el-input v-model="form.specialty" placeholder="如：心血管疾病" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.bio" type="textarea" :rows="3" placeholder="请输入医生简介" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="在职" value="ACTIVE" />
            <el-option label="离职" value="INACTIVE" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.doctors-view {
  padding: clamp(12px, 2vw, 24px);
  width: 100%;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  margin: 0;
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  color: var(--text-primary);
  font-weight: 600;
  position: relative;
  padding-left: 12px;
}

.page-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 1.2em;
  background: linear-gradient(135deg, var(--primary-color), #669df6);
  border-radius: 2px;
}

.header-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.header-actions .el-input {
  width: clamp(180px, 20vw, 240px);
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.doctor-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.doctor-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: clamp(0.85rem, 1vw, 0.95rem);
  color: var(--text-primary);
}

.doctor-contact {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: clamp(0.7rem, 0.9vw, 0.8rem);
  color: var(--text-secondary);
}

.doctor-contact .el-icon {
  font-size: 12px;
}

.dept-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.dept-name {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: clamp(0.8rem, 1vw, 0.9rem);
  color: var(--text-regular);
}

.dept-name .el-icon {
  font-size: 14px;
  color: var(--primary-color);
}

.title-badge {
  display: flex;
}

@media (max-width: 768px) {
  .doctors-view {
    padding: clamp(10px, 1.5vw, 16px);
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-input {
    flex: 1;
    min-width: 150px;
  }

  .doctor-info {
    gap: 0.625rem;
  }

  .doctor-details {
    gap: 0.125rem;
  }
}
</style>
