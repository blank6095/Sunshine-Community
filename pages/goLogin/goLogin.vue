<template>
	<view class="item">
		<text>非常抱歉，此功能需要登录后才能体验</text>
		<button @click="login()">我要登录</button>
	</view>
</template>
<script setup>
import { ref } from 'vue';
const login=()=>{
	uni.redirectTo({
		url:"/pages/login/login"
	})
}
</script>

<style scoped lang="scss">
	       
</style>
