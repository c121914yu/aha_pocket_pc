<template>
	<div class="load-animation">
	   <div class="load-content">
			<i class="iconfont icon-start loader-star"></i>
			<div class="loader-circles"></div>
	   </div>
	</div>
</template>

<style lang="stylus" scoped>
.load-animation
	z-index 9999
	position fixed
	top 0
	left 0
	right 0
	bottom 0
	background-color rgba(8, 9, 21, 0.4)
	display flex
	align-items center
	justify-content center
	.load-content
		position relative
		width 100px
		height 100px
		.loader-star
			position absolute
			left 30px
			top 30px
			width 40px
			height 40px
			color #18FFFF
			animation loader-star 1s ease-in-out alternate infinite
			display flex
			align-items center
			justify-content center
		.loader-circles
			width 8px
			height 8px
			background #18ffff
			border-radius 50%
			position absolute
			left calc(50% - 4px)
			top calc(50% - 4px)
			animation loader-circles 1s ease-in-out alternate infinite
@keyframes loader-star
	0%
		transform rotate(0deg) scale(1.4)
	50%
		transform rotate(180deg) scale(0.7)
	100%
		transform rotate(360deg) scale(0)
@keyframes loader-circles
	0%
		opacity 1
		transform rotate(0)
		box-shadow 25px -22px #18ffff, 15px -22px 0 -3px #18ffff, 31px 2px #18ffff, 21px 2px 0 -3px #18ffff, 23px 25px #18ffff, 13px 25px 0 -3px #18ffff, 0px 33px #18ffff, -10px 33px 0 -3px #18ffff, -26px 24px #18ffff, -19px 17px 0 -3px #18ffff, -32px 0px #18ffff, -23px 0px 0 -3px #18ffff, -25px -23px #18ffff, -16px -23px 0 -3px #18ffff, 0px -31px #18ffff, -2px -23px 0 -3px #18ffff
	50%
		box-shadow 24px -22px #18ffff, 30px -15px 0 -3px #18ffff, 31px 0px #18ffff, 29px 9px 0 -3px #18ffff, 24px 23px #18ffff, 17px 30px 0 -3px #18ffff, 0px 33px #18ffff, -10px 28px 0 -3px #18ffff, -24px 22px #18ffff, -29px 14px 0 -3px #18ffff, -31px -3px #18ffff, -30px -11px 0 -3px #18ffff, -20px -25px #18ffff, -12px -30px 0 -3px #18ffff, 5px -29px #18ffff, 13px -25px 0 -3px #18ffff
		transform rotate(180deg)
	100%
		box-shadow 0 0 0 #18ffff
		opacity 0
		transform rotate(360deg)
</style>
