<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Plus, RefreshLeft } from '@element-plus/icons-vue'
import { getUsers, createUser, updateUser, deleteUser, getDepartments } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { User } from '@/types'
import PaginationBar from '@/components/PaginationBar.vue'

const loading = ref(false)
const users = ref<User[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加用户')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const showPassword = ref(false)

const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

const form = ref({
  id: null as number | null,
  username: '',
  password: '',
  name: '',
  gender: '男',
  age: 25,
  phone: '',
  email: '',
  idCard: '',
  role: 'PATIENT',
  status: 'ACTIVE',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
}

const filteredUsers = computed(() => {
  let result = users.value

  if (roleFilter.value) {
    result = result.filter((u) => u.role === roleFilter.value)
  }

  if (statusFilter.value) {
    result = result.filter((u) => u.status === statusFilter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
    )
  }

  return result
})

const loadUsers = async () => {
  loading.value = true
  try {
    const res = await getUsers()
    users.value = res.data
  } catch (error) {
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加用户'
  form.value = {
    id: null,
    username: '',
    password: '',
    name: '',
    gender: '男',
    age: 25,
    phone: '',
    email: '',
    idCard: '',
    role: 'PATIENT',
    status: 'ACTIVE',
  }
  dialogVisible.value = true
}

const handleEdit = (row: User) => {
  isEdit.value = true
  dialogTitle.value = '编辑用户'
  form.value = {
    id: row.id,
    username: row.username,
    password: '',
    name: row.name,
    gender: row.gender,
    age: row.age,
    phone: row.phone,
    email: row.email,
    idCard: row.idCard,
    role: row.role,
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
          await updateUser(form.value.id, {
            name: form.value.name,
            gender: form.value.gender,
            age: form.value.age,
            phone: form.value.phone,
            email: form.value.email,
            idCard: form.value.idCard,
            status: form.value.status as 'ACTIVE' | 'INACTIVE',
          })
          ElMessage.success('更新成功')
        } else {
          await createUser({
            username: form.value.username,
            password: form.value.password,
            name: form.value.name,
            gender: form.value.gender,
            age: form.value.age,
            phone: form.value.phone,
            email: form.value.email,
            idCard: form.value.idCard,
            role: form.value.role as 'ADMIN' | 'DOCTOR' | 'PATIENT',
          })
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadUsers()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', { type: 'warning' })
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    loadUsers()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleReset = () => {
  searchQuery.value = ''
  roleFilter.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}

const currentPage = ref(1)
const pageSize = ref(10)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

const handlePageChange = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const getRoleType = (role: string) => {
  const types: Record<string, string> = {
    ADMIN: 'danger',
    DOCTOR: 'primary',
    PATIENT: 'success',
  }
  return types[role] || 'info'
}

const getRoleText = (role: string) => {
  const texts: Record<string, string> = {
    ADMIN: '管理员',
    DOCTOR: '医生',
    PATIENT: '患者',
  }
  return texts[role] || role
}

const getStatusType = (status: string) => {
  return status === 'ACTIVE' ? 'success' : 'danger'
}

const getStatusText = (status: string) => {
  return status === 'ACTIVE' ? '正常' : '停用'
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="users-view">
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
      <div class="header-actions">
        <el-button @click="handleReset" :icon="RefreshLeft">重置筛选</el-button>
        <el-button type="primary" @click="handleAdd" :icon="Plus">添加用户</el-button>
      </div>
    </div>

    <el-card class="filter-card" shadow="never">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="8" :md="6">
          <el-input
            v-model="searchQuery"
            placeholder="搜索用户名/姓名/手机号"
            :prefix-icon="Search"
            clearable
          />
        </el-col>
        <el-col :xs="24" :sm="8" :md="5">
          <el-select v-model="roleFilter" placeholder="选择角色" clearable style="width: 100%">
            <el-option label="全部角色" value="" />
            <el-option label="管理员" value="ADMIN" />
            <el-option label="医生" value="DOCTOR" />
            <el-option label="患者" value="PATIENT" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="8" :md="5">
          <el-select v-model="statusFilter" placeholder="选择状态" clearable style="width: 100%">
            <el-option label="全部状态" value="" />
            <el-option label="正常" value="ACTIVE" />
            <el-option label="停用" value="INACTIVE" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="8" :md="4">
          <el-tag size="large" type="info">
            总计：{{ filteredUsers.length }} 条
          </el-tag>
        </el-col>
      </el-row>
    </el-card>

    <el-table v-loading="loading" :data="paginatedUsers" style="width: 100%; margin-top: 16px" stripe>
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="gender" label="性别" width="60" align="center" />
      <el-table-column prop="age" label="年龄" width="60" align="center" />
      <el-table-column prop="phone" label="手机号" width="120" />
      <el-table-column prop="email" label="邮箱" min-width="150" show-overflow-tooltip />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="getRoleType(row.role)">{{ getRoleText(row.role) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <PaginationBar
      v-if="filteredUsers.length > 0"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="filteredUsers.length"
      @change="handlePageChange"
    />

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="isEdit" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="form.gender" style="width: 100%">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="form.age" :min="1" :max="150" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" style="width: 100%" :disabled="isEdit">
            <el-option label="管理员" value="ADMIN" />
            <el-option label="医生" value="DOCTOR" />
            <el-option label="患者" value="PATIENT" />
          </el-select>
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
  </div>
</template>

<style scoped>
.users-view {
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
  .users-view {
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
