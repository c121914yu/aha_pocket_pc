<!-- 
	评论内容，写 & 读
	author yjl
 -->
<template>
	<div class="comments-content">
		<!-- 写评论 -->
		<div v-if="userInfo" class="write">
			<div class="left">
				<avatar :src="userInfo.avatarUrl" size="40"></avatar>
			</div>
			<div class="right">
				<div class="inpunt-area">
					<el-input
						type="textarea"
						resize="none"
						:autosize="{ minRows: 2, maxRows: 5}"
						placeholder="发表你的评论"
						maxlength="1000"
						v-model="commentContent">
					</el-input>
				</div>
				<div class="select-file">
					<el-select 
						v-model="commentTarget" 
						placeholder="请选择评论目标"
						size="small">
						<el-option
							v-for="file in arr_targets"
							:key="file.id"
							:label="file.name"
							:value="file.id">
							</el-option>
					</el-select>
					<el-rate
						v-if="commentTarget > 0"
						class="score"
						show-score
						text-color="#ff9900"
						score-template="{value}"
						v-model="commentScore">
					</el-rate>
					<div style="flex: 1;"></div>
					<el-button type="primary" size="mini" round @click="onclickAdd">发表评论</el-button>
				</div>
			</div>
		</div>
		<!-- 未登录提示 -->
		<div v-else class="un-login">
			请
			<span @click="toLogin">登录</span>
			后参与评论
		</div>
		<!-- 评论内容 -->
		<div class="comment-list">
			<div 
				class="comment"
				v-for="(comment,i) in arr_comments"
				:key="comment.commentId">
				<div class="left">
					<avatar :src="comment.user.avatarUrl" size="30"></avatar>
				</div>
				<div class="right">
					<div class="comment-content">
						<span class="nickname">{{comment.user.nickname}}: </span>
						<span style="margin-left: 5px;" class="content">{{comment.content}}</span>
						<span class="time">{{gformatDate(comment.time)}}</span>
						<el-popover
							placement="bottom"
							width="160"
							trigger="hover"
							close-delay="0"
							v-model="visible">
								<ul class="comment-control-menu">
									<!-- <li>查看用户主页</li> -->
									<li @click="gCopyText(comment.content,'已复制评论!')">复制评论</li>
									<li v-if="comment.user.userId === userInfo.userId" @click="deleteComment(i)">删除评论</li>
								</ul>
								<i class="el-icon-more" slot="reference"></i>
						</el-popover>
					</div>
					<!-- 针对目标 -->
					<div v-if="comment.target" class="target">
						<small>{{comment.target.filename}}</small>
						<el-rate
							v-model="comment.target.score"
							disabled
							show-score
							text-color="#ff9900"
							score-template="{value}">
						</el-rate>
					</div>
				</div>
			</div>
			<div v-if="is_loadAll" class="no-comment">没有更多数据...</div>
		</div>
		<!-- 分页器 -->
		<div class="paging">
			<el-button 
				icon="el-icon-arrow-left" 
				size="mini"
				:disabled="pageNum===1"
				@click="pageChange(pageNum-1)">
			</el-button>
			<span class="pagenum">{{pageNum}}</span>
			<el-button
				icon="el-icon-arrow-right" 
				size="mini"
				:disabled="is_loadAll"
				@click="pageChange(pageNum+1)">
			</el-button>
		</div>
	</div>
</template>

