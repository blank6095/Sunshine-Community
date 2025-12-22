<template>
	
	<view class="card">
		<up-cell-group class="" title="小区信息">
			<up-cell title="小区编码" :value="uni.getStorageSync('personal').communityId"></up-cell>
			<up-cell title="小区名字" :value="uni.getStorageSync('user').communityName"></up-cell>
		</up-cell-group>
	</view>
	<view class="card">
		<up-cell-group title="业主信息">
			<up-cell title="姓名" :value="uni.getStorageSync('personal').name"></up-cell>
			<up-cell title="手机号" :value="uni.getStorageSync('personal').link"></up-cell>
		</up-cell-group>
	</view>
</template>

<script setup>
import { apiGet } from '../../utils/request';
import { DEFAULT_COMMUNITY_ID } from '../../utils/config';
import {onLoad} from '@dcloudio/uni-app'
import {ref} from 'vue'
const info=ref()

onLoad(()=>{
	
})

</script>

<style lang="scss">
</style>