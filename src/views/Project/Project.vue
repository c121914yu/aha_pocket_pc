<!-- 
	项目详细页
	author yhl
	path /project/:projectId
 -->
<template>
	<div class="read-project">
		<div class="left">
			<!-- 成员信息 -->
			<div class="members">
				<el-button v-if="is_anonymous" class="claim">点击认领该匿名项目</el-button>
				<div v-else>
					<h3>项目成员</h3>
					<router-link 
						class="member hover-active"
						v-for="member in arr_members"
						:key="member.memberUser.userId"
						to="#">
						<avatar :src="member.memberUser.avatarUrl" size="50"></avatar>
						<div class="user-info">
							<div class="nickname">{{member.memberUser.nickname}}</div>
							<div class="job">{{member.job}}</div>
						</div>
					</router-link>
				</div>
			</div>
			<!-- 目录 -->
			<ul v-if="arr_catalogue.length > 0" class="catalogue">
				<h3>目录</h3>
				<li
					v-for="(item,index) in arr_catalogue"
					:key="index"
					@click="scrollToDOM(index)">
					{{index+1}}. {{item}}
				</li>
			</ul>
		</div>
		<!-- 主要内容 -->
		<div class="right">
			<main class="card">
				<!-- 项目标题 -->
				<h1>{{name}}</h1>
				<header>
					<!-- 匿名 | 原创标记 -->
					<div 
						:style="{
							'background-color': is_anonymous ? 'var(--gray2)' : 'var(--origin2)'
						}"
						class="copyright">
						{{is_anonymous ? "匿名项目" : "原创项目"}}
					</div>
					<div class="project-info">
						<!-- 标签 -->
						<div class="item tags">
							<label>项目标签:</label>
							<aha-tags :tags="tags | splitTags" border="var(--border1)"></aha-tags>
						</div>
						<!-- 获奖情况 -->
						<div class="item prize">
							<label>获奖情况:</label>
							<div class="value">{{awardTime}},{{compName}},{{awardLevel}}</div>
						</div>
					</div>
				</header>
				<!-- 介绍 -->
				<div class="rich-text" v-html="intro" @click="gRichTextPreviewImg"></div>
				<!-- 分享 收藏 阅读量 -->
				<footer>
					<div class="item">
						<i style="margin-right: 3px;" class="iconfont icon-eye"></i>
						<span>{{read}}</span>
					</div>
					<div 
						class="item collect"
						:class="is_collect ? 'active' : ''"
						@click="onclickCollect">
						<i style="margin-right: 3px;" :class="is_collect ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
						<span style="margin-right: 3px;">{{is_collect ? "已收藏" : "收藏"}}</span>
						<span>{{collect}}</span>
					</div>
					<div class="item can-click" @click="scrollToDOM('project-files')">
						<i style="margin-right: 3px;" class="el-icon-files"></i>
						<span>附件{{arr_resources.length}}</span>
					</div>
					<div class="item can-click" @click="scrollToDOM('project-comments')">
						<i style="margin-right: 3px;" class="el-icon-s-comment"></i>
						<span>评论</span>
					</div>
					<div class="item can-click" @click="gCopyText(currentUrl,'已复制地址!')">
						<i style="margin-right: 3px;" class="el-icon-share"></i>
						<span>分享</span>
					</div>
				</footer>
			</main>
			<!-- 附件 -->
			<div v-if="!is_anonymous" id="project-files" class="files card">
				<h3>项目附件</h3>
				<ul v-if="is_showFiles">
					<li
						class="file"
						v-for="(file,i) in arr_resources"
						:key="file.id">
						<file-card 
							:file="file" 
							@payFile="file.isBuy=true">
						</file-card>
					</li>
				</ul>
			</div>
			<!-- 评论 -->
			<div id="project-comments" class="card comments">
				<project-comment 
					v-if="projectId && is_showFiles"
					:projectId="projectId"
					:arr_resources="arr_resources">
				</project-comment>
			</div>
		</div>
	</div>
</template>

