<!-- 
	用户等级组件，根据点数自动计算
	author yjl
-->
<template>
	<div 
		class="user-level"
		:style="{
			'background-color': backgroundColor,
			'color': color,
			'font-siize': small ? '14px' : '16px',
			'padding': small ? '0 6px 0 20px' : '0 10px 0 25px'
		}">
		<img 
			:style="{
				'width': small ? '16px' : '20px'
			}"
			class="img"
			:src="userLevel.src">
		</img>
		<span>{{userLevel.label}}</span>
	</div>
</template>

<script>
export default {
	name:"aha-user-level",
	props: {
		point: {
			type: Number,
			default: 0
		},
		small: {
			type: Boolean,
			default: false
		},
		backgroundColor: {
			type: String,
			default: "#f8b86b"
		},
		color: {
			type: String,
			default: "#ffffff"
		}
	},
	data(){
		return {
			userLevel: null,
		}
	},
	watch: {
		point: {
			handler: function(val){
				this.userLevel =  this.gData.garr_userLevel.find(item => this.point < item.totalContribPoint)
			},
			immediate: true
		}
	}
}
</script>

<style lang="stylus" scoped>
.user-level
	position relative
	border-radius 22px
	font-size 14px
	display flex
	align-items center
	.img
		position absolute
		left 0
		top 0
		width 20px
		height 25px
</style>
