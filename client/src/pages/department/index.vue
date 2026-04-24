<template>
  <view class="container">
    <view class="header">
      <view class="header-bg"></view>
      <view class="header-content">
        <text class="title">科室列表</text>
        <text class="subtitle">选择需要就诊的科室</text>
      </view>
    </view>

    <view class="content">
      <view class="search-bar">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          placeholder="搜索科室名称..." 
          v-model="searchKeyword"
          @input="filterDepartments"
        />
      </view>

      <view class="list">
        <view 
          class="item" 
          v-for="item in filteredDepartments" 
          :key="item.id"
          @click="goToDetail(item.id)"
        >
          <view class="item-icon">{{ item.icon }}</view>
          <view class="item-content">
            <text class="name">{{ item.name }}</text>
            <text class="desc">{{ item.desc }}</text>
            <view class="item-meta">
              <text class="doctors">👨‍⚕️ {{ item.doctorCount }}位医生</text>
              <text class="hot">🔥 {{ item.hot ? '热门' : '' }}</text>
            </view>
          </view>
          <view class="item-arrow">›</view>
        </view>
      </view>
    </view>

    <view class="tab-bar">
      <view class="tab-item" @click="goToIndex">
        <text class="tab-icon">🏠</text>
        <text class="tab-text">首页</text>
      </view>
      <view class="tab-item active">
        <text class="tab-icon">📋</text>
        <text class="tab-text">科室</text>
      </view>
      <view class="tab-item" @click="goToRecord">
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
      searchKeyword: '',
      departments: [
        { id: 1, icon: '🫁', name: '呼吸内科', desc: '呼吸系统、心血管系统等疾病', doctorCount: 8, hot: true },
        { id: 2, icon: '🫀', name: '心血管内科', desc: '心脏疾病、高血压等', doctorCount: 6, hot: true },
        { id: 3, icon: '🦴', name: '骨科', desc: '普通外科、骨科等疾病', doctorCount: 10, hot: false },
        { id: 4, icon: '👶', name: '儿科', desc: '儿童常见病、疫苗接种', doctorCount: 12, hot: true },
        { id: 5, icon: '👩', name: '妇科', desc: '妇产科疾病、孕检等', doctorCount: 7, hot: false },
        { id: 6, icon: '👁️', name: '眼科', desc: '眼科疾病、视力检查', doctorCount: 5, hot: false },
        { id: 7, icon: '🦷', name: '口腔科', desc: '口腔检查、牙齿治疗', doctorCount: 4, hot: false },
        { id: 8, icon: '🧠', name: '神经内科', desc: '脑部神经、失眠等', doctorCount: 9, hot: false }
      ]
    }
  },
  computed: {
    filteredDepartments() {
      if (!this.searchKeyword) return this.departments
      const keyword = this.searchKeyword.toLowerCase()
      return this.departments.filter(item => 
        item.name.toLowerCase().includes(keyword) || 
        item.desc.toLowerCase().includes(keyword)
      )
    }
  },
  methods: {
    filterDepartments() {
      this.$forceUpdate()
    },
    goToDetail(id) {
      uni.navigateTo({ url: `/pages/department/detail?id=${id}` })
    },
    goToIndex() {
      uni.switchTab({ url: '/pages/index/index' })
    },
    goToRecord() {
      uni.switchTab({ url: '/pages/record/index' })
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

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 50px;
  padding: 24px 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.search-icon {
  font-size: 28px;
  margin-right: 16px;
}

.search-input {
  flex: 1;
  font-size: 28px;
  color: #333;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item {
  background: white;
  padding: 30px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.item-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.name {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.desc {
  font-size: 24px;
  color: #999;
}

.item-meta {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}

.doctors {
  font-size: 22px;
  color: #666;
}

.hot {
  font-size: 22px;
  color: #f5576c;
}

.item-arrow {
  font-size: 40px;
  color: #ccc;
  flex-shrink: 0;
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
