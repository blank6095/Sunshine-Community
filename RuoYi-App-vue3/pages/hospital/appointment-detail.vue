<template>
  <view class="container">
    <view class="detail-card">
      <view class="status-section">
        <view class="status-icon" :class="'status-' + appointment.status?.toLowerCase()">
          <uni-icons :type="getStatusIcon(appointment.status)" size="48" color="#fff"></uni-icons>
        </view>
        <text class="status-text">{{ getStatusText(appointment.status) }}</text>
      </view>
      
      <view class="info-section">
        <view class="section-title">就诊信息</view>
        <view class="info-list">
          <view class="info-item">
            <text class="info-label">就诊日期</text>
            <text class="info-value">{{ appointment.schedule?.date }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">就诊时段</text>
            <text class="info-value">{{ appointment.schedule?.startTime }} - {{ appointment.schedule?.endTime }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">就诊科室</text>
            <text class="info-value">{{ appointment.doctor?.department?.name }}</text>
          </view>
        </view>
      </view>
      
      <view class="info-section">
        <view class="section-title">医生信息</view>
        <view class="doctor-card">
          <view class="doctor-avatar">
            <image src="/static/images/profile.jpg" mode="aspectFill"></image>
          </view>
          <view class="doctor-info">
            <view class="name-row">
              <text class="doctor-name">{{ appointment.doctor?.user?.name || '医生' }}</text>
              <text class="doctor-title">{{ appointment.doctor?.title }}</text>
            </view>
            <text class="doctor-specialty">{{ appointment.doctor?.specialty || '暂无' }}</text>
          </view>
        </view>
      </view>
      
      <view class="info-section">
        <view class="section-title">患者信息</view>
        <view class="info-list">
          <view class="info-item">
            <text class="info-label">患者姓名</text>
            <text class="info-value">{{ appointment.patient?.name }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">联系电话</text>
            <text class="info-value">{{ appointment.patient?.phone }}</text>
          </view>
        </view>
      </view>
      
      <view class="info-section" v-if="appointment.symptoms">
        <view class="section-title">症状描述</view>
        <view class="symptom-content">
          <text>{{ appointment.symptoms }}</text>
        </view>
      </view>
    </view>
    
    <view class="bottom-bar" v-if="appointment.status === 'PENDING' || appointment.status === 'CONFIRMED'">
      <button class="cancel-btn" @click="handleCancel">取消预约</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAppointment, cancelAppointment } from '@/api/hospital/appointment'

const appointmentId = ref('')
const appointment = ref({})

const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '待确认',
    'CONFIRMED': '已确认',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  }
  return statusMap[status] || status
}

const getStatusIcon = (status) => {
  const iconMap = {
    'PENDING': 'clock',
    'CONFIRMED': 'checkmarkempty',
    'COMPLETED': 'checkbox-filled',
    'CANCELLED': 'closeempty'
  }
  return iconMap[status] || 'info'
}

const loadAppointment = async () => {
  try {
    const res = await getAppointment(appointmentId.value)
    appointment.value = res.data || res || {}
  } catch (e) {
    console.error('加载预约详情失败', e)
  }
}

const handleCancel = () => {
  uni.showModal({
    title: '提示',
    content: '确定要取消该预约吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await cancelAppointment(appointmentId.value)
          uni.showToast({ title: '取消成功', icon: 'success' })
          loadAppointment()
        } catch (e) {
          uni.showToast({ title: '取消失败', icon: 'none' })
        }
      }
    }
  })
}

onLoad((options) => {
  if (options.id) {
    appointmentId.value = options.id
    loadAppointment()
  }
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 120rpx;
}

.detail-card {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.status-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx;
  background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
  
  .status-icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.3);
    margin-bottom: 16rpx;
  }
  
  .status-text {
    font-size: 36rpx;
    font-weight: bold;
    color: #fff;
  }
}

.info-section {
  padding: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    padding-left: 16rpx;
    border-left: 6rpx solid #2979ff;
  }
}

.info-list {
  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 16rpx 0;
    
    .info-label {
      font-size: 28rpx;
      color: #666;
    }
    
    .info-value {
      font-size: 28rpx;
      color: #333;
    }
  }
}

.doctor-card {
  display: flex;
  align-items: center;
  
  .doctor-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 20rpx;
    
    image {
      width: 100%;
      height: 100%;
    }
  }
  
  .doctor-info {
    .name-row {
      display: flex;
      align-items: center;
      margin-bottom: 8rpx;
      
      .doctor-name {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        margin-right: 12rpx;
      }
      
      .doctor-title {
        font-size: 22rpx;
        color: #2979ff;
        background: #e8f4ff;
        padding: 4rpx 12rpx;
        border-radius: 4rpx;
      }
    }
    
    .doctor-specialty {
      font-size: 26rpx;
      color: #666;
    }
  }
}

.symptom-content {
  background: #f8f9fa;
  padding: 20rpx;
  border-radius: 8rpx;
  
  text {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.05);
  
  .cancel-btn {
    background: #fff;
    color: #fa3534;
    font-size: 32rpx;
    border: 2rpx solid #fa3534;
    border-radius: 50rpx;
    padding: 20rpx 0;
  }
}
</style>
