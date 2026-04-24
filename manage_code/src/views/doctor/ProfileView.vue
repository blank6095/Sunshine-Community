<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { updateUser, getDoctorById, updateDoctor } from '@/api'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const userStore = useUserStore()
const loading = ref(false)
const saving = ref(false)
const formRef = ref<FormInstance>()

const form = ref({
  name: '',
  gender: '',
  age: 0,
  phone: '',
  email: '',
  idCard: '',
  title: '',
  specialty: '',
  bio: '',
})

const rules = ref<FormRules>({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
})

onMounted(async () => {
  loading.value = true
  try {
    if (userStore.user) {
      form.value = {
        name: userStore.user.name,
        gender: userStore.user.gender,
        age: userStore.user.age,
        phone: userStore.user.phone,
        email: userStore.user.email,
        idCard: userStore.user.idCard,
        title: '',
        specialty: '',
        bio: '',
      }

      try {
        const doctorRes = await getDoctorById(userStore.user.id)
        const doctor = doctorRes.data
        form.value.title = doctor.title || ''
        form.value.specialty = doctor.specialty || ''
        form.value.bio = doctor.bio || ''
      } catch (e) {
        console.log('未找到医生信息')
      }
    }
  } catch (error) {
    ElMessage.error('加载个人信息失败')
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid && userStore.user) {
      saving.value = true
      try {
        await updateUser(userStore.user.id, {
          name: form.value.name,
          gender: form.value.gender,
          age: form.value.age,
          phone: form.value.phone,
          email: form.value.email,
          idCard: form.value.idCard,
        })

        userStore.user = {
          ...userStore.user,
          name: form.value.name,
          gender: form.value.gender,
          age: form.value.age,
          phone: form.value.phone,
          email: form.value.email,
          idCard: form.value.idCard,
        }
        localStorage.setItem('user', JSON.stringify(userStore.user))

        ElMessage.success('保存成功')
      } catch (error) {
        ElMessage.error('保存失败')
      } finally {
        saving.value = false
      }
    }
  })
}
</script>

<template>
  <div class="profile-view" v-loading="loading">
    <h2 class="page-title">个人信息</h2>

    <el-card>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender" style="width: 100%">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="form.age" :min="1" :max="150" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.idCard" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider />

        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-form-item label="职称">
              <el-input v-model="form.title" placeholder="如：主任医师" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="专业领域">
              <el-input v-model="form.specialty" placeholder="如：心血管疾病" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="个人简介">
          <el-input v-model="form.bio" type="textarea" :rows="4" placeholder="请输入个人简介" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.profile-view {
  padding: 10px;
}

.page-title {
  margin: 0 0 24px;
  font-size: 24px;
  color: #303133;
}
</style>
