<!-- 
	顶部导航
	author yjl
 -->
<template>
	<div class="top-nav">
		<!-- logo -->
		<div class="logo" title="Aha首页">
			<img src="https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png">
			<span>Aha口袋</span>
		</div>
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
		<div v-if="userInfo" class="user">
			<avatar :src="userInfo.avatarUrl" size="40"></avatar>
			<span class="name">{{userInfo.nickname}}</span>
		</div>
		<!-- 上传项目 发起组队 帖子 外包 -->
		<el-dropdown 
			class="create"
			show-timeout="0">
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
</template>

<script>
export default{
	data(){
		return{
			arr_routes: [
				{label: "主页", value: "home",path: "/"},
				{label: "项目", value: "project",path: "/project/160"},
				{label: "组队", value: "team",path: "/"},
				{label: "论坛", value: "forum",path: "/"},
				{label: "外包", value: "outsourcing",path: "/"},
			],
			activeRoute: "home",
			searchType: "", //搜索类型
			searchText: "",
			userInfo: null, // 用户信息
			createSelectMsg: "", // 创作选择文字
		}
	},
	created() {
		this.userInfo = this.gData.gUserInfo.userInfo
		this.gData.gBUS.$on("loginSuccess",() => {
			this.userInfo = this.gData.gUserInfo.userInfo
		})
	},
	methods:{
		
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
		flex 1
		max-width 500px
		border-radius 4px
		overflow hidden
		.el-select
			width 80px
			color var(--font2)
	.user
		flex 1
		cursor pointer
		display flex
		align-items center
		.name
			margin 0 10px
	.create-msg
		cursor pointer
		padding 5px 10px
		border-radius 4px
		background-color var(--origin2)
		color #FFFFFF
		i
			margin-left 0
			transition .3s
		&:hover i
			transform rotate(180deg)
</style>
