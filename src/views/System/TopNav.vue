<!-- 
	顶部导航
	author yjl
 -->
<template>
	<div class="top-nav">
		<!-- logo -->
		<router-link class="logo" title="Aha首页" to="/projects">
			<img src="https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png">
			<span>Aha口袋</span>
		</router-link>
		<!-- 导航区 -->
		<div class="routes">
			<router-link
				class="hover-active"
				:class="activeRoute === route.value ? 'active' : ''"
				v-for="route in arr_routes"
				:key="route.value"
				:to="route.path">
				{{route.label}}
			</router-link>
		</div>
		<!-- 内容搜索区 -->
		<div class="search">
			<el-input 
				class="input-with-select" 
				placeholder="请输入搜索内容" 
				size="small"
				v-model="searchText">
				<el-select slot="prepend" placeholder="类型" v-model="searchType">
					<el-option label="项目" value="1"></el-option>
					<el-option label="团队" value="2"></el-option>
					<el-option label="帖子" value="3"></el-option>
					<el-option label="外包" value="4"></el-option>
				</el-select>
				<el-button class="search-icon" slot="append" icon="el-icon-search"></el-button>
			</el-input>
		</div>
		<!-- 用户 -->
		<div v-if="userInfo.userId>0" class="user-info">
			<div class="outer-avatar">
				<avatar :src="userInfo.avatarUrl" size="35"></avatar>
			</div>
			<div class="info">
				<div class="nickname">{{userInfo.nickname}}</div>
				<!-- 用户等级 -->
				<div class="user-level">
					<user-level :point="obj_statistics.totalContribPoint"></user-level>
				</div>
				<!-- 统计数据 -->
				<div class="statistics">
					<!-- 项目 团队 帖子数量 -->
					<div class="item">
						<h2 class="amount">{{obj_statistics.totalProject}}</h2>
						<div class="label">项目</div>
					</div>
					<div class="item">
						<h2 class="amount">{{obj_statistics.totalTeam}}</h2>
						<div class="label">团队</div>
					</div>
					<div class="item">
						<h2 class="amount">{{obj_statistics.totalForum}}</h2>
						<div class="label">帖子</div>
					</div>
				</div>
				<!-- 钱包 -->
				<div class="statistics">
					<div class="item">
						<h2 class="amount">{{ahaCredit}}</h2>
						<div class="label">Aha币</div>
					</div>
					<div class="item">
						<h2 class="amount">{{ahaPoint}}</h2>
						<div class="label">Aha点</div>
					</div>
				</div>
				<!-- 操作菜单 -->
				<div class="route">
					<div class="item" @click="onclickLoginout">
						<i class="iconfont icon-tuichu"></i>
						<span>退出登录</span>
					</div>
				</div>
			</div>
		</div>
		<!-- 登录提醒 -->
		<div v-else class="unlogin" @click="toLogin">
			点击登录
		</div>
		<div style="flex: 1;"></div>
		<div v-if="userInfo.userId>0">
			<!-- 上传项目 发起组队 帖子 外包 -->
			<el-dropdown show-timeout="0">
				<div class="create-msg">
					创建项目
					<i class="el-icon-arrow-down el-icon--right"></i>
				</div>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item>创建项目</el-dropdown-item>
					<el-dropdown-item>创建团队</el-dropdown-item>
					<el-dropdown-item>发布讨论</el-dropdown-item>
					<el-dropdown-item>发布服务</el-dropdown-item>
					<el-dropdown-item>发布需求</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
