<!-- 
	通用标签组件
	author yjl
-->
<template>
	<div class="tags">
		<div 
			:style="{
				'background-color': bgColor,
				'color': Color,
				'padding': padding,
				'border': border,
				'border-radius': circle ? '22px' : '8px'
			}"
			class="tag"
			v-for="(tag,index) in tags"
			:key="index">
			<small>{{tag}}</small>
		</div>
	</div>
</template>

<script>
export default {
	name:"aha-tags",
	props: {
		tags: {
			type: Array,
			default: () => []
		},
		bgColor: {
			type: String,
			default: "#FFFFFF"
		},
		Color: {
			type: String,
			default: "var(--origin1)"
		},
		padding: {
			type: String,
			default: "0 10px"
		},
		border: {
			type: String,
			default: "1px solid var(--boder-color1)"
		},
		circle: {
			type: Boolean,
			default: false
		}
	}
}
</script>

<style lang="stylus" scoped>
.tags
	display flex
	flex-wrap wrap
	align-items center
	.tag
		margin 0 5px 5px 0
		font-size 14px
</style>
