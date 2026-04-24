<template>
  <view class="container">
    <view class="guide-section">
      <view class="section-title">
        <view class="title-icon">
          <uni-icons type="location" size="24" color="#2979ff"></uni-icons>
        </view>
        <text>来院路线</text>
      </view>
      <view class="section-content">
        <view class="info-item">
          <text class="info-label">医院地址</text>
          <text class="info-value">XX省XX市XX区XX路XX号</text>
        </view>
        <view class="info-item">
          <text class="info-label">公交路线</text>
          <text class="info-value">乘坐1路、2路、3路公交车至"医院站"下车</text>
        </view>
        <view class="info-item">
          <text class="info-label">地铁路线</text>
          <text class="info-value">地铁1号线"医院站"B出口，步行约500米</text>
        </view>
      </view>
    </view>
    
    <view class="guide-section">
      <view class="section-title">
        <view class="title-icon">
          <uni-icons type="clock" size="24" color="#2979ff"></uni-icons>
        </view>
        <text>门诊时间</text>
      </view>
      <view class="section-content">
        <view class="time-table">
          <view class="time-row header">
            <text class="time-cell">时段</text>
            <text class="time-cell">上午</text>
            <text class="time-cell">下午</text>
          </view>
          <view class="time-row">
            <text class="time-cell">周一至周五</text>
            <text class="time-cell">8:00-12:00</text>
            <text class="time-cell">14:00-17:30</text>
          </view>
          <view class="time-row">
            <text class="time-cell">周六</text>
            <text class="time-cell">8:00-12:00</text>
            <text class="time-cell">休息</text>
          </view>
          <view class="time-row">
            <text class="time-cell">周日</text>
            <text class="time-cell">休息</text>
            <text class="time-cell">休息</text>
          </view>
        </view>
        <view class="tips">
          <text>急诊科24小时开放</text>
        </view>
      </view>
    </view>
    
    <view class="guide-section">
      <view class="section-title">
        <view class="title-icon">
          <uni-icons type="list" size="24" color="#2979ff"></uni-icons>
        </view>
        <text>就诊流程</text>
      </view>
      <view class="section-content">
        <view class="process-list">
          <view class="process-item" v-for="(item, index) in processList" :key="index">
            <view class="process-num">{{ index + 1 }}</view>
            <view class="process-content">
              <text class="process-title">{{ item.title }}</text>
              <text class="process-desc">{{ item.desc }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="guide-section">
      <view class="section-title">
        <view class="title-icon">
          <uni-icons type="info" size="24" color="#2979ff"></uni-icons>
        </view>
        <text>注意事项</text>
      </view>
      <view class="section-content">
        <view class="notice-list">
          <view class="notice-item" v-for="(item, index) in noticeList" :key="index">
            <view class="notice-dot"></view>
            <text>{{ item }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="guide-section">
      <view class="section-title">
        <view class="title-icon">
          <uni-icons type="phone" size="24" color="#2979ff"></uni-icons>
        </view>
        <text>联系方式</text>
      </view>
      <view class="section-content">
        <view class="contact-list">
          <view class="contact-item" @click="makePhone('120')">
            <view class="contact-icon">
              <uni-icons type="phone-filled" size="24" color="#fa3534"></uni-icons>
            </view>
            <view class="contact-info">
              <text class="contact-name">急救电话</text>
              <text class="contact-value">120</text>
            </view>
          </view>
          <view class="contact-item" @click="makePhone('0571-12345678')">
            <view class="contact-icon">
              <uni-icons type="phone-filled" size="24" color="#2979ff"></uni-icons>
            </view>
            <view class="contact-info">
              <text class="contact-name">咨询热线</text>
              <text class="contact-value">0571-12345678</text>
            </view>
          </view>
          <view class="contact-item" @click="makePhone('0571-87654321')">
            <view class="contact-icon">
              <uni-icons type="phone-filled" size="24" color="#19be6b"></uni-icons>
            </view>
            <view class="contact-info">
              <text class="contact-name">预约电话</text>
              <text class="contact-value">0571-87654321</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const processList = ref([
  { title: '预约挂号', desc: '通过APP、电话或现场预约挂号' },
  { title: '签到候诊', desc: '到达医院后，在科室签到机签到' },
  { title: '医生问诊', desc: '按叫号顺序进入诊室就诊' },
  { title: '检查缴费', desc: '医生开具检查单后缴费检查' },
  { title: '取药治疗', desc: '凭处方缴费后到药房取药' }
])

const noticeList = ref([
  '请携带有效身份证件就诊',
  '预约成功后请按时就诊，爽约将影响信用',
  '如需取消预约，请提前24小时操作',
  '就诊前请准备好既往病历资料',
  '缴费支持现金、银行卡、微信、支付宝等多种方式',
  '如有疑问请咨询导医台或拨打咨询电话'
])

const makePhone = (phone) => {
  uni.makePhoneCall({ phoneNumber: phone })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20rpx;
}

.guide-section {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  
  .section-title {
    display: flex;
    align-items: center;
    padding: 24rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .title-icon {
      width: 48rpx;
      height: 48rpx;
      background: #e8f4ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16rpx;
    }
    
    text {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .section-content {
    padding: 24rpx;
  }
}

.info-item {
  margin-bottom: 20rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .info-label {
    display: block;
    font-size: 26rpx;
    color: #999;
    margin-bottom: 8rpx;
  }
  
  .info-value {
    display: block;
    font-size: 28rpx;
    color: #333;
  }
}

.time-table {
  width: 100%;
  border-radius: 12rpx;
  overflow: hidden;
  
  .time-row {
    display: flex;
    border-bottom: 1rpx solid #f0f0f0;
    
    &.header {
      background: #2979ff;
      
      .time-cell {
        color: #fff;
        font-weight: bold;
      }
    }
    
    &:last-child {
      border-bottom: none;
    }
    
    .time-cell {
      flex: 1;
      text-align: center;
      padding: 20rpx;
      font-size: 26rpx;
      color: #333;
      
      &:first-child {
        background: #f8f9fa;
      }
    }
  }
}

.tips {
  margin-top: 16rpx;
  padding: 16rpx;
  background: #fff8e6;
  border-radius: 8rpx;
  
  text {
    font-size: 26rpx;
    color: #ff9900;
  }
}

.process-list {
  .process-item {
    display: flex;
    margin-bottom: 24rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .process-num {
      width: 48rpx;
      height: 48rpx;
      background: linear-gradient(135deg, #2979ff 0%, #1e88e5 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 26rpx;
      font-weight: bold;
      margin-right: 16rpx;
      flex-shrink: 0;
    }
    
    .process-content {
      flex: 1;
      
      .process-title {
        display: block;
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 6rpx;
      }
      
      .process-desc {
        display: block;
        font-size: 26rpx;
        color: #666;
      }
    }
  }
}

.notice-list {
  .notice-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .notice-dot {
      width: 12rpx;
      height: 12rpx;
      background: #2979ff;
      border-radius: 50%;
      margin-top: 14rpx;
      margin-right: 16rpx;
      flex-shrink: 0;
    }
    
    text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }
  }
}

.contact-list {
  .contact-item {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background: #f8f9fa;
    border-radius: 12rpx;
    margin-bottom: 16rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .contact-icon {
      width: 80rpx;
      height: 80rpx;
      background: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
    }
    
    .contact-info {
      flex: 1;
      
      .contact-name {
        display: block;
        font-size: 26rpx;
        color: #666;
        margin-bottom: 6rpx;
      }
      
      .contact-value {
        display: block;
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
    }
  }
}
</style>