import { api_getStatisticsInfo } from "@/api/api_user.js"
export default{
	data(){
		return{
			arr_routes: [
				{label: "主页", value: "Home",path: "/"},
				{label: "项目", value: "Projects",path: "/projects"},
				{label: "组队", value: "team",path: "/"},
				{label: "论坛", value: "forum",path: "/"},
				{label: "外包", value: "outsourcing",path: "/"},
			],
			activeRoute: "home",
			searchType: "", //搜索类型
			searchText: "",
			userInfo: {}, // 用户信息
			ahaPoint: 0,
			ahaCredit: 0,
			obj_statistics: {
				totalContribPoint: 0,
				totalProject: 0,
				totalTeam: 0,
				totalForum: 0,
			},
			createSelectMsg: "", // 创作选择文字
		}
	},
	watch: {
		"$route": {
			handler: function(route) {
				this.activeRoute = route.name
			},
			immediate: true
		}
	},
	created() {
		this.initUserInfo()
		this.gData.gBUS.$on("loginSuccess",() => {
			this.initUserInfo()
		})
	},
	methods:{
		/**
		 * 初始化用户信息
		 */
		initUserInfo()
		{
			this.userInfo = this.gData.gUserInfo.userInfo
			this.ahaCredit = this.gData.gUserInfo.ahaCredit || 0
			this.ahaPoint = this.gData.gUserInfo.ahaPoint || 0
			/* 获取用户统计信息 */
			if(this.userInfo.userId > 0) {
				api_getStatisticsInfo(this.userInfo.userId)
				.then(res => {
					this.gData.gUserInfo.statistics = res.data
					this.obj_statistics.totalContribPoint = res.data.totalContribPoint
					this.obj_statistics.totalProject = res.data.totalProject
				})
			}
		},
		/**
		 * 点击退出登录
		 */
		onclickLoginout()
		{
			this.gConfirm("确认退出登录?",() => {
				localStorage.removeItem("token")
				location.reload()
			})
		},
		/**
		 * 前往登录页，记录当前的地址
		 */
		toLogin()
		{
			this.gData.gLoginPath = this.$route.path
			this.$router.replace("/login")
		}
	}
}
</script>

<style lang="stylus" scoped>
.search-icon
	background-color var(--origin2) !important
	color #FFFFFF !important
	padding 15px
	border-radius 0
.top-nav
	z-index 999
	position fixed
	top 0
	width 100%
	min-width 1100px
	height 50px
	padding 0 20px
	box-shadow var(--shadow1)
	background-color #FFFFFF
	display flex
	align-items center
	.logo
		cursor pointer
		display flex
		align-items center
		img
			width 30px
		span
			margin-left 5px
			color var(--origin1)
	.routes
		margin 0 15px
		height 46px
		line-height 46px
		a
			padding 0 15px
			border-bottom 4px solid transparent
			display inline-block
			&.active
				border-bottom-color var(--origin2)
	.search
		margin 0 15px
		flex auto
		max-width 500px
		border-radius 4px
		overflow hidden
		.el-select
			width 80px
			color var(--font2)
	.user-info
		margin-left 40px
		position relative
		&:hover
			.outer-avatar
				transform translate(-50%,50%) scale(1.4)
			.info
				display block
		.outer-avatar
			z-index 2
			position relative
			transition .1s
			transform translateX(-50%)
		.info
			z-index 1
			position absolute
			top 40px
			width 260px
			transform translateX(-50%)
			padding 30px 0 5px
			box-shadow var(--shadow1)
			border-radius 4px
			background-color #FFFFFF
			text-align center
			display none
			.user-level
				margin 5px 0
				display inline-block
			/* 统计数据 */
			.statistics
				margin-bottom 10px
				padding 5px 0
				border-top var(--border2)
				border-bottom var(--border2)
				display flex
				.item
					flex 1
					.label
						font-size 14px
						color var(--gray1)
		/* 操作菜单 */
		.route
			margin 5px 0
			.item
				padding 5px 10px
				text-align left
				cursor pointer
				&:hover
					background-color #f0f0f0
				span
					margin-left 10px
	.unlogin
		color var(--origin1)
		cursor pointer
		text-decoration underline
	.create-msg
		padding 5px 10px
		border-radius 4px
		background-color var(--origin2)
		color #FFFFFF
		cursor pointer
		i
			margin-left 0
			transition .3s
		&:hover i
			transform rotate(180deg)
</style>
