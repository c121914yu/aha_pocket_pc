<template>
	<el-container class="projects">
		<!-- 推荐分类 -->
		<el-aside width="200px"></el-aside>
		<aside class="recommend-type">
			<strong>推荐分类</strong>
			<div 
				class="item"
				v-for="(item,i) in arr_recommendType"
				:key="i">
				<small>{{item.name}}</small>
			</div>
		</aside>
		<!-- 主体 -->
		<el-main class="container">
			<!-- 轮播广告 -->
			<aha-carousel :arr_carousel="gData.garr_carousel"></aha-carousel>
			<!-- 排序筛选 -->
			<!-- 项目列表 -->
			<div class="project-list">
				<div class="project-card">
					<project-card
						v-for="project in arr_projects"
						:key="project.id"
						:project="project">
					</project-card>
				</div>
			</div>
			<!-- 分页 -->
			<aha-paging :pageNum="pageNum" :is_loadAll="is_loadAll" @pageChange="loadProject"></aha-paging>
		</el-main>
		<!-- 每周推荐和最新推荐 -->
		<el-aside width="250px"></el-aside>
		<aside class="recommend-right">
			<div class="card hot">
				<strong>最热阅读</strong>
				<router-link 
					class="recommend hover-active"
					v-for="(item,i) in arr_recommendHot"
					:key="i"
					:to="`/project/${item.id}`">
					{{item.name}}
				</router-link>
			</div>
			<div class="card week">
				<strong>本周推荐</strong>
				<router-link
					class="recommend hover-active"
					v-for="(item,i) in arr_recommendWeek"
					:key="i"
					:to="`/project/${item.id}`">
					{{item.name}}
				</router-link>
			</div>
		</aside>
	</el-container>
</template>

<script>
import { getProjects } from "@/api/api_project.js"
import ProjectCard from "./components/ProjectCard.vue"
export default{
	components: {
		"project-card": ProjectCard
	},
	data(){
		return{
			pageNum: 1,
			pageSize: 20,
			is_loadAll: false,
			comId: null,
			awardLevel: null,
			sortBy: "read",
			arr_projects: [],
			arr_recommendType: [],
			arr_recommendHot: [],
			arr_recommendWeek: [],
		}
	},
	created() {
		console.log(this.gData.garr_carousel);
		this.loadProject(1)
		this.arr_recommendType = this.gData.garr_competitions.slice(0,30)
	},
	methods:{
		/**
		 * 加载项目
		 */
		loadProject(pageNum)
		{
			this.gShowLoading()
			this.is_loadAll = false
			this.pageNum = pageNum
			getProjects({
				pageNum,
				pageSize: this.pageSize,
				compId: this.comId,
				awardLevel: this.awardLevel,
				sortBy: this.sortBy
			})
			.then(res => {
				console.log(res.data);
				this.arr_projects = res.data.pageData
				this.arr_recommendHot = this.arr_projects.slice(0,5)
				this.arr_recommendWeek = this.arr_projects.slice(5,10)
				if(res.data.pageSize < this.pageSize) {
					this.is_loadAll = true
				}
			})
			.finally(() => this.gHideLoading())
		}
	}
}
</script>

<style lang="stylus" scoped>
.projects
	padding 10px 5%
	background-color var(--white1)
	.recommend-type
		position fixed
		left 5%
		width 200px
		height calc(100vh - 70px)
		padding 5px 0
		box-shadow var(--shadow1)
		background-color #FFFFFF
		border-radius 4px
		overflow hidden
		white-space nowrap
		text-align center
		.item
			padding 5px 0
			border-radius 22px
			cursor pointer
			overflow hidden
			&:hover
				background-color #f4f4f4
	.recommend-right
		position fixed
		right 5%
		width 250px
		.card
			margin-bottom 10px
			padding 5px
			box-shadow var(--shadow1)
			background-color #FFFFFF
			border-radius 4px
			.recommend
				margin 5px 0
				padding 5px
				border-radius 8px
				font-size 14px
				color var(--origin1)
				text-decoration underline
				display block
	.container
		z-index 10
		margin 0 10px
		box-shadow var(--shadow1)
		border-radius 4px
		background-color #FFFFFF
		.el-carousel__item
			background-color var(--origin2)
		.project-card
			border-bottom var(--border2)
			&:last-of-type
				margin-bottom 10px
				border-bottom none
</style>
