<template>
  <view class="container">
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
      </view>
    </view>
    
    <view class="section">
      <view class="section-title">选择日期</view>
      <scroll-view class="date-scroll" scroll-x>
        <view class="date-list">
          <view 
            class="date-item" 
            :class="{ active: selectedDate === date.value }" 
            v-for="date in dateList" 
            :key="date.value"
            @click="selectDate(date)"
          >
            <text class="date-week">{{ date.week }}</text>
            <text class="date-day">{{ date.day }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <view class="section" v-if="selectedDate">
      <view class="section-title">选择时段</view>
      <view class="time-list">
        <view 
          class="time-item" 
          :class="{ active: selectedSchedule?.id === schedule.id, disabled: schedule.availableSlots <= 0 }"
          v-for="schedule in scheduleList" 
          :key="schedule.id"
          @click="selectSchedule(schedule)"
        >
          <text class="time-range">{{ schedule.startTime }} - {{ schedule.endTime }}</text>
          <text class="time-slots">剩余: {{ schedule.availableSlots }}号</text>
        </view>
        
        <view class="empty-time" v-if="scheduleList.length === 0">
          <text>该日期暂无排班</text>
        </view>
      </view>
    </view>
    
    <view class="section">
      <view class="section-title">症状描述</view>
      <view class="symptom-input">
        <textarea 
          v-model="symptoms" 
          placeholder="请简要描述您的症状，便于医生提前了解病情..."
          maxlength="200"
        ></textarea>
        <text class="word-count">{{ symptoms.length }}/200</text>
      </view>
    </view>
    
    <view class="section">
      <view class="section-title">患者信息</view>
      <view class="patient-info">
        <view class="info-item">
          <text class="info-label">姓名</text>
          <text class="info-value">{{ patientInfo.name || '未填写' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">手机号</text>
          <text class="info-value">{{ patientInfo.phone || '未填写' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">身份证号</text>
          <text class="info-value">{{ patientInfo.idCard || '未填写' }}</text>
        </view>
      </view>
    </view>
    
    <view class="notice-section">
      <view class="notice-title">预约须知</view>
      <view class="notice-list">
        <text class="notice-item">1. 请在预约时间段前15分钟到达医院</text>
        <text class="notice-item">2. 请携带有效身份证件</text>
        <text class="notice-item">3. 如需取消预约，请提前24小时操作</text>
        <text class="notice-item">4. 预约成功后请按时就诊，爽约将影响信用</text>
      </view>
    </view>
    
    <view class="bottom-bar">
      <view class="price-info">
        <text class="price-label">挂号费</text>
        <text class="price-value">¥{{ doctor.registrationFee || 50 }}</text>
      </view>
      <button class="submit-btn" :disabled="!canSubmit" @click="submitAppointment">确认预约</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getDoctor } from '@/api/hospital/doctor'
import { getSchedulesByDoctorAndDate } from '@/api/hospital/schedule'
import { addAppointment } from '@/api/hospital/appointment'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const doctorId = ref('')
const doctor = ref({})
const selectedDate = ref('')
const selectedSchedule = ref(null)
const scheduleList = ref([])
const symptoms = ref('')
const dateList = ref([])
const patientInfo = ref({})

const canSubmit = computed(() => {
  return selectedDate.value && selectedSchedule.value && symptoms.value.length > 0
})

const generateDateList = () => {
  const dates = []
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const today = new Date()
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push({
      value: date.toISOString().split('T')[0],
      week: i === 0 ? '今天' : i === 1 ? '明天' : weeks[date.getDay()],
      day: `${date.getMonth() + 1}/${date.getDate()}`
    })
  }
  dateList.value = dates
  if (dates.length > 0) {
    selectedDate.value = dates[0].value
    loadSchedules()
  }
}

const selectDate = (date) => {
  selectedDate.value = date.value
  selectedSchedule.value = null
  loadSchedules()
}

const selectSchedule = (schedule) => {
  if (schedule.availableSlots > 0) {
    selectedSchedule.value = schedule
  }
}

const loadDoctor = async () => {
  try {
    const res = await getDoctor(doctorId.value)
    doctor.value = res.data || res || {}
  } catch (e) {
    console.error('加载医生信息失败', e)
  }
}

const loadSchedules = async () => {
  if (!doctorId.value || !selectedDate.value) return
  try {
    const res = await getSchedulesByDoctorAndDate(doctorId.value, selectedDate.value)
    scheduleList.value = (res.data || res || []).filter(s => s.status === 'ACTIVE')
  } catch (e) {
    console.error('加载排班失败', e)
    scheduleList.value = []
  }
}

const submitAppointment = async () => {
  if (!canSubmit.value) {
    uni.showToast({ title: '请完善预约信息', icon: 'none' })
    return
  }
  
  uni.showLoading({ title: '提交中...' })
  try {
    const data = {
      patient: { id: userStore.id },
      doctor: { id: doctorId.value },
      schedule: { id: selectedSchedule.value.id },
      appointmentTime: `${selectedDate.value}T${selectedSchedule.value.startTime}:00`,
      symptoms: symptoms.value,
      status: 'PENDING'
    }
    
    await addAppointment(data)
    uni.hideLoading()
    uni.showModal({
      title: '预约成功',
      content: '您的预约已提交，请按时就诊',
      showCancel: false,
      success: () => {
        uni.navigateTo({ url: '/pages/hospital/my-appointment' })
      }
    })
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: '预约失败，请重试', icon: 'none' })
    console.error('预约失败', e)
  }
}

onLoad((options) => {
  if (options.doctorId) {
    doctorId.value = options.doctorId
    loadDoctor()
  }
  
  patientInfo.value = {
    name: userStore.name,
    phone: '',
    idCard: ''
  }
})

onMounted(() => {
  generateDateList()
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 140rpx;
}

.doctor-card {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 24rpx;
  margin: 20rpx;
  border-radius: 16rpx;
  
  .doctor-avatar {
    width: 100rpx;
    height: 100rpx;
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
        font-size: 32rpx;
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
    
    .doctor-dept {
      font-size: 26rpx;
      color: #666;
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
    margin-bottom: 20rpx;
  }
}

.date-scroll {
  white-space: nowrap;
}

.date-list {
  display: inline-flex;
  
  .date-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100rpx;
    padding: 16rpx 0;
    margin-right: 20rpx;
    background: #f5f7fa;
    border-radius: 12rpx;
    
    &.active {
      background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
      
      text {
        color: #fff;
      }
    }
    
    .date-week {
      font-size: 24rpx;
      color: #666;
    }
    
    .date-day {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-top: 6rpx;
    }
  }
}

.time-list {
  display: flex;
  flex-wrap: wrap;
  
  .time-item {
    width: calc(50% - 10rpx);
    background: #f5f7fa;
    padding: 20rpx;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    margin-right: 20rpx;
    
    &:nth-child(2n) {
      margin-right: 0;
    }
    
    &.active {
      background: #e8f4ff;
      border: 2rpx solid #2979ff;
    }
    
    &.disabled {
      opacity: 0.5;
    }
    
    .time-range {
      display: block;
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }
    
    .time-slots {
      display: block;
      font-size: 24rpx;
      color: #19be6b;
      margin-top: 8rpx;
    }
  }
  
  .empty-time {
    width: 100%;
    text-align: center;
    padding: 40rpx;
    color: #999;
  }
}

.symptom-input {
  position: relative;
  
  textarea {
    width: 100%;
    height: 200rpx;
    padding: 20rpx;
    background: #f5f7fa;
    border-radius: 12rpx;
    font-size: 28rpx;
  }
  
  .word-count {
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
    font-size: 24rpx;
    color: #999;
  }
}

.patient-info {
  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
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

.notice-section {
  background: #fff8e6;
  margin: 20rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  
  .notice-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #ff9900;
    margin-bottom: 16rpx;
  }
  
  .notice-list {
    .notice-item {
      display: block;
      font-size: 24rpx;
      color: #666;
      line-height: 1.8;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 20rpx 30rpx;
  box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.05);
  
  .price-info {
    .price-label {
      font-size: 26rpx;
      color: #666;
    }
    
    .price-value {
      font-size: 40rpx;
      font-weight: bold;
      color: #fa3534;
      margin-left: 10rpx;
    }
  }
  
  .submit-btn {
    background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
    color: #fff;
    font-size: 32rpx;
    border: none;
    border-radius: 50rpx;
    padding: 20rpx 60rpx;
    
    &[disabled] {
      background: #ccc;
    }
  }
}
</style>
