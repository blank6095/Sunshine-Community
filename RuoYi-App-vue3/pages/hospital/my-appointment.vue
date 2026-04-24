<template>
  <view class="container">
    <view class="tabs">
      <view 
        class="tab-item" 
        :class="{ active: activeTab === tab.value }" 
        v-for="tab in tabs" 
        :key="tab.value"
        @click="switchTab(tab.value)"
      >
        <text>{{ tab.name }}</text>
        <view class="tab-badge" v-if="tab.count > 0">{{ tab.count }}</view>
      </view>
    </view>
    
    <view class="appointment-list" v-if="appointmentList.length > 0">
      <view class="appointment-card" v-for="item in appointmentList" :key="item.id">
        <view class="card-header">
          <view class="status-tag" :class="'status-' + item.status.toLowerCase()">
            {{ getStatusText(item.status) }}
          </view>
          <text class="create-time">{{ formatTime(item.createdAt) }}</text>
        </view>
        
        <view class="card-body" @click="viewDetail(item)">
          <view class="doctor-info">
            <view class="doctor-avatar">
              <image src="/static/images/profile.jpg" mode="aspectFill"></image>
            </view>
            <view class="doctor-detail">
              <view class="name-row">
                <text class="doctor-name">{{ item.doctor?.user?.name || '医生' }}</text>
                <text class="doctor-title">{{ item.doctor?.title }}</text>
              </view>
              <text class="doctor-dept">{{ item.doctor?.department?.name }}</text>
            </view>
          </view>
          
          <view class="appointment-info">
            <view class="info-row">
              <uni-icons type="calendar" size="16" color="#666"></uni-icons>
              <text>{{ item.schedule?.date }}</text>
            </view>
            <view class="info-row">
              <uni-icons type="clock" size="16" color="#666"></uni-icons>
              <text>{{ item.schedule?.startTime }} - {{ item.schedule?.endTime }}</text>
            </view>
            <view class="info-row" v-if="item.symptoms">
              <uni-icons type="info" size="16" color="#666"></uni-icons>
              <text>{{ item.symptoms }}</text>
            </view>
          </view>
        </view>
        
        <view class="card-footer">
          <button class="action-btn cancel" v-if="item.status === 'PENDING' || item.status === 'CONFIRMED'" @click="cancelAppointment(item)">
            取消预约
          </button>
          <button class="action-btn primary" v-if="item.status === 'PENDING'" @click="confirmAppointment(item)">
            确认就诊
          </button>
          <button class="action-btn" v-if="item.status === 'COMPLETED'" @click="viewDetail(item)">
            查看详情
          </button>
        </view>
      </view>
    </view>
    
    <view class="empty-state" v-else>
      <uni-icons type="calendar" size="80" color="#ddd"></uni-icons>
      <text class="empty-text">暂无预约记录</text>
      <button class="appoint-btn" @click="goToAppointment">立即预约</button>
    </view>
    
    <uni-load-more :status="loadStatus" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getAppointmentsByPatient, getAppointmentsByPatientAndStatus, cancelAppointment as cancelAppointmentApi, updateAppointment } from '@/api/hospital/appointment'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const tabs = ref([
  { name: '全部', value: 'all', count: 0 },
  { name: '待确认', value: 'PENDING', count: 0 },
  { name: '已确认', value: 'CONFIRMED', count: 0 },
  { name: '已完成', value: 'COMPLETED', count: 0 },
  { name: '已取消', value: 'CANCELLED', count: 0 }
])

const activeTab = ref('all')
const appointmentList = ref([])
const loadStatus = ref('more')

const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '待确认',
    'CONFIRMED': '已确认',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  }
  return statusMap[status] || status
}

const formatTime = (time) => {
  if (!time) return ''
  return time.substring(0, 10)
}

const switchTab = (tab) => {
  activeTab.value = tab
  loadAppointments()
}

const viewDetail = (item) => {
  uni.navigateTo({ url: `/pages/hospital/appointment-detail?id=${item.id}` })
}

const goToAppointment = () => {
  uni.navigateTo({ url: '/pages/hospital/department' })
}

