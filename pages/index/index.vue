<template>
	<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="container">
		<swiper-item>
			<image src="/static/banner/banner1.png" mode="heightFix"></image>
		</swiper-item>
		<swiper-item>
			<image src="/static/banner/banner2.png" mode="heightFix"></image>
		</swiper-item>
	</swiper>
	<view class="item-container">
		<view class="item" v-for="(it,index) in service1List" :key="index">
			<image :src="it.icon" mode=""></image>
			<text>{{it.title}}</text>
		</view>
	</view>
	<view class="item">
		<view class="item-container">
			<text>基础服务</text>
			<text @click="goto()">更多</text>
		</view>
		<view class="item-container">
			<view class="item" v-for="(it,index) in service2List" :key="index" @click="goApply(it.title)">
				<image :src="it.icon" mode=""></image>
				<text>{{it.title}}</text>
			</view>
		</view>
	</view>
	<up-notice-bar :text="text1" mode="closable" speed="250" url="/pages/componentsB/tag/tag"></up-notice-bar>
	<view class="item-container" style="justify-content: space-around;">
		<view class="item" style="flex-direction: row; background-color: aliceblue;">
			<image src="/static/service/repair.png" mode="" @click="isLogin('/pages/baoxiu/baoxiu')"></image>
			<view class="item">
				<text>报事保修</text>
				<text>一键维修</text>
			</view>
		</view>
		<view class="item" style="flex-direction: row;background-color: aliceblue;" @click="contact()">
			<image src="/static/service/building.png" mode=""></image>
			<view class="item" @click="">
				<text>联系物业</text>
				<text>一件搞定</text>
			</view>
		</view>
	</view>
	<view style="display: flex;flex-direction: column; align-items: center;">
		<text>社区活动</text>
		<image src="/static/banner/community.png" mode=""></image>
	</view>
</template>

<script setup>
	import {
		isLogin
	} from '../../utils/request.js'
	const service1List = [{
			title: "咨询投诉",
			icon: "/static/service/phone.png"
		},
		{
			title: "家庭成员",
			icon: "/static/service/family.png"
		},
		{
			title: "访客通行",
			icon: "/static/service/lock.png"
		},
	]
	const service2List = [{
			title: "生活缴费",
			icon: "/static/service/living.png"
		},
		{
			title: "房屋费",
			icon: "/static/service/house.png"
		},
		{
			title: "车位申请",
			icon: "/static/service/love.png"
		},
		{
			title: "一键开门",
			icon: "/static/service/door.png"
		}
	]
	const goto = (e) => {


		uni.switchTab({
			url: '/pages/service/service'
		})


	}
	const contact = () => {
		if (!uni.getStorageSync('user')) {
			uni.showToast({
				title: "请登录"
			})
			return
		}
		uni.showModal({
			title: "拨打电话",
			content: "您确认拨打，阳光小区物业客服电话吗？"+uni.getStorageSync('user').communityTel,
			cancelText: "取消",
			confirmText: "确认",
			success: (e) => {
				if(e.confirm){
					uni.makePhoneCall({
						phoneNumber: uni.getStorageSync('user').communityTel
					})
				}
				
			},
			fail: () => {
				return
			}
		})
	}

	const goApply = (e) => {
		if (e === "车位申请") {
			isLogin('/pages/parkApply/parkApply')
		}
		console.log(e);
	}
</script>

<style lang="scss">
	.img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>