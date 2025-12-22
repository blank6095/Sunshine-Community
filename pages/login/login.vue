<template>
	<view class="login-page">
		<view class="center">
			<up-avatar size="80"></up-avatar>
		</view>
		<up-form :model="form" class="form-content">
			<up-form-item label="用户名" prop="username" label-width="100rpx">
				<up-input v-model="form.username" border="bottom" placeholder="请输入手机号"></up-input>
			</up-form-item>
			<up-form-item label="密码" prop="password" label-width="100rpx">
				<up-input v-model="form.password" type="password" border="bottom" placeholder="请输入密码"></up-input>
			</up-form-item>
		</up-form>
		<up-button type="primary" class="mt" @click="submit">登录</up-button>
		<up-button type="success" class="mt" @click="quickLogin">注册账号</up-button>
		<view class="flex checkbox">
			<up-checkbox v-model:checked="agree" :usedAlone="true" class="mt"></up-checkbox>
			我已阅读并同意《用户协议》和《隐私政策》
		</view>
		<up-toast ref="toastRef"></up-toast>
	</view>
</template>
<script setup>
	import {ref} from 'vue'
	import {apiPost} from '../../utils/request.js'
	const form = ref({
		username: '14755449966',
		password: '123456'
	})


	const agree = ref(false)
	const toastRef = ref(null)

	const submit = async () => {
		if (!agree.value) {
			return toastRef.value && toastRef.value.show({
				type: 'error',
				message: '请先同意协议'
			})
		}
		try {
			const res = await apiPost('/app/user.ownerUserLogin', form.value, false)
			const data = res.data || {}
			if (data.code === 0) {
				const info = data.data || {}
				uni.setStorageSync('token', info.token || '')
				uni.setStorageSync('user', info)
				uni.setStorageSync('communityId', info.communityId || '')

				uni.showToast({
					icon: 'success',
					title: "登录成功",
					duration: 1000
				})

				const timer = setTimeout(() => {
					uni.reLaunch({
						url: '/pages/my/my',
						// 兜底处理：如果跳转失败（比如页面路径错误），清除定时器
						fail: () => {
							clearTimeout(timer)
						}
					})
					clearTimeout(timer)
				}, 1000)
				const infoLoad=async ()=>{
					const res=await apiGet('/app/owner.queryCurrentOwner',{
						page:1,
						row:10,
						communityId:DEFAULT_COMMUNITY_ID
					})
					console.log(res.data.data);
					uni.setStorageSync('personal',res.data.data)
				}
				infoLoad()
			} else {
				toastRef.value && toastRef.value.show({
					type: 'error',
					message: data.msg || '登录失败'
				})
			}
		} catch (e) {
			toastRef.value && toastRef.value.show({
				type: 'error',
				message: '网络异常'
			})
		}
	}

	const quickLogin = () => {
		uni.navigateTo({
			url: '/pages/register/register'
		})
	}
</script>

<style scoped lang="scss">
	.login-page {
		padding: 40rpx;
		box-sizing: border-box;
	}

	.center {
		height: 400rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.form-content {
		margin-bottom: 20rpx;
	}

	.mt {
		margin-top: 20rpx;
	}

	.checkbox {
		margin-top: 40rpx;
		font-size: 32rpx;
		align-items: center;
	}
</style>