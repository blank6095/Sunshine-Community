<template>
  <div class="edit-profile-page page-container">
    <div class="page-header">
      <van-icon name="arrow-left" size="20" @click="$router.back()" style="position: absolute; left: 16px; cursor: pointer;" />
      <span class="page-title">编辑资料</span>
    </div>

    <div class="page-content">
      <van-form @submit="handleUpdate">
        <van-cell-group inset>
          <van-field
            v-model="form.name"
            name="name"
            label="姓名"
            placeholder="请输入姓名"
            :rules="[{ required: true, message: '请输入姓名' }]"
          />
          <van-field
            v-model="form.gender"
            name="gender"
            label="性别"
            placeholder="请选择性别"
            is-link
            readonly
            @click="showGenderPicker = true"
            :rules="[{ required: true, message: '请选择性别' }]"
          />
          <van-field
            v-model="ageText"
            name="age"
            label="年龄"
            placeholder="请选择年龄"
            is-link
            readonly
            @click="showAgePicker = true"
            :rules="[{ required: true, message: '请选择年龄' }]"
          />
          <van-field
            v-model="form.phone"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[{ required: true, message: '请输入手机号' }, { pattern: /^1\d{10}$/, message: '请输入正确的手机号' }]"
          />
          <van-field
            v-model="form.email"
            name="email"
            label="邮箱"
            placeholder="请输入邮箱"
            :rules="[{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入正确的邮箱' }]"
          />
          <van-field
            v-model="form.idCard"
            name="idCard"
            label="身份证号"
            placeholder="请输入18位身份证号"
            :rules="[{ pattern: /^\d{17}[\dXx]$/, message: '请输入正确的身份证号' }]"
          />
        </van-cell-group>

        <div class="form-actions">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            保存
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Toast, showNotify } from 'vant'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const originalForm = ref(null)

const form = ref({
  name: '',
  gender: '',
  age: null,
  phone: '',
  email: '',
  idCard: '',
})

const loading = ref(false)
const showGenderPicker = ref(false)
const showAgePicker = ref(false)

const ageText = computed(() => form.value.age ? `${form.value.age}岁` : '')

const genderColumns = [
  { text: '男', value: '男' },
  { text: '女', value: '女' },
]

const ageColumns = Array.from({ length: 100 }, (_, i) => ({
  text: `${i + 1}岁`,
  value: i + 1,
}))

onMounted(() => {
  const user = authStore.user || {}
  form.value = {
    name: user.name || '',
    gender: user.gender || '',
    age: user.age || null,
    phone: user.phone || '',
    email: user.email || '',
    idCard: user.idCard || '',
  }
  originalForm.value = { ...form.value }
})

function onGenderConfirm({ selectedValues }) {
  form.value.gender = selectedValues[0]
  showGenderPicker.value = false
}

function onAgeConfirm({ selectedValues }) {
  form.value.age = selectedValues[0]
  showAgePicker.value = false
}

async function handleUpdate() {
  loading.value = true
  const previousForm = { ...form.value }
  
  try {
    const data = {
      name: form.value.name,
      gender: form.value.gender,
      age: form.value.age,
      phone: form.value.phone,
      email: form.value.email || undefined,
      idCard: form.value.idCard || undefined,
    }
    
    await authStore.updateProfile(data)
    
    showNotify({
      type: 'success',
      message: '个人信息更新成功',
      duration: 2000,
    })
    
    setTimeout(() => {
      router.back()
    }, 500)
  } catch (err) {
    form.value = { ...previousForm }
    
    const errorMsg = err.message || '更新失败，请稍后重试'
    
    if (errorMsg.includes('手机号') || errorMsg.includes('手机')) {
      showNotify({
        type: 'danger',
        message: '该手机号已被使用',
        duration: 3000,
      })
    } else if (errorMsg.includes('邮箱')) {
      showNotify({
        type: 'danger',
        message: '该邮箱已被使用',
        duration: 3000,
      })
    } else if (errorMsg.includes('网络') || errorMsg.includes('超时')) {
      showNotify({
        type: 'warning',
        message: '网络连接失败，请检查网络后重试',
        duration: 3000,
      })
    } else {
      showNotify({
        type: 'danger',
        message: errorMsg,
        duration: 3000,
      })
    }
  } finally {
    loading.value = false
  }
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

.form-actions {
  margin-top: 24px;
  padding: 0 16px;
}
</style>
