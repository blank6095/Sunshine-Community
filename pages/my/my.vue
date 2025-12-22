<template>
	<view class="" style="display: flex; align-items: center; height: 300rpx; background-color: skyblue;">
		<view class="" style="display: flex; flex-wrap: wrap; align-items: center;">
			<up-avatar style="width: 64px; height: 64px;"></up-avatar>
			<view class="" style="display: flex;flex-direction: column;justify-content: center;">
				<text>{{user?user.userName:null}}</text>
				<text @click="login()">{{user?user.communityName:"请登录"}}</text>
			</view>
			<image src="/static/icon/shezhi.png" mode="" style="width: 24rpx;height: 24rpx; margin-top: 40rpx;" v-if="user"></image>
		</view>
	</view>
	
	<view class="item">
		<text>基础服务</text>
		<view class="item-container">
			<view v-for="(item,index) in infoList" :key="index" 
			class="item" @click="goto(item.title)">
				<image :src="item.iocn" mode=""></image>
				<text>{{item.title}}</text>
			</view>
		</view>
	</view>
	<view class="card">
		<up-cell-group>
			<up-cell title="设置" @click="tishi()" isLink></up-cell>
			<up-cell title="房屋认证" isLink></up-cell>
			<up-cell title="退出登录" isLink v-if="user" @click="logout()"></up-cell>
		</up-cell-group>
	</view>
</template>
<script setup>
import { ref } from 'vue';
import {isLogin} from '../../utils/request.js'
import {onLoad} from '@dcloudio/uni-app'
const user=ref(uni.getStorageSync('user'))
const infoList=[
	{title:"业主信息",iocn:"/static/service/trumpet.png"},
	{title:"我的车位",iocn:"/static/service/park.png"},
	{title:"访客通行",iocn:"/static/service/lock.png"},
	{title:"投诉咨询",iocn:"/static/service/phone.png"},
	{title:"投票问卷",iocn:"/static/service/love.png"}
]
const tishi=()=>{
	uni.showToast({
		title:"设置暂未开放"
	})
}
const goto=(e)=>{
	if(e==="我的车位"){
		isLogin('/pages/park/park')
	}
	if(e==="业主信息"){
		isLogin('/pages/ownerInfo/ownerInfo')
	}
}
onLoad(()=>{
	user.value=uni.getStorageSync('user')
	console.log(user.value);
})
const logout=()=>{
	uni.removeStorageSync('user')
	uni.removeStorageSync('personal')
	uni.reLaunch({
		url:'/pages/my/my'
	})
}
const login=()=>{
	uni.reLaunch({
		url:'/pages/login/login'
	})
}
</script>

<style scoped lang="scss">
	       
</style>
