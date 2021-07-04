<!-- 
	图片全屏预览
	author yjl
 -->
<template>
	<el-image 
		ref="preview"
		style="visibility: hidden;"
		:src="$store.state.previewImg" 
		:preview-src-list="[$store.state.previewImg]">
	</el-image>
</template>

<script>
export default {
	mounted() {
		this.$refs.preview.clickHandler()
		const closeFun = this.$refs.preview.closeViewer
		this.$refs.preview.closeViewer = () => {
			closeFun()
			this.$store.commit("setPreviewImg",null)
		}
	}
}
</script>

<style lang="stylus" scoped>
</style>
