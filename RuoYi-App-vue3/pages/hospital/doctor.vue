<template>
  <view class="container">
    <view class="filter-bar">
      <view class="filter-item" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">
        <text>全部医生</text>
      </view>
      <view class="filter-item" :class="{ active: activeFilter === 'today' }" @click="setFilter('today')">
        <text>今日出诊</text>
      </view>
      <view class="filter-item" :class="{ active: activeFilter === 'tomorrow' }" @click="setFilter('tomorrow')">
        <text>明日出诊</text>
      </view>
    </view>
    
    <view class="search-bar">
      <uni-search-bar placeholder="搜索医生姓名" @confirm="handleSearch" v-model="searchText" />
    </view>
    
    <view class="doctor-list" v-if="filteredDoctors.length > 0">
      <view class="doctor-card" v-for="doctor in filteredDoctors" :key="doctor.id" @click="goToDetail(doctor.id)">
        <view class="doctor-header">
          <view class="doctor-avatar">
            <image src="/static/images/profile.jpg" mode="aspectFill"></image>
          </view>
          <view class="doctor-basic">
            <view class="name-row">
              <text class="doctor-name">{{ doctor.user?.name || '医生' }}</text>
              <text class="doctor-title">{{ doctor.title }}</text>
            </view>
            <text class="doctor-dept">{{ doctor.department?.name }}</text>
            <view class="doctor-tags">
              <text class="tag" v-if="doctor.specialty">{{ doctor.specialty?.substring(0, 8) }}</text>
            </view>
          </view>
        </view>
        
        <view class="doctor-intro">
          <text class="intro-label">擅长：</text>
          <text class="intro-content">{{ doctor.specialty || '暂无介绍' }}</text>
        </view>
        
        <view class="doctor-footer">
          <view class="schedule-info">
            <uni-icons type="calendar" size="16" color="#2979ff"></uni-icons>
            <text class="schedule-text">可预约</text>
          </view>
          <button class="appoint-btn" @click.stop="goToAppointment(doctor)">立即预约</button>
        </view>
      </view>
    </view>
    
    <view class="empty-state" v-else>
      <uni-icons type="person" size="80" color="#ddd"></uni-icons>
      <text class="empty-text">暂无相关医生</text>
    </view>
    
    <uni-load-more :status="loadStatus" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDoctorList, getDoctorsByDepartment } from '@/api/hospital/doctor'

const doctorList = ref([])
const searchText = ref('')
const activeFilter = ref('all')
const deptId = ref('')
const loadStatus = ref('more')

const filteredDoctors = computed(() => {
  if (!searchText.value) {
    return doctorList.value
  }
  return doctorList.value.filter(doctor => 
    doctor.user?.name?.includes(searchText.value)
  )
})

const setFilter = (filter) => {
  activeFilter.value = filter
}

const handleSearch = (e) => {
  searchText.value = e.value
}

const goToDetail = (doctorId) => {
  uni.navigateTo({ url: `/pages/hospital/doctor-detail?id=${doctorId}` })
}

const goToAppointment = (doctor) => {
  uni.navigateTo({ url: `/pages/hospital/appointment?doctorId=${doctor.id}` })
}

const loadDoctors = async () => {
  loadStatus.value = 'loading'
  try {
    let res
    if (deptId.value) {
      res = await getDoctorsByDepartment(deptId.value)
    } else {
      res = await getDoctorList()
    }
    doctorList.value = res.data || res || []
    loadStatus.value = 'more'
  } catch (e) {
    console.error('加载医生失败', e)
    loadStatus.value = 'more'
  }
}

onLoad((options) => {
  if (options.deptId) {
    deptId.value = options.deptId
  }
  if (options.deptName) {
    uni.setNavigationBarTitle({ title: decodeURIComponent(options.deptName) })
  }
})

onMounted(() => {
  loadDoctors()
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f7fa;
}

.filter-bar {
  display: flex;
  background: #fff;
  padding: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  
  .filter-item {
    flex: 1;
    text-align: center;
    padding: 16rpx 0;
    font-size: 28rpx;
    color: #666;
    border-radius: 8rpx;
    
    &.active {
      background: #e8f4ff;
      color: #2979ff;
      font-weight: bold;
    }
  }
}

.search-bar {
  background: #fff;
  padding: 10rpx 20rpx;
}

.doctor-list {
  padding: 20rpx;
  
  .doctor-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
    
    .doctor-header {
      display: flex;
      margin-bottom: 20rpx;
      
      .doctor-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 24rpx;
        flex-shrink: 0;
        
        image {
          width: 100%;
          height: 100%;
        }
      }
      
      .doctor-basic {
        flex: 1;
        
        .name-row {
          display: flex;
          align-items: center;
          margin-bottom: 10rpx;
          
          .doctor-name {
            font-size: 34rpx;
            font-weight: bold;
            color: #333;
            margin-right: 16rpx;
          }
          
          .doctor-title {
            font-size: 24rpx;
            color: #2979ff;
            background: #e8f4ff;
            padding: 4rpx 16rpx;
            border-radius: 6rpx;
          }
        }
        
        .doctor-dept {
          display: block;
          font-size: 26rpx;
          color: #666;
          margin-bottom: 10rpx;
        }
        
        .doctor-tags {
          display: flex;
          flex-wrap: wrap;
          
          .tag {
            font-size: 22rpx;
            color: #ff9900;
            background: #fff8e6;
            padding: 4rpx 12rpx;
            border-radius: 4rpx;
            margin-right: 10rpx;
          }
        }
      }
    }
    
    .doctor-intro {
      background: #f8f9fa;
      padding: 16rpx;
      border-radius: 8rpx;
      margin-bottom: 20rpx;
      
      .intro-label {
        font-size: 26rpx;
        color: #666;
      }
      
      .intro-content {
        font-size: 26rpx;
        color: #333;
      }
    }
    
    .doctor-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .schedule-info {
        display: flex;
        align-items: center;
        
        .schedule-text {
          font-size: 26rpx;
          color: #2979ff;
          margin-left: 8rpx;
        }
      }
      
      .appoint-btn {
        background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
        color: #fff;
        font-size: 26rpx;
        border: none;
        border-radius: 30rpx;
        padding: 16rpx 32rpx;
      }
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
}
</style>
