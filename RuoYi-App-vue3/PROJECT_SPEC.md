# 智慧医院挂号预约系统 - 项目结构与规范文档

## 目录

- [项目概述](#项目概述)
- [技术架构](#技术架构)
- [目录结构](#目录结构)
- [代码规范](#代码规范)
- [命名约定](#命名约定)
- [组件规范](#组件规范)
- [状态管理](#状态管理)
- [API请求](#api请求)
- [认证流程](#认证流程)
- [路由规范](#路由规范)
- [样式规范](#样式规范)
- [性能优化](#性能优化)

---

## 项目概述

本项目是基于 **UniApp + Vue 3 + Pinia** 技术栈开发的智慧医院挂号预约系统，支持多端运行（H5、微信小程序、App等）。

### 核心功能
- 用户登录/注册
- 科室与医生展示
- 挂号预约流程
- 预约记录管理
- 医院公告与就医指南

### 版本信息
- 应用名称：智慧医院
- 版本号：v1.2.0
- 后端API：http://localhost:8080/api/v1

---

## 技术架构

### 核心技术栈
| 技术 | 版本/说明 |
|------|----------|
| Vue | 3.x (Composition API / setup) |
| Pinia | 状态管理 |
| UniApp | 跨端开发框架 |
| uni-ui | UI组件库 |

### 核心依赖
```javascript
// config.js
const baseUrl = 'http://localhost:8080/api/v1'
const appInfo = {
  name: 'ruoyi-app',
  version: '1.2.0',
  logo: '/static/logo.png'
}
```

---

## 目录结构

### 项目根目录结构
```
RuoYi-App-vue3/
├── api/                    # API接口目录
│   ├── hospital/          # 医院相关API
│   ├── system/            # 系统API
│   ├── login.js          # 登录API
│   └── API文档.md        # API文档
├── components/            # 组件目录
├── pages/                # 页面目录
│   ├── hospital/        # 医院功能页面
│   ├── mine/            # 个人中心页面
│   ├── common/          # 通用页面
│   ├── login.vue        # 登录页
│   └── register.vue     # 注册页
├── plugins/              # 插件目录
├── static/               # 静态资源目录
├── store/                # 状态管理
├── uni_modules/          # uni插件目录
├── utils/                # 工具函数
├── App.vue              # 应用入口
├── main.js              # 主入口
├── pages.json           # 路由配置
├── permission.js        # 权限拦截
└── config.js            # 全局配置
```

### 核心目录详解

#### 1. /api/ - API接口目录
**命名约定**：按功能模块分文件夹，每个模块一个JS文件

```javascript
// api/hospital/ 下的文件结构
appointment.js    // 预约管理API
auth.js          // 认证相关API
department.js    // 科室管理API
doctor.js        // 医生管理API
schedule.js      // 排班管理API
user.js          // 用户管理API

// api/system/ 下的文件结构
dict/data.js     // 字典数据API
dict/type.js     // 字典类型API
```

**API函数命名约定**：
- 获取列表：getXxxList()
- 获取单个：getXxx(id)
- 创建：addXxx(data)
- 更新：updateXxx(id, data)
- 删除：delXxx(id)
- 特殊查询：getXxxByYyy(yyyId)

#### 2. /pages/ - 页面目录
**页面组织规则**：按功能模块分文件夹，主页为 index.vue

```
pages/
├── hospital/               # 医院功能模块
│   ├── index.vue          # 首页
│   ├── department.vue     # 科室列表
│   ├── doctor.vue        # 医生列表
│   ├── doctor-detail.vue # 医生详情
│   ├── appointment.vue   # 预约挂号
│   ├── my-appointment.vue # 我的预约
│   ├── announcement.vue  # 医院公告
│   └── guide.vue         # 就医指南
├── mine/                 # 个人中心
│   ├── index.vue        # 个人中心主页
│   ├── info/            # 个人信息
│   ├── avatar/          # 头像管理
│   ├── pwd/             # 修改密码
│   ├── setting/         # 设置
│   └── about/           # 关于我们
├── login.vue            # 登录页
└── register.vue         # 注册页
```

#### 3. /store/ - Pinia状态管理
```
store/
├── modules/
│   ├── user.js          # 用户状态
│   ├── config.js        # 配置状态
│   └── dict.js          # 字典状态
└── index.js             # 主入口
```

#### 4. /utils/ - 工具函数
```
utils/
├── auth.js              # 认证相关（Token管理）
├── request.js           # 请求封装
├── storage.js           # 本地存储封装
├── common.js            # 通用工具函数
├── constant.js          # 常量定义
├── dict.js              # 字典工具
├── validate.js          # 表单验证
├── errorCode.js         # 错误码映射
└── permission.js        # 权限相关
```

---

## 代码规范

### Vue 3 Composition API 使用规范

所有页面和组件必须使用 <script setup> 语法：

```vue
<template>
  <view class="container">
    <!-- 内容 -->
  </view>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'

// 1. 响应式变量定义
const count = ref(0)
const form = reactive({
  name: '',
  phone: ''
})

// 2. 计算属性
const doubleCount = computed(() => count.value * 2)

// 3. 监听器
watch(count, (newVal, oldVal) => {
  console.log(newVal)
})

// 4. 生命周期
onMounted(() => {
  console.log('组件挂载')
})

onLoad((options) => {
  console.log('页面加载', options)
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
}
</style>
```

### 导入规范
```javascript
// 1. Vue相关导入
import { ref, reactive, computed, watch } from 'vue'

// 2. UniApp导入
import { onLoad, onShow } from '@dcloudio/uni-app'

// 3. 工具类导入
import { getToken, setToken } from '@/utils/auth'

// 4. API导入
import { getDoctorList } from '@/api/hospital/doctor'

// 5. Store导入
import { useUserStore } from '@/store/modules/user'

// 6. 组件导入
import UniCard from '@/components/uni-card/uni-card.vue'
```

---

## 命名约定

### 文件命名
- 页面组件：小驼峰 + 连字符命名（如：doctor-detail.vue）
- API文件：小驼峰命名（如：appointment.js）
- 工具文件：小驼峰命名（如：auth.js）
- Store模块：小驼峰命名（如：user.js）

### 变量命名
```javascript
// 布尔值：is/has/can开头
const isLoading = ref(false)
const hasPermission = ref(true)
const canSubmit = computed(() => true)

// 数组：复数形式
const doctors = ref([])
const appointments = ref([])

// 常量：大写 + 下划线
const API_BASE_URL = 'http://localhost:8080/api/v1'
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024

// 函数：动宾结构
function getUserInfo() { /* */ }
function setLocalStorage() { /* */ }
function handleClick() { /* */ }
function validateForm() { /* */ }
```

---

## 组件规范

### 组件文件结构
每个组件都应该包含以下部分（按顺序）：

```vue
<template>
  <!-- 1. 模板内容 -->
</template>

<script setup>
  // 2. 导入语句
  // 3. 类型定义（可选）
  // 4. Props 定义
  // 5. Emits 定义
  // 6. 响应式数据
  // 7. 计算属性
  // 8. 方法定义
  // 9. 生命周期函数
</script>

<style lang="scss" scoped>
  // 10. 样式
</style>
```

---

## 状态管理

### Store 模块规范
每个 Store 模块必须导出 useXxxStore 函数，使用 Pinia 组合式 API：

```javascript
// store/modules/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getToken, setToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  // 1. State
  const token = ref(getToken())
  const userId = ref('')
  const username = ref('')
  const name = ref('')
  const avatar = ref('')
  const roles = ref([])
  const permissions = ref([])
  const isLoading = ref(false)

  // 2. Getters
  const isLoggedIn = computed(() => !!token.value)

  // 3. Actions
  function loginAction(loginData) {
    return new Promise((resolve, reject) => {
      login(loginData).then(res => {
        token.value = res.token
        setToken(res.token)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }

  function logoutAction() {
    token.value = ''
    removeToken()
    /* 清除其他状态 */
  }

  return {
    token,
    userId,
    name,
    avatar,
    roles,
    permissions,
    isLoading,
    isLoggedIn,
    loginAction,
    logoutAction
  }
})
```

---

## API请求

### API 文件结构
```javascript
// api/hospital/department.js
import request from '@/utils/request'

// 获取科室列表
export function getDepartmentList() {
  return request({
    url: '/departments',
    method: 'get'
  })
}

// 获取单个科室
export function getDepartment(id) {
  return request({
    url: `/departments/${id}`,
    method: 'get'
  })
}

// 创建科室
export function addDepartment(data) {
  return request({
    url: '/departments',
    method: 'post',
    data: data
  })
}

// 更新科室
export function updateDepartment(id, data) {
  return request({
    url: `/departments/${id}`,
    method: 'put',
    data: data
  })
}

// 删除科室
export function delDepartment(id) {
  return request({
    url: `/departments/${id}`,
    method: 'delete'
  })
}
```

### 请求调用规范
```javascript
import { getDoctorList, getDoctorsByDepartment } from '@/api/hospital/doctor'

// 在页面中使用
async function fetchDoctors(departmentId) {
  try {
    isLoading.value = true

    let response
    if (departmentId) {
      response = await getDoctorsByDepartment(departmentId)
    } else {
      response = await getDoctorList()
    }

    doctors.value = response.data || response
  } catch (error) {
    console.error('获取医生列表失败:', error)
    uni.showToast({ icon: 'none', title: '获取医生列表失败' })
  } finally {
    isLoading.value = false
  }
}
```

---

## 认证流程

### Token 管理
```javascript
// utils/auth.js
const TOKEN_KEY = 'App-Token'
const TOKEN_EXPIRE_KEY = 'Token-Expire-Time'

// 获取Token
export function getToken() {
  return uni.getStorageSync(TOKEN_KEY)
}

// 设置Token
export function setToken(token) {
  uni.setStorageSync(TOKEN_KEY, token)
}

// 删除Token
export function removeToken() {
  uni.removeStorageSync(TOKEN_KEY)
  uni.removeStorageSync(TOKEN_EXPIRE_KEY)
}

// 检查是否有有效的Token
export function hasValidToken() {
  const token = getToken()
  return !!token && token.length > 0
}

// 设置Token过期时间
export function setTokenExpireTime(expireTime) {
  uni.setStorageSync(TOKEN_EXPIRE_KEY, expireTime)
}

// 检查Token是否过期
export function isTokenExpired() {
  const expireTime = uni.getStorageSync(TOKEN_EXPIRE_KEY)
  if (!expireTime) return false
  return Date.now() > expireTime
}
```

### 登录流程
1. 用户在登录页输入账号密码
2. 调用登录 API
3. 获取并存储 Token
4. 获取用户信息
5. 根据需要跳转登录前的页面

```javascript
// pages/login.vue
<script setup>
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const redirectUrl = ref('')

const handleLogin = async () => {
  // 1. 表单验证
  if (!validateLoginForm()) {
    return
  }

  try {
    uni.showLoading({ title: '登录中...' })

    // 2. 调用登录
    await userStore.loginAction(loginForm.value)

    // 3. 获取用户信息
    await userStore.getInfoAction()

    uni.hideLoading()

    // 4. 跳转（优先跳转重定向URL）
    if (redirectUrl.value) {
      uni.reLaunch({ url: decodeURIComponent(redirectUrl.value) })
    } else {
      uni.reLaunch({ url: '/pages/hospital/index' })
    }
  } catch (error) {
    uni.hideLoading()
    console.error('登录失败:', error)
  }
}

onLoad((options) => {
  // 获取重定向URL
  if (options.redirect) {
    redirectUrl.value = options.redirect
  }
})
</script>
```

---

## 路由规范

### 路由配置
路由配置在 pages.json 中，使用 UniApp 标准格式：

```json
{
  "pages": [
    {
      "path": "pages/hospital/index",
      "style": {
        "navigationBarTitleText": "智慧医院"
      }
    },
    {
      "path": "pages/login",
      "style": {
        "navigationBarTitleText": "登录"
      }
    }
  ],
  "tabBar": {
    "color": "#666666",
    "selectedColor": "#2979ff",
    "borderStyle": "white",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/hospital/index",
        "iconPath": "static/images/tabbar/home.png",
        "selectedIconPath": "static/images/tabbar/home_.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/hospital/my-appointment",
        "iconPath": "static/images/tabbar/work.png",
        "selectedIconPath": "static/images/tabbar/work_.png",
        "text": "预约"
      },
      {
        "pagePath": "pages/mine/index",
        "iconPath": "static/images/tabbar/mine.png",
        "selectedIconPath": "static/images/tabbar/mine_.png",
        "text": "我的"
      }
    ]
  }
}
```

### 页面跳转规范
```javascript
// 保留当前页面，跳转新页面（可返回）
uni.navigateTo({
  url: '/pages/hospital/doctor-detail?id=1'
})

// 重定向（不可返回）
uni.redirectTo({
  url: '/pages/login'
})

// 关闭所有页面，打开新页面
uni.reLaunch({
  url: '/pages/hospital/index'
})

// 切换到TabBar页面
uni.switchTab({
  url: '/pages/mine/index'
})

// 返回上一页
uni.navigateBack({
  delta: 1
})
```

---

## 样式规范

### 主题色彩
```scss
// 主题色（智慧医院蓝色）
$primary-color: #2979ff;
$primary-light: #e8f4ff;

// 状态色
$success-color: #19be6b;  // 成功
$warning-color: #ff9900;  // 警告
$error-color: #fa3534;    // 错误
$info-color: #2979ff;     // 信息

// 中性色
$text-primary: #333333;   // 主文字
$text-secondary: #666666; // 次要文字
$text-placeholder: #999; // 占位文字
$bg-base: #f5f7fa;        // 背景色
$border-color: #f0f0f0;   // 边框色
```

### 间距规范
```scss
$spacing-xs: 8rpx;
$spacing-sm: 16rpx;
$spacing-md: 20rpx;
$spacing-lg: 24rpx;
$spacing-xl: 30rpx;
$spacing-xxl: 40rpx;
```

### 圆角规范
```scss
$radius-sm: 8rpx;
$radius-md: 12rpx;
$radius-lg: 16rpx;
$radius-xl: 30rpx;
```

### 字体规范
```scss
$font-size-xs: 22rpx;  // 辅助文字
$font-size-sm: 24rpx;  // 次要文字
$font-size-md: 26rpx;  // 正文
$font-size-lg: 30rpx;  // 小标题
$font-size-xl: 36rpx;  // 大标题
$font-size-xxl: 44rpx; // 特大标题
```

---

## 性能优化

### 列表优化
```vue
<!-- 使用 uni-list 组件 -->
<uni-list>
  <uni-list-item
    v-for="item in list"
    :key="item.id"
    :title="item.name"
  />
</uni-list>

<!-- 或者使用虚拟滚动 -->
```

### 图片优化
```vue
<!-- 1. 使用 webp 格式（支持的情况下） -->
<!-- 2. 使用合适尺寸的图片 -->
<!-- 3. 使用懒加载 -->
<image
  :src="item.imageUrl"
  mode="aspectFill"
  lazy-load
/>
```

### 数据缓存
```javascript
// utils/storage.js
const CACHE_EXPIRE = 5 * 60 * 1000 // 5分钟

export function setCache(key, value, expire = CACHE_EXPIRE) {
  const data = {
    value,
    expireTime: Date.now() + expire
  }
  uni.setStorageSync(key, data)
}

export function getCache(key) {
  const data = uni.getStorageSync(key)
  if (!data) return null

  if (Date.now() > data.expireTime) {
    uni.removeStorageSync(key)
    return null
  }
  return data.value
}
```

---

## 最佳实践 Checklist

- [x] 所有页面用 <script setup> 语法
- [x] API 请求有完整的 try-catch
- [x] 认证过期自动跳转登录
- [x] 跳转时保留当前页面作为重定向参数
- [x] 状态清理完整
- [x] 表单有加载和错误提示
- [x] 图片使用懒加载

---

## 更新记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2024-01-15 | 初版规范文档 |
| v1.1 | 2024-01-20 | 更新认证流程和命名约定 |
| v1.2 | 2024-04-24 | 完善API请求和性能优化章节 |

---

**本规范文档是项目开发的核心参考，请团队成员严格遵循。**
