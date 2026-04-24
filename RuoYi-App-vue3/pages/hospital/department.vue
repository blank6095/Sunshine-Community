<template>
  <view class="container">
    <view class="search-bar">
      <uni-search-bar placeholder="搜索科室" @confirm="handleSearch" @input="handleInput" v-model="searchText" />
      <view class="search-action" v-if="searchText" @click="clearSearch">
        <uni-icons type="clear" size="20" color="#999"></uni-icons>
      </view>
    </view>
    
    <view class="department-list" v-if="filteredDepartments.length > 0">
      <view class="department-card" v-for="dept in filteredDepartments" :key="dept.id" @click="selectDepartment(dept)">
        <view class="dept-icon" :style="{ backgroundColor: getIconColor(dept.id) }">
          <uni-icons type="staff" size="32" color="#fff"></uni-icons>
        </view>
        <view class="dept-info">
          <text class="dept-name">{{ dept.name }}</text>
          <text class="dept-desc">{{ dept.description || '专业医疗团队为您服务' }}</text>
        </view>
        <view class="dept-arrow">
          <uni-icons type="right" size="18" color="#ccc"></uni-icons>
        </view>
      </view>
    </view>
    
    <view class="empty-state" v-else>
      <uni-icons type="search" size="80" color="#ddd"></uni-icons>
      <text class="empty-text">{{ searchText ? '未找到相关科室' : '暂无科室信息' }}</text>
      <button v-if="!searchText" class="retry-btn" @click="loadDepartments">重新加载</button>
    </view>
    
    <uni-load-more :status="loadStatus" :loading-text="'加载中...'" :no-more-text="'已加载全部'" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDepartmentList } from '@/api/hospital/department'

const departmentList = ref([])
const searchText = ref('')
const loadStatus = ref('more')
const isLoading = ref(false)

const filteredDepartments = computed(() => {
  if (!searchText.value) {
    return departmentList.value
  }
  return departmentList.value.filter(dept => 
    dept.name.includes(searchText.value) || 
    (dept.description && dept.description.includes(searchText.value))
  )
})

const iconColors = ['#2979ff', '#19be6b', '#ff9900', '#fa3534', '#9c27b0', '#00bcd4']

const getIconColor = (id) => {
  return iconColors[id % iconColors.length]
}

const handleSearch = (e) => {
  searchText.value = e.value
}

const handleInput = (e) => {
  searchText.value = e.value
}

const clearSearch = () => {
  searchText.value = ''
}

const selectDepartment = (dept) => {
  uni.navigateTo({ 
    url: `/pages/hospital/doctor?deptId=${dept.id}&deptName=${encodeURIComponent(dept.name)}`
  })
}

const loadDepartments = async () => {
  if (isLoading.value) return
  
  loadStatus.value = 'loading'
  isLoading.value = true
  try {
    const res = await getDepartmentList()
    departmentList.value = res.data || res || []
    loadStatus.value = 'noMore'
  } catch (e) {
    console.error('加载科室失败', e)
    uni.showToast({ title: '加载失败，请重试', icon: 'none' })
    loadStatus.value = 'more'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDepartments()
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f7fa;
}

.search-bar {
  background: #fff;
  padding: 20rpx;
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  
  .search-action {
    margin-left: 10rpx;
    padding: 10rpx;
  }
}

.department-list {
  padding: 20rpx;
  
  .department-card {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
    
    .dept-icon {
      width: 100rpx;
      height: 100rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 24rpx;
      flex-shrink: 0;
    }
    
    .dept-info {
      flex: 1;
      overflow: hidden;
      
      .dept-name {
        display: block;
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
      }
      
      .dept-desc {
        display: block;
        font-size: 26rpx;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    
    .dept-arrow {
      margin-left: 20rpx;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-top: 20rpx;
  }
  
  .retry-btn {
    margin-top: 40rpx;
    background: #2979ff;
    color: #fff;
    border: none;
    border-radius: 50rpx;
    padding: 20rpx 60rpx;
  }
}
</style>
