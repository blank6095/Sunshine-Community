<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-plus/index.scss";
	.item-container{
		display: flex;
		margin: 20rpx;
		justify-content: space-between;
		align-items: center;
		.item{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin: 20rpx;
			image{
				width: 100rpx;
				height: 100rpx;
			}
		}
	}
	.card{
		background-color: white;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		border-radius: 12rpx;
		overflow: hidden;
		margin: 24rpx;	
	}
	
	
</style>