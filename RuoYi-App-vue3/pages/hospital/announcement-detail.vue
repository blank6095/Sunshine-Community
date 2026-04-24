<template>
  <view class="container">
    <view class="detail-header">
      <text class="detail-title">{{ title }}</text>
      <text class="detail-date">{{ currentDate }}</text>
    </view>
    <view class="detail-content">
      <text>{{ content }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const title = ref('')
const content = ref('')
const currentDate = ref('')

onLoad((options) => {
  if (options.title) {
    title.value = decodeURIComponent(options.title)
    uni.setNavigationBarTitle({ title: title.value })
  }
  if (options.content) {
    content.value = decodeURIComponent(options.content)
  }
  
  const date = new Date()
  currentDate.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #fff;
}

.detail-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  
  .detail-title {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    line-height: 1.4;
    margin-bottom: 16rpx;
  }
  
  .detail-date {
    display: block;
    font-size: 26rpx;
    color: #999;
  }
}

.detail-content {
  padding: 30rpx;
  
  text {
    font-size: 30rpx;
    color: #333;
    line-height: 1.8;
  }
}
</style>
