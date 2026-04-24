<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDepartments, createDepartment, updateDepartment, deleteDepartment, getDoctorsByDepartment } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { Department, Doctor } from '@/types'

const loading = ref(false)
const departments = ref<Department[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加科室')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const showDoctorsDialog = ref(false)
const deptDoctors = ref<Doctor[]>([])
const currentDept = ref<any>(null)

const form = ref({
  id: null as number | null,
  name: '',
  description: '',
  status: 'ACTIVE',
})

const rules = {
  name: [{ required: true, message: '请输入科室名称', trigger: 'blur' }],
}

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
      <h2>科室管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>添加科室
      </el-button>
    </div>

    <el-table v-loading="loading" :data="departments" style="width: 100%">
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
        <!-- <el-table-column prop="user.gender" label="性别" width="80" /> -->
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
  padding: 10px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
