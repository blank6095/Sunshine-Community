<template>
  <view class="container">
    <view class="doctor-header">
      <view class="header-bg"></view>
      <view class="doctor-card">
        <view class="doctor-avatar">
          <image src="/static/images/profile.jpg" mode="aspectFill"></image>
        </view>
        <view class="doctor-info">
          <view class="name-row">
            <text class="doctor-name">{{ doctor.user?.name || '医生' }}</text>
            <text class="doctor-title">{{ doctor.title }}</text>
          </view>
          <text class="doctor-dept">{{ doctor.department?.name }}</text>
          <view class="doctor-stats">
            <view class="stat-item">
              <text class="stat-value">{{ doctor.experience || '20' }}年</text>
              <text class="stat-label">从业经验</text>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item">
              <text class="stat-value">{{ doctor.appointments || '1000+' }}</text>
              <text class="stat-label">服务患者</text>
            </view>
            <view class="stat-divider"></view>
            <view class="stat-item">
              <text class="stat-value">{{ doctor.rating || '98' }}%</text>
              <text class="stat-label">好评率</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="section">
      <view class="section-title">医生简介</view>
      <view class="section-content">
        <text>{{ doctor.bio || '该医生暂无简介信息' }}</text>
      </view>
    </view>
    
    <view class="section">
      <view class="section-title">擅长领域</view>
      <view class="section-content">
        <text>{{ doctor.specialty || '暂无信息' }}</text>
      </view>
    </view>
    
    <view class="section">
      <view class="section-title">出诊时间</view>
      <view class="schedule-list">
        <view class="schedule-item" v-for="schedule in scheduleList" :key="schedule.id" @click="selectSchedule(schedule)">
          <view class="schedule-date">
            <text class="date-day">{{ formatDate(schedule.date) }}</text>
            <text class="date-week">{{ formatWeek(schedule.date) }}</text>
          </view>
          <view class="schedule-time">
            <text>{{ schedule.startTime }} - {{ schedule.endTime }}</text>
            <text class="slots-info">剩余号源: {{ schedule.availableSlots }}/{{ schedule.maxPatients }}</text>
          </view>
          <view class="schedule-action">
            <button class="appoint-btn" :disabled="schedule.availableSlots <= 0" @click.stop="goToAppointment(schedule)">
              {{ schedule.availableSlots > 0 ? '预约' : '已满' }}
            </button>
          </view>
        </view>
        
        <view class="empty-schedule" v-if="scheduleList.length === 0">
          <text>暂无排班信息</text>
        </view>
      </view>
    </view>
    
    <view class="bottom-bar">
      <button class="primary-btn" @click="goToAppointment()">立即预约</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDoctor } from '@/api/hospital/doctor'
import { getSchedulesByDoctor } from '@/api/hospital/schedule'

const doctorId = ref('')
const doctor = ref({})
const scheduleList = ref([])

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const formatWeek = (dateStr) => {
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const date = new Date(dateStr)
  return weeks[date.getDay()]
}

const selectSchedule = (schedule) => {
  if (schedule.availableSlots > 0) {
    goToAppointment(schedule)
  }
}

const goToAppointment = (schedule) => {
  let url = `/pages/hospital/appointment?doctorId=${doctorId.value}`
  if (schedule) {
    url += `&scheduleId=${schedule.id}&date=${schedule.date}&time=${schedule.startTime}-${schedule.endTime}`
  }
  uni.navigateTo({ url })
}

const loadDoctorDetail = async () => {
  try {
    const res = await getDoctor(doctorId.value)
    doctor.value = res.data || res || {}
  } catch (e) {
    console.error('加载医生详情失败', e)
  }
}

const loadSchedules = async () => {
  try {
    const res = await getSchedulesByDoctor(doctorId.value)
    scheduleList.value = (res.data || res || []).filter(s => s.status === 'ACTIVE')
  } catch (e) {
    console.error('加载排班失败', e)
  }
}

onLoad((options) => {
  if (options.id) {
    doctorId.value = options.id
    loadDoctorDetail()
    loadSchedules()
  }
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 120rpx;
}

.doctor-header {
  position: relative;
  
  .header-bg {
    height: 200rpx;
    background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
  }
  
  .doctor-card {
    position: relative;
    margin: -100rpx 20rpx 20rpx;
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
    
    .doctor-avatar {
      position: absolute;
      top: -50rpx;
      left: 30rpx;
      width: 140rpx;
      height: 140rpx;
      border-radius: 50%;
      overflow: hidden;
      border: 6rpx solid #fff;
      box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
      
      image {
        width: 100%;
        height: 100%;
      }
    }
    
    .doctor-info {
      margin-left: 170rpx;
      padding-top: 20rpx;
      
      .name-row {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
        
        .doctor-name {
          font-size: 36rpx;
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
        font-size: 28rpx;
        color: #666;
        margin-bottom: 20rpx;
      }
      
      .doctor-stats {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 20rpx 0;
        border-top: 1rpx solid #f0f0f0;
        
        .stat-item {
          text-align: center;
          
          .stat-value {
            display: block;
            font-size: 32rpx;
            font-weight: bold;
            color: #2979ff;
          }
          
          .stat-label {
            display: block;
            font-size: 24rpx;
            color: #999;
            margin-top: 6rpx;
          }
        }
        
        .stat-divider {
          width: 1rpx;
          height: 60rpx;
          background: #f0f0f0;
        }
      }
    }
  }
}

.section {
  background: #fff;
  margin: 20rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  
  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
    padding-left: 16rpx;
    border-left: 6rpx solid #2979ff;
  }
  
  .section-content {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
  }
}

.schedule-list {
  .schedule-item {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background: #f8f9fa;
    border-radius: 12rpx;
    margin-bottom: 16rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .schedule-date {
      width: 100rpx;
      text-align: center;
      margin-right: 20rpx;
      
      .date-day {
        display: block;
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      
      .date-week {
        display: block;
        font-size: 24rpx;
        color: #999;
      }
    }
    
    .schedule-time {
      flex: 1;
      
      text {
        display: block;
        font-size: 28rpx;
        color: #333;
      }
      
      .slots-info {
        font-size: 24rpx;
        color: #19be6b;
        margin-top: 6rpx;
      }
    }
    
    .schedule-action {
      .appoint-btn {
        background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
        color: #fff;
        font-size: 26rpx;
        border: none;
        border-radius: 30rpx;
        padding: 12rpx 28rpx;
        
        &[disabled] {
          background: #ccc;
        }
      }
    }
  }
  
  .empty-schedule {
    text-align: center;
    padding: 40rpx;
    color: #999;
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
  
  .primary-btn {
    background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
    color: #fff;
    font-size: 32rpx;
    border: none;
    border-radius: 50rpx;
    padding: 24rpx 0;
  }
}
</style>
