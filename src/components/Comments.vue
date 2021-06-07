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
					<el-select v-if="arr_files.length>0" v-model="commentTarget" placeholder="请选择评论目标">
						<el-option
							v-for="file in arr_files"
							:key="file.id"
							:label="file.name"
							:value="file.id">
							</el-option>
					</el-select>
					<el-button type="primary" size="small" round @click="onclickAdd">发表评论</el-button>
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
				v-for="comment in arr_comments"
				:key="comment.id">
				<avatar :src="comment.user.avatarUrl" size="30"></avatar>
				<div class="right">
					<div class="comment-content">
						
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	props: {
		/* 如果包含回复，应包含replies字段 */
		arr_comments: {
			type: Array,
			default: () => []
		},
		/* 选择文件，如果为空，不显示提示框 */
		arr_files: {
			type: Array,
			default: () => []
		}
	},
	data(){
		return{
			userInfo: null,
			commentContent: "",
			commentTarget: ""
		}
	},
	created() {
		this.userInfo = this.gData.gUserInfo.userInfo
		console.log(this.arr_comments);
	},
	methods:{
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
			this.$emit("addComment", {
				content: this.commentContent,
				target: this.commentTarget
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.comments-content
	.write
		display flex
		.right
			margin-left 10px
			flex 1
			.select-file
				margin-top 10px
				.el-button
					float right
	.un-login
		padding 5px
		text-align center
		span
			color var(--origin2)
			font-weight 700
</style>
