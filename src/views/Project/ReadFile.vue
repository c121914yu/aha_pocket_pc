<!-- 
	html预览文件
	author yjl
	path /project/file/:fileId
-->
<template>
	<div class="read-file"></div>
</template>

<script>
import { api_getFileLoadSign,api_getFileHtml } from "@/api/api_project.js"
export default{
	data(){
		return{
			html: ""
		}
	},
	created() {
		console.log(this.$route.params);
		this.gShowLoading()
		api_getFileLoadSign(Number(this.$route.params.fileId))
		.then(sign => {
			console.log(sign);
			return api_getFileHtml(sign.data)
		})
		.then(async (res) => {
			const demo = COSDocPreviewSDK.config({
				mode: 'normal',
				mount: document.querySelector('.read-file'),
			    url: res.data.PreviewUrl,
				commonOptions: {
				    isShowTopArea: true, //隐藏顶部区域（头部和工具栏）。
				    isShowHeader: false //隐藏头部区域。
				},
				wordOptions: {
					isShowDocMap: true, // 展示目录
					isBestScale: false, // 最佳比例打开
					isShowBottomStatusBar: true // 底部状态栏
				},
				pdfOptions: {
					isShowComment: false, // 不展示注释
					isInSafeMode: true, // 安全模式
					isShowBottomStatusBar: true
				},
				pptOptions: {
					isShowBottomStatusBar: true
				}
			})
			this.gHideLoading()
			try {
				await demo.ready()
				demo.WordApplication().ActiveDocument.ActiveWindow.DocumentMap = true // 显示目录
				demo.WordApplication().ActiveDocument.ActiveWindow.View.ShowComments = true // 显示评论
			} catch(err) {
				console.error(err)
			}
		})
		.catch(err => {
			this.gShowError("获取HTML失败")
		})
		.finally(() => this.gHideLoading())
	}
}
</script>

<style lang="stylus" scoped>
.read-file 
	position fixed
	top 0
	left 0
	right 0
	bottom 0
</style>