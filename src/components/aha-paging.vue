<!-- 
	普通分页器，只能显示当前页
	author yjl
	@paegChange {Number} pageNum 最新页码数
 -->
<template>
	<div class="aha-paging">
		<el-button
			icon="el-icon-arrow-left" 
			size="mini"
			:disabled="pageNum===1"
			@click="$emit('pageChange',pageNum-1)">
		</el-button>
		<span class="pagenum">{{pageNum}}</span>
		<el-button
			icon="el-icon-arrow-right" 
			size="mini"
			:disabled="is_loadAll"
			@click="$emit('pageChange',pageNum+1)">
		</el-button>
	</div>
</template>

<script>
export default{
	props: {
		/* 当前页码数量 */
		pageNum: {
			type: Number,
			required: true
		},
		/* 是否加载完毕 */
		is_loadAll: {
			type: Boolean,
			required: true
		}
	},
}
</script>

<style lang="stylus" scoped>
/* 分页器 */
.aha-paging
	display flex
	align-items center
	justify-content center
	.pagenum
		margin 0 10px
		color var(--origin1)
	.el-button
		width 30px
		height 30px
		padding 0
		background-color #f4f4f5
</style>
