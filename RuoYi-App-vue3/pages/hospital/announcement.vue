<template>
  <view class="container">
    <view class="notice-list">
      <view class="notice-card" v-for="(notice, index) in noticeList" :key="index" @click="viewNotice(notice)">
        <view class="notice-header">
          <view class="notice-tag" :class="'tag-' + notice.type">{{ notice.typeName }}</view>
          <text class="notice-date">{{ notice.date }}</text>
        </view>
        <text class="notice-title">{{ notice.title }}</text>
        <text class="notice-summary">{{ notice.summary }}</text>
        <view class="notice-footer">
          <text class="read-more">查看详情 ></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const noticeList = ref([
  {
    id: 1,
    title: '2024年春节门诊安排通知',
    summary: '根据国务院办公厅通知精神，结合我院实际情况，现将2024年春节期间门诊安排通知如下...',
    date: '2024-01-20',
    type: 'important',
    typeName: '重要',
    content: '根据国务院办公厅通知精神，结合我院实际情况，现将2024年春节期间门诊安排通知如下：\n\n一、放假时间：2024年2月9日（除夕）至2月17日（初八），共9天。\n\n二、门诊安排：\n1. 2月9日（除夕）：上午正常门诊，下午停诊\n2. 2月10日-12日（初一至初三）：急诊24小时开放\n3. 2月13日-17日：上午开设普通门诊\n\n三、急诊科24小时开放，如有紧急情况请拨打急救电话：120'
  },
  {
    id: 2,
    title: '我院新增心血管内科专家门诊',
    summary: '为满足广大患者就医需求，我院特聘知名心血管专家坐诊，每周一、三、五上午...',
    date: '2024-01-18',
    type: 'news',
    typeName: '新闻',
    content: '为满足广大患者就医需求，我院特聘知名心血管专家张教授坐诊。\n\n坐诊时间：每周一、三、五上午\n坐诊地点：门诊楼三楼心血管内科诊室\n\n张教授从事心血管疾病诊疗工作30余年，擅长冠心病、高血压、心律失常等疾病的诊治，尤其对疑难复杂心血管疾病有丰富的临床经验。\n\n预约方式：\n1. 通过医院APP在线预约\n2. 电话预约：xxx-xxxxxxxx\n3. 现场挂号'
  },
  {
    id: 3,
    title: '核酸检测服务时间调整公告',
    summary: '即日起，我院核酸检测服务时间调整为每日8:00-20:00，请广大市民合理安排检测时间...',
    date: '2024-01-15',
    type: 'notice',
    typeName: '通知',
    content: '即日起，我院核酸检测服务时间调整如下：\n\n服务时间：每日8:00-20:00\n检测地点：医院北门核酸检测点\n\n注意事项：\n1. 请携带有效身份证件\n2. 采样前30分钟请勿进食、吸烟、饮酒\n3. 检测结果可通过医院APP查询\n\n如有疑问，请咨询电话：xxx-xxxxxxxx'
  },
  {
    id: 4,
    title: '医院停车系统升级公告',
    summary: '为提升患者就医体验，我院停车系统将于本周六进行升级改造，届时停车场将暂停使用...',
    date: '2024-01-12',
    type: 'notice',
    typeName: '通知',
    content: '为提升患者就医体验，我院停车系统将于本周六（1月13日）进行升级改造。\n\n升级时间：1月13日 6:00-18:00\n\n升级期间，院内停车场将暂停使用，请就诊患者选择公共交通或周边停车场停放车辆。\n\n给您带来的不便，敬请谅解！'
  },
  {
    id: 5,
    title: '我院荣获省级文明单位称号',
    summary: '近日，我院被授予"省级文明单位"荣誉称号，这是对我院多年来精神文明建设工作的充分肯定...',
    date: '2024-01-10',
    type: 'news',
    typeName: '新闻',
    content: '近日，我院被授予"省级文明单位"荣誉称号，这是对我院多年来精神文明建设工作的充分肯定。\n\n多年来，我院始终坚持"以患者为中心"的服务理念，不断提升医疗服务质量，优化就医流程，改善就医环境，赢得了广大患者和社会各界的一致好评。\n\n我院将以此为契机，继续深化文明创建工作，为人民群众提供更加优质、高效、便捷的医疗服务。'
  }
])

const viewNotice = (notice) => {
  uni.navigateTo({ 
    url: `/pages/hospital/announcement-detail?title=${encodeURIComponent(notice.title)}&content=${encodeURIComponent(notice.content)}`
  })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20rpx;
}

.notice-list {
  .notice-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    
    .notice-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;
      
      .notice-tag {
        padding: 6rpx 16rpx;
        border-radius: 6rpx;
        font-size: 22rpx;
        
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
      
      .notice-date {
        font-size: 24rpx;
        color: #999;
      }
    }
    
    .notice-title {
      display: block;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 12rpx;
    }
    
    .notice-summary {
      display: block;
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;
      margin-bottom: 16rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .notice-footer {
      .read-more {
        font-size: 26rpx;
        color: #2979ff;
      }
    }
  }
}
</style>