<script>
import { api_getProjectComments,api_getProjectPubComments,postFileComment,postPublicComment,deleteFileComment,deletePublicComment } from "@/api/api_project.js"
export default{
	props: {
		projectId:{
			type: Number,
			required: true
		},
		/* 评论目标，如果为空，不显示提示框 */
		arr_resources: {
			type: Array,
			default: () => []
		}
	},
	data(){
		return{
			/* 评论 */
			arr_comments: [],
			pageNum: 1,
			pageSize: 5,
			is_loadAll: false,
			userInfo: null,
			commentContent: "",
			commentTarget: 0,
			commentScore: 5
		}
	},
	computed: {
		/**
		 * 评论对象筛选
		 */
		arr_targets() {
			return [{id: 0,name: "公开评论"},...this.arr_resources.filter(item => item.isBuy).map(item => ({
				id: item.id,
				name: item.name
			}))]
		}
	},
	created() {
		this.userInfo = this.gData.gUserInfo.userInfo
		this.loadComments()
	},
	methods:{
		/**
		 * 页码变化
		 * @param {Number} page 当前页码数量
		 */
		pageChange(page)
		{
			this.pageNum = page
			this.loadComments()
		},
		/**
		 * 加载获取评论
		 */
		loadComments()
		{
			this.is_loadAll = false
			this.gShowLoading()
			const params = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				projectId: this.projectId
			}
			Promise.all([api_getProjectComments(params),api_getProjectPubComments(params)])
			.then(res => {
				const fileComments = res[0].data.pageData
				const publicComments = res[1].data.pageData
				this.arr_comments = []
				fileComments.concat(publicComments).forEach(comment => {
					const data = {
						commentId: comment.id || comment.resourceId,
						isMe: this.userId === comment.user.userId,
						time: comment.time,
						content: comment.comment,
						user: comment.user
					}
					if(comment.resourceId){
						const file = this.arr_resources.find(item => item.id === comment.resourceId)
						data.target = {
							filename: file.name,
							score: comment.score
						}
					}
					this.arr_comments.push(data)
				})
				this.arr_comments.sort((a,b) => new Date(b.time) - new Date(a.time))
				if(fileComments.length  < this.pageSize && publicComments.length < this.pageSize) {
					this.is_loadAll = true
				}
			})
			.finally(() => this.gHideLoading())
		},
		/**
		 * 前往登录页，记录当前的地址
		 */
		toLogin()
		{
			this.gData.gLoginPath = this.$route.path
			this.$router.replace("/login")
		},
		/**
		 * 点击添加评论
		 */
		onclickAdd()
		{
			if(!this.commentContent) {
				return
			}
			let p
			/* 公开评论 */
			this.gShowLoading()
			if(this.commentTarget === 0) {
				p = postPublicComment({
						projectId: this.projectId,
						comment: this.commentContent
					})
			}
			/* 附件评价 */
			else {
				p = postFileComment({
						resourceId: this.commentTarget,
						score: this.commentScore,
						comment: this.commentContent
					})
			}
			p.then(res => {
				this.commentContent = ""
				this.commentScore = 5
				this.commentTarget = 0
				this.gShowSucess("评论成功")
				this.pageChange(1)
			})
			.catch(err => this.gHideLoading())
		},
		/**
		 * 删除评论
		 * @param {Number} i
		 */
		deleteComment(i)
		{
			const comment = this.arr_comments[i]
			this.gConfirm("确认删除该评论?",async() => {
				this.gShowLoading()
				if(comment.target) {
					await deleteFileComment(comment.commentId)
				}
				else {
					await deletePublicComment(comment.commentId)
				}
				this.gShowWarn("删除评论成功!")
				/* 如果第一页，则刷新第一页 */
				if(this.pageNum === 1) {
					this.pageChange(1)
				}
				/* 非第一页，如果只有一条数据则返回上一页，否则更新当前页 */
				else {
					this.pageChange(this.arr_comments.length === 1 ? this.pageNum-1 : this.pageNum)
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.comment-control-menu
	list-style none
	li
		padding 5px
		cursor pointer
		&:hover
			background-color rgba(248,184,107,0.3)
.comments-content
	.write
		display flex
		.right
			margin-left 10px
			flex 1
			.select-file
				margin-top 10px
				display flex
				align-items center
				.score
					margin-left 5px
	.un-login
		padding 5px
		text-align center
		span
			color var(--origin2)
			font-weight 700
	.comment-list
		margin 10px 0
		.comment
			padding 10px 0
			border-bottom var(--border2)
			display flex
			&:last-of-type
				border none
			.right
				margin-left 10px
				flex 1
				.comment-content
					display flex
					align-items center
					.nickname
						color var(--gray1)
						font-size 14px
					.time
						margin 0 5px
						color var(--gray2)
						font-size 12px
					i
						cursor pointer
						&:hover
							color var(--origin2)
				.target
					color var(--gray2)
					display flex
					align-items center
					small
						margin-right 5px
	/* 分页器 */
	.no-comment
		text-align center
		color var(--gray2)
		font-size 14px
	.paging
		margin 10px 0
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
