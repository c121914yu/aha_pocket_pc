<template>
	<div v-if="is_loaded" id="app">
		<top-nav></top-nav>
		<!-- 顶部导航 -->
		<div class="container">
			<router-view/>
		</div>
		<!-- 拷贝元素 -->
		<textarea id="copy-area" style="width: 0;height: 0;"></textarea>
		<!-- 加载动画 -->
		<load-animation v-show="$store.state.loading"></load-animation>
	</div>
</template>

<script>
import { api_getMe } from "./api/api_user.js"
import Loading from './views/System/load-animation.vue'
import TopNav from './views/System/TopNav.vue'
export default {
	components: {
		"load-animation": Loading,
		"top-nav": TopNav,
	},
	data() {
		return {
			is_loaded: false
		}
	},
	created() {
		const token = localStorage.getItem("token")
		if(token) {
			api_getMe()
			.then(res => {
				this.gData.gUserInfo = res.data ? res.data : this.gData.gUserInfo
			})
			.finally(() => this.is_loaded = true)
		}
		else {
			this.is_loaded = true
		}
	}
}
</script>

<style lang="stylus">
@import './styles/common.styl'
#app
	min-width 1080px
.container
	position relative
	padding-top 50px
</style>
