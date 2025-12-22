<template>
	<view class="card">
		<up-cell-group title="车位信息">
			<up-cell title="车牌号" :value="carInfo.carNum"></up-cell>
			<up-cell title="车位号" :value="carInfo.areaNum"></up-cell>
		</up-cell-group>
	</view>
	<up-button type="primary" plain text="申请车位" @click="isLogin('/pages/parkApply/parkApply')"/>
</template>
<script setup>
import { ref } from 'vue';
import { DEFAULT_COMMUNITY_ID } from '../../utils/config';
import { apiGet } from '../../utils/request';
import {onLoad} from '@dcloudio/uni-app'
import { isLogin } from '../../utils/request';
const carInfo=ref({
	carNum:"",
	areaNum:""
})
const getInfo=async()=>{
	const res=await apiGet('/app/owner.queryAppOwnerCars',{
		page:1,
		row:10,
		communityId:DEFAULT_COMMUNITY_ID
	})
	if(!res===0){
		uni.showToast({
			icon:'error',
			title:'访问车位信息失败'
		})
		return
	}
	carInfo.value=res.data.data[0]

}
onLoad(()=>{
	getInfo()
})
</script>

<style scoped lang="scss">
	       
</style>
