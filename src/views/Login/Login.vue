<template>
	<div class="login">
		<h1>登录Aha口袋</h1>
		<el-form ref="loginForm" label-width="60px" :rules="Rules" :model="loginFrom">
			<el-form-item label="手机" prop="phone">
				<el-input type="phone" v-model="loginFrom.phone" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input type="password" v-model="loginFrom.password" autocomplete="off"></el-input>
			</el-form-item>
			<el-button type="primary" @click="onclickLogin">登录</el-button>
		</el-form>
	</div>
</template>

<script>
import { api_login } from '@/api/api_user.js'
import { loginRule } from "@/utils/rules.js"
export default {
	data() {
		return {
			Rules: loginRule,
			loginFrom: {
				phone: "",
				password: ""
			}
		}
	},
	methods: {
		/**
		 * 点击登录，校验表单，触发登录接口
		 */
		onclickLogin() {
			this.$refs["loginForm"].validate(valid => {
				if (!valid) return
				api_login(this.loginFrom)
				.then(res => {
					this.gShowSucess("登录成功！")
					/* 设置全局个人信息 */
					this.gData.gUserInfo = res.data.personalUserInfo
					localStorage.setItem("token",res.data.token)
					/* 恢复路径 */
					this.$router.replace(this.gData.gLoginPath)
					this.gData.gLoginPath = "/"
					this.gData.gBUS.$emit("loginSuccess")
				})
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.login
	position fixed
	top 50%
	left 50%
	transform translate(-50%, -50%)
	width 400px
	padding 30px
	background-color #ffffff
	box-shadow var(--shadow1)
	border-radius var(--radius2)
	h1
		margin-bottom 10px
		text-align center
	.login-form
		.el-form
			width 100%
		.el-input
			margin 10px 0
	.el-button
		width 100%
		display block
</style>
