<template>
	<view class="card">
		<up-cell-group title="车位申请">
			<up-cell title="车牌号">
				<template #right-icon>
					<input type="text" placeholder="请输入车牌号" v-model="parkInfo.carNum"/>
				</template>
			</up-cell>
			<up-cell title="品牌">
				<template #right-icon>
					<input type="text" placeholder="请输入品牌" v-model="parkInfo.carBrand"/>
				</template>
			</up-cell>
			<up-cell title="颜色">
				<template #right-icon>
					<input type="text" placeholder="请输入颜色" v-model="parkInfo.carColor"/>
				</template>
			</up-cell>
			<up-cell title="车牌号">
				<template #right-icon>
					<picker mode="selector" :range="types" @change="chiose">
						<view>{{types[typeIndex]}}</view>
					</picker>
				</template>
			</up-cell>
			<up-cell title="备注">
				<template #right-icon>
					<input type="text" placeholder="请输入备注" v-model="parkInfo.remark"/>
				</template>
			</up-cell>
		</up-cell-group>
	</view>
	<view class="card">
		<button type="primary" @click="submit()">提交申请</button>
		<button type="default">查看申请进度</button>
	</view>
</template>
<script setup>
import { ref } from 'vue';
import {apiPost} from '../../utils/request.js'
const parkInfo=ref({
	carNum:'',
	carBrand:"",
	carColor:"",
	remark:"",
	carType:"",
	communityId: "2025072783670006",
	ownerId: uni.getStorageSync('personal').memberId,
	state: uni.getStorageSync('personal').ownerTypeCd,
	applyPersonName: uni.getStorageSync('personal').name,
	applyPersonLink: uni.getStorageSync('personal').link,
	applyPersonId: uni.getStorageSync('personal').ownerId,
	userId: uni.getStorageSync('personal').ownerId
})
const typeCode=ref(0)
const typeIndex=ref(0)
const types=["家用小汽车","客车","货车"]
const chiose=(e)=>{
	typeIndex.value=e.detail.value
	typeCode.value=typeIndex.value+9001
	parkInfo.value.carType=typeCode.value
}
const submit=async()=>{
	if(!parkInfo.value.carBrand||!parkInfo.value.carNum){
		uni.showToast({
			icon:'none',
			title:"请完善信息"
		})
		return
	}
	const res=await apiPost("/app/parkingSpaceApply.saveParkingSpaceApply",parkInfo)
	if(res.data.code===0){
		uni.showToast({
			icon:'success',
			title:"车位申请成功"
		})
	}
		
	else{
		uni.showToast({
			icon:'error',
			title:"车位申请失败"
		})
	}
}
</script>

<style scoped lang="scss">
	input{
		text-align: end;
	}   
	button{
		margin: 20rpx;
	}
</style>
