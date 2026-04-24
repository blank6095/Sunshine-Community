<template>
  <view class="container">
    <view class="header">
      <view class="header-content">
        <text class="title">智慧医院</text>
        <text class="subtitle">便捷挂号 · 健康相伴</text>
      </view>
    </view>
    
    <view class="banner-section">
      <swiper class="banner-swiper" indicator-dots autoplay circular :interval="3000">
        <swiper-item v-for="(item, index) in bannerList" :key="index">
          <image class="banner-image" :src="item.image" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </view>

    <view class="quick-entry">
      <view class="entry-item" v-for="(item, index) in quickEntries" :key="index" @click="handleQuickEntry(item)">
        <view class="entry-icon" :style="{ backgroundColor: item.bgColor }">
          <uni-icons :type="item.icon" size="28" color="#fff"></uni-icons>
        </view>
        <text class="entry-text">{{ item.name }}</text>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">热门科室</text>
        <text class="section-more" @click="goToDepartmentList">查看全部 ></text>
      </view>
      <view class="department-grid">
        <view class="department-item" v-for="dept in departmentList" :key="dept.id" @click="goToDoctorList(dept.id)">
          <view class="dept-icon">
            <uni-icons type="staff" size="24" color="#2979ff"></uni-icons>
          </view>
          <text class="dept-name">{{ dept.name }}</text>
          <text class="dept-desc">{{ dept.description || '专业医疗团队' }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">医院公告</text>
        <text class="section-more" @click="goToAnnouncement">查看全部 ></text>
      </view>
      <view class="notice-list">
        <view class="notice-item" v-for="(notice, index) in noticeList" :key="index" @click="viewNotice(notice)">
          <view class="notice-tag" :class="'tag-' + notice.type">{{ notice.typeName }}</view>
          <view class="notice-content">
            <text class="notice-title">{{ notice.title }}</text>
            <text class="notice-date">{{ notice.date }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">推荐医生</text>
        <text class="section-more" @click="goToDoctorList()">查看全部 ></text>
      </view>
      <view class="doctor-list">
        <view class="doctor-card" v-for="doctor in doctorList" :key="doctor.id" @click="goToDoctorDetail(doctor.id)">
          <view class="doctor-avatar">
            <image src="/static/images/profile.jpg" mode="aspectFill"></image>
          </view>
          <view class="doctor-info">
            <view class="doctor-name-row">
              <text class="doctor-name">{{ doctor.user?.name || '医生' }}</text>
              <text class="doctor-title">{{ doctor.title }}</text>
            </view>
            <text class="doctor-dept">{{ doctor.department?.name }}</text>
            <text class="doctor-specialty">擅长：{{ doctor.specialty || '暂无' }}</text>
          </view>
          <view class="doctor-action">
            <button class="appoint-btn" size="mini" @click.stop="goToAppointment(doctor)">预约</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const bannerList = ref([
  { image: '/static/images/banner/banner01.jpg' },
  { image: '/static/images/banner/banner02.jpg' },
  { image: '/static/images/banner/banner03.jpg' }
])

const quickEntries = ref([
  { name: '预约挂号', icon: 'calendar', bgColor: '#2979ff', path: '/pages/hospital/department' },
  { name: '我的预约', icon: 'list', bgColor: '#19be6b', path: '/pages/hospital/my-appointment' },
  { name: '就医指南', icon: 'help', bgColor: '#ff9900', path: '/pages/hospital/guide' },
  { name: '医院公告', icon: 'sound', bgColor: '#fa3534', path: '/pages/hospital/announcement' }
])

const departmentList = ref([
  { id: 1, name: '内科', description: '内科疾病诊疗' },
  { id: 2, name: '外科', description: '外科手术治疗' },
  { id: 3, name: '儿科', description: '儿童疾病诊疗' },
  { id: 4, name: '妇产科', description: '妇科产科服务' },
  { id: 5, name: '眼科', description: '眼科疾病诊疗' },
  { id: 6, name: '口腔科', description: '口腔健康服务' },
  { id: 7, name: '皮肤科', description: '皮肤疾病诊疗' },
  { id: 8, name: '精神科', description: '心理健康服务' }
])

const doctorList = ref([
  { id: 1, user: { name: '张医生' }, title: '主任医师', department: { name: '内科' }, specialty: '心血管疾病' },
  { id: 2, user: { name: '李医生' }, title: '副主任医师', department: { name: '外科' }, specialty: '普外科手术' },
  { id: 3, user: { name: '王医生' }, title: '主治医师', department: { name: '儿科' }, specialty: '小儿常见病' },
  { id: 4, user: { name: '赵医生' }, title: '主任医师', department: { name: '妇产科' }, specialty: '产科服务' }
])

const loading = ref(false)

const noticeList = ref([
  { title: '2024年春节门诊安排通知', date: '2024-01-20', type: 'important', typeName: '重要' },
  { title: '我院新增心血管内科专家门诊', date: '2024-01-18', type: 'news', typeName: '新闻' },
  { title: '核酸检测服务时间调整公告', date: '2024-01-15', type: 'notice', typeName: '通知' }
])

const handleQuickEntry = (item) => {
  uni.navigateTo({ url: item.path })
}

const goToDepartmentList = () => {
  uni.navigateTo({ url: '/pages/hospital/department' })
}

const goToDoctorList = (deptId) => {
  if (deptId) {
    uni.navigateTo({ url: `/pages/hospital/doctor?deptId=${deptId}` })
  } else {
    uni.navigateTo({ url: '/pages/hospital/doctor' })
  }
}

const goToDoctorDetail = (doctorId) => {
  uni.navigateTo({ url: `/pages/hospital/doctor-detail?id=${doctorId}` })
}

const goToAppointment = (doctor) => {
  uni.navigateTo({ url: `/pages/hospital/appointment?doctorId=${doctor.id}` })
}

const goToAnnouncement = () => {
  uni.navigateTo({ url: '/pages/hospital/announcement' })
}

const viewNotice = (notice) => {
  uni.navigateTo({ url: `/pages/hospital/announcement-detail?title=${notice.title}` })
}

const loadData = async () => {
  loading.value = true
  try {
    // 模拟数据加载
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (e) {
    console.error('加载数据失败', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 20rpx;
}

.header {
  background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
  padding: 60rpx 30rpx 40rpx;
  
  .header-content {
    .title {
      display: block;
      font-size: 44rpx;
      font-weight: bold;
      color: #fff;
    }
    .subtitle {
      display: block;
      font-size: 26rpx;
      color: rgba(255,255,255,0.8);
      margin-top: 10rpx;
    }
  }
}

.banner-section {
  margin: -30rpx 20rpx 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
  
  .banner-swiper {
    height: 280rpx;
  }
  
  .banner-image {
    width: 100%;
    height: 100%;
  }
}

.quick-entry {
  display: flex;
  justify-content: space-around;
  background: #fff;
  margin: 20rpx;
  padding: 30rpx 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
  
  .entry-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .entry-icon {
      width: 90rpx;
      height: 90rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;
    }
    
    .entry-text {
      font-size: 26rpx;
      color: #333;
    }
  }
}

.section {
  background: #fff;
  margin: 20rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .section-more {
      font-size: 24rpx;
      color: #999;
    }
  }
}

.department-grid {
  display: flex;
  flex-wrap: wrap;
  
  .department-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;
    
    .dept-icon {
      width: 80rpx;
      height: 80rpx;
      background: #e8f4ff;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;
    }
    
    .dept-name {
      font-size: 26rpx;
      color: #333;
      margin-bottom: 4rpx;
    }
    
    .dept-desc {
      font-size: 20rpx;
      color: #999;
    }
  }
}

.notice-list {
  .notice-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .notice-tag {
      padding: 6rpx 16rpx;
      border-radius: 6rpx;
      font-size: 22rpx;
      margin-right: 16rpx;
      flex-shrink: 0;
      
      &.tag-important {
        background: #fff0f0;
        color: #fa3534;
      }
      
      &.tag-news {
        background: #e8f4ff;
        color: #2979ff;
      }
      
      &.tag-notice {
        background: #fff8e6;
        color: #ff9900;
      }
    }
    
    .notice-content {
      flex: 1;
      overflow: hidden;
      
      .notice-title {
        display: block;
        font-size: 28rpx;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .notice-date {
        display: block;
        font-size: 24rpx;
        color: #999;
        margin-top: 8rpx;
      }
    }
  }
}

.doctor-list {
  .doctor-card {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .doctor-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 20rpx;
      flex-shrink: 0;
      
      image {
        width: 100%;
        height: 100%;
      }
    }
    
    .doctor-info {
      flex: 1;
      overflow: hidden;
      
      .doctor-name-row {
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
      
      .doctor-dept {
        display: block;
        font-size: 24rpx;
        color: #666;
        margin-bottom: 6rpx;
      }
      
      .doctor-specialty {
        display: block;
        font-size: 24rpx;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    
    .doctor-action {
      .appoint-btn {
        background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
        color: #fff;
        border: none;
        border-radius: 30rpx;
        padding: 0 24rpx;
      }
    }
  }
}
</style>
