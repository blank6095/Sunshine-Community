<template>
  <view class="container">
    <view class="header">
      <view class="header-bg"></view>
      <view class="header-content">
        <text class="title">预约记录</text>
        <text class="subtitle">查看您的就诊预约</text>
      </view>
    </view>

    <view class="content">
      <view class="tabs">
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'all' }"
          @click="switchTab('all')"
        >
          <text>全部</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'upcoming' }"
          @click="switchTab('upcoming')"
        >
          <text>待就诊</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'completed' }"
          @click="switchTab('completed')"
        >
          <text>已完成</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'cancelled' }"
          @click="switchTab('cancelled')"
        >
          <text>已取消</text>
        </view>
      </view>

      <view class="empty-state" v-if="filteredRecords.length === 0">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无预约记录</text>
        <view class="empty-btn" @click="goToDepartment">
          <text>立即预约</text>
        </view>
      </view>

      <view class="list" v-else>
        <view class="item" v-for="item in filteredRecords" :key="item.id">
          <view class="item-header">
            <text class="dept">{{ item.department }}</text>
            <view class="status-badge" :class="item.statusType">
              <text>{{ item.status }}</text>
            </view>
          </view>
          
          <view class="item-body">
            <view class="doctor-section">
              <text class="doctor-avatar">{{ item.doctor.charAt(0) }}</text>
              <view class="doctor-info">
                <text class="doctor-name">{{ item.doctor }}</text>
                <text class="doctor-title">{{ item.title }}</text>
              </view>
            </view>
            <view class="time-section">
              <text class="time-icon">📅</text>
              <text class="time-text">{{ item.time }}</text>
            </view>
          </view>

          <view class="item-footer">
            <view class="location">
              <text class="location-icon">🏥</text>
              <text class="location-text">{{ item.hospital }}</text>
            </view>
            <view class="actions" v-if="item.statusType === 'upcoming'">
              <view class="action-btn cancel" @click="cancelAppointment(item.id)">
                <text>取消预约</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="tab-bar">
      <view class="tab-item" @click="goToIndex">
        <text class="tab-icon">🏠</text>
        <text class="tab-text">首页</text>
      </view>
      <view class="tab-item" @click="goToDepartment">
        <text class="tab-icon">📋</text>
        <text class="tab-text">科室</text>
      </view>
      <view class="tab-item active">
        <text class="tab-icon">📅</text>
        <text class="tab-text">预约</text>
      </view>
      <view class="tab-item" @click="goToUser">
        <text class="tab-icon">👤</text>
        <text class="tab-text">我的</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'all',
      records: [
        { 
          id: 1, 
          department: '呼吸内科', 
          doctor: '张明医生', 
          title: '主任医师', 
          time: '2025-01-15 09:00', 
          hospital: '阳光医院3楼', 
          status: '待就诊', 
          statusType: 'upcoming' 
        },
        { 
          id: 2, 
          department: '心血管内科', 
          doctor: '李华医生', 
          title: '副主任医师', 
          time: '2025-01-14 14:00', 
          hospital: '阳光医院2楼', 
          status: '已完成', 
          statusType: 'completed' 
        },
        { 
          id: 3, 
          department: '儿科', 
          doctor: '王芳医生', 
          title: '主治医师', 
          time: '2025-01-12 10:30', 
          hospital: '阳光医院5楼', 
          status: '已取消', 
          statusType: 'cancelled' 
        }
      ]
    }
  },
  computed: {
    filteredRecords() {
      if (this.activeTab === 'all') return this.records
      return this.records.filter(item => item.statusType === this.activeTab)
    }
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab
    },
    cancelAppointment(id) {
      uni.showModal({
        title: '提示',
        content: '确定要取消该预约吗？',
        success: (res) => {
          if (res.confirm) {
            const record = this.records.find(r => r.id === id)
            if (record) {
              record.status = '已取消'
              record.statusType = 'cancelled'
              uni.showToast({ title: '取消成功', icon: 'success' })
            }
          }
        }
      })
    },
    goToIndex() {
      uni.switchTab({ url: '/pages/index/index' })
    },
    goToDepartment() {
      uni.switchTab({ url: '/pages/department/index' })
    },
    goToUser() {
      uni.switchTab({ url: '/pages/user/index' })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 120px;
}

.header {
  position: relative;
  padding: 0 0 40px 0;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 180px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-radius: 0 0 40px 40px;
}

.header-content {
  position: relative;
  z-index: 10;
  padding: 50px 30px 0 30px;
}

.title {
  font-size: 40px;
  font-weight: bold;
  color: white;
  display: block;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 28px;
  color: rgba(255, 255, 255, 0.85);
  display: block;
}

.content {
  padding: 30px;
  margin-top: -20px;
}

.tabs {
  display: flex;
  background: white;
  border-radius: 50px;
  padding: 8px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16px;
  font-size: 26px;
  color: #666;
  border-radius: 40px;
  transition: all 0.3s;
}

.tab-item.active {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  font-weight: bold;
}

.empty-state {
  background: white;
  border-radius: 24px;
  padding: 80px 30px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 100px;
  display: block;
  margin-bottom: 24px;
}

.empty-text {
  font-size: 30px;
  color: #999;
  display: block;
  margin-bottom: 40px;
}

.empty-btn {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-radius: 50px;
  padding: 20px 60px;
  display: inline-block;
}

.empty-btn text {
  font-size: 28px;
  color: white;
  font-weight: bold;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.item {
  background: white;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.dept {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.status-badge {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 24px;
}

.status-badge.upcoming {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.status-badge.completed {
  background: rgba(67, 233, 123, 0.1);
  color: #43e97b;
}

.status-badge.cancelled {
  background: rgba(153, 153, 153, 0.1);
  color: #999;
}

.item-body {
  margin-bottom: 20px;
}

.doctor-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.doctor-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  font-weight: bold;
}

.doctor-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.doctor-name {
  font-size: 30px;
  font-weight: bold;
  color: #333;
}

.doctor-title {
  font-size: 24px;
  color: #666;
}

.time-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-icon {
  font-size: 28px;
}

.time-text {
  font-size: 26px;
  color: #666;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.location {
  display: flex;
  align-items: center;
  gap: 10px;
}

.location-icon {
  font-size: 28px;
}

.location-text {
  font-size: 24px;
  color: #999;
}

.actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  padding: 12px 30px;
  border-radius: 20px;
  font-size: 24px;
}

.action-btn.cancel {
  background: rgba(153, 153, 153, 0.1);
  color: #999;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110px;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.tab-icon {
  font-size: 40px;
}

.tab-text {
  font-size: 22px;
  color: #999;
}

.tab-item.active .tab-text {
  color: #1890ff;
}
</style>
