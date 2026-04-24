<template>
  <div class="app-layout">
    <router-view />
    <van-tabbar v-if="showTabbar" v-model="activeTab" active-color="#4facfe" inactive-color="#999" route>
      <van-tabbar-item name="home" to="/" icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item name="departments" to="/departments" icon="shop-o">科室</van-tabbar-item>
      <van-tabbar-item name="appointments" to="/appointments" icon="records">预约</van-tabbar-item>
      <van-tabbar-item name="profile" to="/profile" icon="manager-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = computed(() => {
  const path = route.path
  if (path === '/') return 'home'
  if (path.startsWith('/departments')) return 'departments'
  if (path.startsWith('/appointments')) return 'appointments'
  if (path.startsWith('/profile')) return 'profile'
  return ''
})

const hideTabbarRoutes = ['/login', '/register', '/forgot-password']
const showTabbar = computed(() => !hideTabbarRoutes.includes(route.path))
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: #f5f7fa;
}
</style>
