<!-- 
	项目通用头像组件
	author yjl
-->
<template>
	<div 
		class="avatar"
		:style="{
			'width': `${size}px`,
		}"
		@click="readImg">
		<img 
			class="img" 
			:start="{
				'cursor': is_readed ? 'pointer' : 'default'
			}"
			:src="src || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'">
		</img>
	</div>
</template>

<script>
export default {
	name:"aha-avatar",
	props: {
		src: {
			type: String,
			default: ""
		},
		size: {
			type: Number,
			default: 70
		},
		is_readed: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		/**
		 * 大图预览照片
		 */
		readImg()
		{
			if(this.readed){
				this.gReadImage([this.src])
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
.avatar
	display flex
	align-items center
	overflow hidden
	.img
		width 100%
		height 100%
		border-radius 50%
		object-fit contain
</style>
