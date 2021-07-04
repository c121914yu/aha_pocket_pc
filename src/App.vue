<template>
	<div v-if="is_loaded" id="app">
		<top-nav v-show="!$route.meta.hideTop"></top-nav>
		<!-- 顶部导航 -->
		<div 
			:style="{
				'padding-top': $route.meta.hideTop ? '0' : '50px'
			}"
			class="container">
			<router-view/>
		</div>
		<!-- 大图预览 -->
		<read-img  v-if="$store.state.previewImg"></read-img>
		<!-- 拷贝元素 -->
		<textarea id="copy-area" style="width: 0;height: 0;"></textarea>
		<!-- 加载动画 -->
		<load-animation v-show="$store.state.loading"></load-animation>
	</div>
	<load-animation v-else></load-animation>
</template>

<script>
import { api_getMe } from "./api/api_user.js"
import { api_getComps } from "./api/api_project.js"
import { api_getCarousel } from "./api/api_system.js"
import Loading from './views/System/load-animation.vue'
import TopNav from './views/System/TopNav.vue'
import ReadImg from './views/System/PreviewImg'
export default {
	components: {
		"load-animation": Loading,
		"top-nav": TopNav,
		"read-img": ReadImg
	},
	data() {
		return {
			is_loaded: false
		}
	},
	async created() {
		this.loginSuccess()
		const token = localStorage.getItem("token")
		if(token) {
			try {
				const user = await api_getMe()
				this.gData.gUserInfo = user.data ? user.data : this.gData.gUserInfo
			} catch(err) {
				console.log(err)
			}
			this.is_loaded = true
		}
		else {
			this.is_loaded = true
		}
	},
	methods: {
		/**
		 * 登录成功
		 */
		loginSuccess()
		{
			Promise.all([api_getComps(),api_getCarousel()])
			.then(res => {
				this.gData.garr_competitions = res[0].data
				this.gData.garr_carousel = res[1].data
			})
		}
	}
}
</script>

<style lang="stylus">
@import './styles/common.styl'
#app
	min-width 1100px
.container
	position relative
</style>
