<!-- 
	轮播图
	author yjl
 -->
<template>
	<div class="carousel">
		<el-carousel
			class="carousel"
			:interval="4000" 
			type="card" 
			:height="height">
			<el-carousel-item 
				class="item"
				v-for="item in arr_carousel" 
				:key="item.id">
				<el-image :src="item.pictureUrl"></el-image>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
export default{
	props: {
		/**
		 * pictureUrl 图片地址
		 */
		arr_carousel: {
			type: Array,
			required: true
		},
		height: {
			type: Number,
			default: 250
		}
	}
}
</script>

<style scoped>
	
</style>
