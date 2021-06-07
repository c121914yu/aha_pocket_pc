<template>
	<div class="up-project">
		<BaseInfo 
			ref="baseInfo" 
			class="item"
			@createProject="createProject">
		</BaseInfo>
		<IntroInfo ref="introInfo" class="item"></IntroInfo>
	</div>
</template>

<script>
import { getComps,postProject,postMember } from "@/api/api_project.js"
import BaseInfo from "./components/BaseInfo.vue"
import IntroInfo from "./components/Intro.vue"
export default{
	data(){
		return{
			userInfo: null
		}
	},
	components:{
		BaseInfo,
		IntroInfo
	},
	created() {
		localStorage.setItem("token",this.$route.params.token)
		/* 获取个人信息 */
		getMe()
		.then(res => {
			this.userInfo = res.data
			console.log(this.userInfo);
		})
		/* 获取比赛信息 */
		getComps()
		.then(res => {
			this.$store.state.arr_competitions = res.data
		})
	},
	methods: {
		/* 创建项目，调用创建API，成功后跳转边界界面 */
		createProject(e)
		{
			/* 获取Intro */
			e.intro = this.$refs.introInfo.html
			/* 调用API创建项目，获取到项目ID */
			postProject(e)
			.then(res => {
				/* 创建一个项目成员 */
				postMember(res.data,{
					memberUserId: this.userInfo.userInfo.userId,
					rank: 1,
					job: "负责人",
					editable: true
				})
				this.$showSuccess("创建成功")
				/* 跳转项目编辑界面 */
				this.$router.push(`/project/edit/${res.data}/${localStorage.getItem("token")}`)
			})
		}
	}
}
</script>

<style lang="stylus">
.up-project
	min-width 1000px
	display grid
	grid-template-columns 1fr 2fr
	.item
		padding 5px
	.form
		margin-top 10px
		.el-input
			margin-right 10px
			width 300px
</style>
