<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Plus, RefreshLeft } from '@element-plus/icons-vue'
import { getDepartments, createDepartment, updateDepartment, deleteDepartment, getDoctorsByDepartment } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { Department, Doctor } from '@/types'
import PaginationBar from '@/components/PaginationBar.vue'

const loading = ref(false)
const departments = ref<Department[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加科室')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const showDoctorsDialog = ref(false)
const deptDoctors = ref<Doctor[]>([])
const currentDept = ref<any>(null)

const searchQuery = ref('')
const selectedStatus = ref('')

const form = ref({
  id: null as number | null,
  name: '',
  description: '',
  status: 'ACTIVE',
})

const rules = {
  name: [{ required: true, message: '请输入科室名称', trigger: 'blur' }],
}

const filteredDepartments = computed(() => {
  let result = departments.value

  if (selectedStatus.value) {
    result = result.filter((d) => d.status === selectedStatus.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (d) => d.name?.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q)
    )
  }

  return result
})

const loadDepartments = async () => {
  loading.value = true
  try {
    const res = await getDepartments()
    departments.value = res.data
  } catch (error) {
    ElMessage.error('加载科室列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加科室'
  form.value = { id: null, name: '', description: '', status: 'ACTIVE' }
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  isEdit.value = true
  dialogTitle.value = '编辑科室'
  form.value = {
    id: row.id,
    name: row.name,
    description: row.description,
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
          await updateDepartment(form.value.id, {
            name: form.value.name,
            description: form.value.description,
            status: form.value.status as 'ACTIVE' | 'INACTIVE',
          })
          ElMessage.success('更新成功')
        } else {
          await createDepartment({
            name: form.value.name,
            description: form.value.description,
          })
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadDepartments()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该科室吗？', '提示', { type: 'warning' })
    await deleteDepartment(row.id)
    ElMessage.success('删除成功')
    loadDepartments()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleViewDoctors = async (row: any) => {
  currentDept.value = row
  showDoctorsDialog.value = true
  try {
    const res = await getDoctorsByDepartment(row.id)
    deptDoctors.value = res.data
  } catch (error) {
    ElMessage.error('加载医生列表失败')
  }
}

const handleReset = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
}

const currentPage = ref(1)
const pageSize = ref(10)

const paginatedDepartments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredDepartments.value.slice(start, end)
})

const handlePageChange = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const getStatusType = (status: string) => {
  return status === 'ACTIVE' ? 'success' : 'danger'
}

const getStatusText = (status: string) => {
  return status === 'ACTIVE' ? '正常' : '停用'
}

onMounted(() => {
  loadDepartments()
})
</script>

<template>
  <div class="departments-view">
    <div class="page-header">
      <h2 class="page-title">科室管理</h2>
      <div class="header-actions">
        <el-button @click="handleReset" :icon="RefreshLeft">重置筛选</el-button>
        <el-button type="primary" @click="handleAdd" :icon="Plus">添加科室</el-button>
      </div>
    </div>

    <el-card class="filter-card" shadow="never">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="8" :md="6">
          <el-input
            v-model="searchQuery"
            placeholder="搜索科室名称/描述"
            :prefix-icon="Search"
            clearable
          />
        </el-col>
        <el-col :xs="24" :sm="8" :md="5">
          <el-select v-model="selectedStatus" placeholder="选择状态" clearable style="width: 100%">
            <el-option label="全部状态" value="" />
            <el-option label="正常" value="ACTIVE" />
            <el-option label="停用" value="INACTIVE" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="8" :md="4">
          <el-tag size="large" type="info">
            总计：{{ filteredDepartments.length }} 条
          </el-tag>
        </el-col>
      </el-row>
    </el-card>

    <el-table v-loading="loading" :data="paginatedDepartments" style="width: 100%; margin-top: 16px" stripe>
      <el-table-column prop="name" label="科室名称" width="150" />
      <el-table-column prop="description" label="科室描述" min-width="200" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="250">
        <template #default="{ row }">
          <el-button size="small" @click="handleViewDoctors(row)">查看医生</el-button>
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <PaginationBar
      v-if="filteredDepartments.length > 0"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="filteredDepartments.length"
      @change="handlePageChange"
    />

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="科室名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入科室名称" />
        </el-form-item>
        <el-form-item label="科室描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入科室描述" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="正常" value="ACTIVE" />
            <el-option label="停用" value="INACTIVE" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showDoctorsDialog" :title="` 医生列表`" width="800px">
      <el-table :data="deptDoctors" style="width: 100%">
        <el-table-column prop="userName" label="姓名" width="80" />
        <el-table-column prop="title" label="职称" width="80" />
        <el-table-column prop="specialty" label="专长" min-width="120" />
        <el-table-column prop="userPhone" label="联系电话" width="120" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">
              {{ row.status === 'ACTIVE' ? '在职' : '离职' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<style scoped>
.departments-view {
  padding: clamp(12px, 2vw, 24px);
  width: 100%;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.75rem;
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

.filter-card {
  border-radius: 8px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
}

.filter-card :deep(.el-card__body) {
  padding: clamp(0.75rem, 2vw, 1rem);
}

@media (max-width: 768px) {
  .departments-view {
    padding: clamp(10px, 1.5vw, 16px);
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
  }
}
</style>