const cancelAppointment = async (item) => {
  uni.showModal({
    title: '提示',
    content: '确定要取消该预约吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await cancelAppointmentApi(item.id)
          uni.showToast({ title: '取消成功', icon: 'success' })
          loadAppointments()
        } catch (e) {
          uni.showToast({ title: '取消失败', icon: 'none' })
        }
      }
    }
  })
}

const confirmAppointment = async (item) => {
  try {
    await updateAppointment(item.id, { status: 'CONFIRMED' })
    uni.showToast({ title: '确认成功', icon: 'success' })
    loadAppointments()
  } catch (e) {
    uni.showToast({ title: '确认失败', icon: 'none' })
  }
}

const loadAppointments = async () => {
  loadStatus.value = 'loading'
  try {
    let res
    if (activeTab.value === 'all') {
      res = await getAppointmentsByPatient(userStore.id)
    } else {
      res = await getAppointmentsByPatientAndStatus(userStore.id, activeTab.value)
    }
    appointmentList.value = res.data || res || []
    loadStatus.value = 'more'
  } catch (e) {
    console.error('加载预约列表失败', e)
    loadStatus.value = 'more'
  }
}

onShow(() => {
  loadAppointments()
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f7fa;
}

.tabs {
  display: flex;
  background: #fff;
  padding: 20rpx;
  position: sticky;
  top: 0;
  z-index: 100;
  
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 16rpx 0;
    font-size: 28rpx;
    color: #666;
    position: relative;
    
    &.active {
      color: #2979ff;
      font-weight: bold;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background: #2979ff;
        border-radius: 2rpx;
      }
    }
    
    .tab-badge {
      position: absolute;
      top: 0;
      right: 20rpx;
      min-width: 32rpx;
      height: 32rpx;
      background: #fa3534;
      color: #fff;
      font-size: 20rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8rpx;
    }
  }
}

.appointment-list {
  padding: 20rpx;
  
  .appointment-card {
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 24rpx;
      border-bottom: 1rpx solid #f0f0f0;
      
      .status-tag {
        padding: 6rpx 16rpx;
        border-radius: 6rpx;
        font-size: 24rpx;
        
        &.status-pending {
          background: #fff8e6;
          color: #ff9900;
        }
        
        &.status-confirmed {
          background: #e8f4ff;
          color: #2979ff;
        }
        
        &.status-completed {
          background: #e8f8e8;
          color: #19be6b;
        }
        
        &.status-cancelled {
          background: #f5f5f5;
          color: #999;
        }
      }
      
      .create-time {
        font-size: 24rpx;
        color: #999;
      }
    }
    
    .card-body {
      padding: 24rpx;
      
      .doctor-info {
        display: flex;
        margin-bottom: 20rpx;
        
        .doctor-avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 16rpx;
          
          image {
            width: 100%;
            height: 100%;
          }
        }
        
        .doctor-detail {
          .name-row {
            display: flex;
            align-items: center;
            margin-bottom: 6rpx;
            
            .doctor-name {
              font-size: 30rpx;
              font-weight: bold;
              color: #333;
              margin-right: 10rpx;
            }
            
            .doctor-title {
              font-size: 22rpx;
              color: #2979ff;
            }
          }
          
          .doctor-dept {
            font-size: 26rpx;
            color: #666;
          }
        }
      }
      
      .appointment-info {
        background: #f8f9fa;
        padding: 16rpx;
        border-radius: 8rpx;
        
        .info-row {
          display: flex;
          align-items: center;
          margin-bottom: 10rpx;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          text {
            font-size: 26rpx;
            color: #666;
            margin-left: 10rpx;
          }
        }
      }
    }
    
    .card-footer {
      display: flex;
      justify-content: flex-end;
      padding: 16rpx 24rpx;
      border-top: 1rpx solid #f0f0f0;
      
      .action-btn {
        font-size: 26rpx;
        border-radius: 30rpx;
        padding: 12rpx 24rpx;
        margin-left: 16rpx;
        
        &.cancel {
          background: #fff;
          color: #666;
          border: 1rpx solid #ddd;
        }
        
        &.primary {
          background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
          color: #fff;
          border: none;
        }
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
  
  .appoint-btn {
    margin-top: 40rpx;
    background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
    color: #fff;
    font-size: 28rpx;
    border: none;
    border-radius: 50rpx;
    padding: 20rpx 60rpx;
  }
}
</style>