<script>
import { api_getProject,isCollectedProject,collectProject,cancleCollectProject } from "@/api/api_project.js"
import { api_getPurchasedFiles } from "@/api/api_order.js"
import FileCard from "./components/FileCard.vue"
import Comments from "./components/Comments.vue"
export default{
	components: {
		"file-card": FileCard,
		"project-comment": Comments
	},
	data(){
		return{
			currentUrl: window.location.href,
			userId: 0,
			/* 匿名项目认领相关 */
			is_anonymous: false,
			applyingID: 0,
			/* 项目相关 */
			is_passed: true,
			projectId: null,
			avatarUrl: 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png',
			name: '项目标题',
			arr_members: [],
			read: 0,
			collect: 0,
			is_collect: false,
			/* 获奖相关 */
			awardLevel: '',
			awardTime: '',
			compName: '',
			tags: '', // 标签
			intro: '',
			arr_catalogue: [], // 目录
			/* 附件分类 */
			arr_resources: [],
			is_showFiles: false,
		}
	},
	created() {
		this.userId = this.gData.gUserInfo.userInfo.userId
		this.gShowLoading()
		api_getProject(this.$route.params.projectId)
		.then(res => {
			console.log(res.data);
			this.is_anonymous = res.data.isAnonymous
			this.is_passed = res.data.passed
			this.projectId = res.data.id
			this.avatarUrl = res.data.avatarUrl
			this.name = res.data.name
			this.arr_members = res.data.members.sort((a, b) => a.rank - b.rank)
			this.read = res.data.read
			this.collect = res.data.collect
			this.tags = res.data.tags
			this.awardLevel = this.gData.garr_prizeLevels.find(item => item.value === res.data.awardLevel).label
			this.awardTime = res.data.awardTime
			this.compName = res.data.compName
			this.arr_resources = res.data.resources
			
			/* 解析介绍文本，获取目录 */
			const parse = this.gParseRichText(res.data.intro,true)
			this.arr_catalogue = parse.catalogue
			this.intro = parse.text
			
			/* 附件初始化 */
			this.initFiles()
			/* 判断是否收藏 */
			isCollectedProject(this.projectId)
			.then(res => {
				this.is_collect = res.data
			})
		})
		.finally(() => this.gHideLoading())
	},
	methods:{
		/**
		 * 初始化附件,判断是否为项目成员，如果是全放在已购买里。若不是，根据已购记录判断
		 */
		initFiles()
		{
			/* 判断是否为项目成员,若为项目成员则直接添加到已购项目中 */
			const member = this.arr_members.find(item => item.memberUser.userId === this.userId)
			api_getPurchasedFiles(this.projectId)
			.then(res => {
				this.arr_resources.forEach(file => {
					if(member) {
						file.isBuy = true
					}
					else {
						file.isBuy = res.data.indexOf(file.id) > -1 ? true : false
					}
				})
			})
			.finally(() => this.is_showFiles = true)
		},
		/**
		 * 点击收藏，根据当前收藏状态判断，收藏项目还是取消收藏，修改收藏状态及项目收藏数量
		 */
		onclickCollect()
		{
			/* 本是收藏的，取消收藏 */
			if (this.is_collect) {
				cancleCollectProject(this.projectId)
			} 
			/* 本是未收藏的收藏 */
			else {
				collectProject(this.projectId)
			}
			this.is_collect = !this.is_collect
		},
		/**
		 * 滚动至指定ID
		 * @param {String}  id
		 */
		scrollToDOM(id)
		{
			const dom_comment = document.getElementById(id)
			window.scrollTo({ 
				top: dom_comment.offsetTop, 
				behavior: "smooth" 
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.read-project
	min-height 100vh
	padding 10px 80px
	background-color var(--white1)
	.left
		z-index 1
		position fixed
		width 300px
		.members
			margin-bottom 10px
			max-height 40vh
			border-radius 8px
			padding 10px
			box-shadow var(--shadow1)
			background-color #FFFFFF
			.member
				padding 10px 0
				border-bottom 1px solid var(--boder-color1)
				display flex
				&:last-of-type
					border none
				.user-info
					margin-left 10px
					font-size 14px
		/* 目录 */
		.catalogue
			max-height 40vh
			border-radius 8px
			padding 10px
			background-color #FFFFFF
			box-shadow var(--shadow1)
			list-style none
			li
				padding 5px
				border-radius 8px
				cursor pointer
				&:hover
					background-color rgba(248,184,107,0.2)
	.right
		z-index 10
		position relative
		margin-left 310px
		.card
			box-shadow var(--shadow1)
			border-radius 8px
			background-color #FFFFFF
		main
			/* 项目介绍，头部标注信息 */
			h1, .rich-text
				padding 10px 20px
			header
				margin 0 20px
				background-color var(--white1)
				display flex
				align-items flex-start
				/* 版权归属 */
				.copyright
					padding 5px
					color #FFFFFF
					text-align center
					border-bottom-right-radius 8px
				.project-info
					flex 1
					padding 10px 10px 10px 15px
					label
						margin-right 10px
						color var(--font3)
						font-size 14px
					.item
						display flex
						flex-wrap wrap
						align-items center
					.tags label
						margin-bottom 5px
					.prize
						margin 5px 0
			footer
				position sticky
				bottom 0
				padding 10px 15px
				font-size 14px
				border-top var(--border1)
				background-color #f4f4f4
				color var(--gray1)
				display flex
				align-items center
				user-select none
				.item
					margin-right 20px
					i
						font-size 16px
				.can-click
					cursor pointer
					&:hover
						color var(--origin2)
				/* 收藏 */
				.collect
					cursor pointer
					&.active i
						color var(--red)
					 &:hover span
						color var(--red)
		.files, .comments
			margin-top 10px
			padding 10px 20px
			ul
				margin 5px 0
				list-style none
				.hint
					padding 0 10px
					border-radius 8px
					color #FFFFFF
					background-color var(--origin2)
					display inline-block
				li
					margin-bottom 15px
</style>
