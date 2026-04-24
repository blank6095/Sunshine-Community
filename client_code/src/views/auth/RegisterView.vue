<template>
  <div class="register-page page-container">
    <div class="page-header">
      <van-icon name="arrow-left" size="20" @click="$router.back()" style="position: absolute; left: 16px; cursor: pointer;" />
      <span class="page-title">用户注册</span>
    </div>

    <div class="page-content">
      <van-form @submit="handleRegister">
        <van-cell-group inset>
          <van-field
            v-model="form.username"
            name="username"
            label="用户名"
            placeholder="3-20位字符"
            :rules="[{ required: true, message: '请输入用户名' }, { pattern: /^.{3,20}$/, message: '用户名长度为3-20位' }]"
          />
          <van-field
            v-model="form.password"
            type="password"
            name="password"
            label="密码"
            placeholder="至少6位字符"
            :rules="[{ required: true, message: '请输入密码' }, { pattern: /^.{6,}$/, message: '密码至少6位' }]"
          />
          <van-field
            v-model="form.name"
            name="name"
            label="姓名"
            placeholder="请输入真实姓名"
            :rules="[{ required: true, message: '请输入姓名' }]"
          />
          <van-field
            v-model="form.gender"
            name="gender"
            label="性别"
            placeholder="请选择性别"
            is-link
            @click="showGenderPicker = true"
            :rules="[{ required: true, message: '请选择性别' }]"
          />
          <van-field
            v-model="form.ageDisplay"
            name="age"
            label="年龄"
            placeholder="请选择年龄"
            is-link
            @click="showAgePicker = true"
            :rules="[{ required: true, message: '请选择年龄' }]"
          />
          <van-field
            v-model="form.phone"
            name="phone"
            label="手机号"
            placeholder="请输入11位手机号"
            :rules="[{ required: true, message: '请输入手机号' }, { pattern: /^1\d{10}$/, message: '请输入正确的手机号' }]"
          />
          <van-field
            v-model="form.email"
            name="email"
            label="邮箱"
            placeholder="选填"
            :rules="[{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入正确的邮箱' }]"
          />
          <van-field
            v-model="form.idCard"
            name="idCard"
            label="身份证"
            placeholder="选填，18位身份证号"
            :rules="[{ pattern: /^\d{17}[\dXx]$/, message: '请输入正确的身份证号' }]"
          />
        </van-cell-group>

        <div class="form-actions">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            注册
          </van-button>
        </div>
      </van-form>

      <van-popup v-model:show="showGenderPicker" round position="bottom">
        <van-picker
          :columns="genderColumns"
          @confirm="onGenderConfirm"
          @cancel="showGenderPicker = false"
        />
      </van-popup>

      <van-popup v-model:show="showAgePicker" round position="bottom">
        <van-picker
          :columns="ageColumns"
          @confirm="onAgeConfirm"
          @cancel="showAgePicker = false"
        />
      </van-popup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: '',
  name: '',
  gender: '',
  age: null,
  phone: '',
  email: '',
  idCard: '',
  role: 'PATIENT',
})

const loading = ref(false)
const showGenderPicker = ref(false)
const showAgePicker = ref(false)

const genderColumns = [
  { text: '男', value: '男' },
  { text: '女', value: '女' },
]

const ageColumns = Array.from({ length: 100 }, (_, i) => ({
  text: `${i + 1}岁`,
  value: i + 1,
}))

const ageDisplay = computed(() => form.value.age ? `${form.value.age}岁` : '')

form.value.ageDisplay = ageDisplay

function onGenderConfirm({ selectedValues }) {
  form.value.gender = selectedValues[0]
  showGenderPicker.value = false
}

function onAgeConfirm({ selectedValues }) {
  form.value.age = selectedValues[0]
  showAgePicker.value = false
}

async function handleRegister() {
  loading.value = true
  try {
    const data = { ...form.value }
    delete data.ageDisplay
    await authStore.register(data)
    Toast.success('注册成功')
    router.push('/login')
  } catch (err) {
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  background: #f5f7fa;
}

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

.form-actions {
  margin-top: 24px;
  padding: 0 16px;
}
</style>
