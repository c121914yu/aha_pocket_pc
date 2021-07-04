Vue.use( Vuex )
export default new Vuex.Store( {
	state: {
		loading: false,
		previewImg: null,
		arr_carousel: [], // 轮播图
	},
	mutations: {
		/**
		 * 设置加载动画
		 * @param {Object} type
		 */
		setLoading( state, type ) {
			state.loading = type
		},
		/**
		 * 设置预览图片
		 */
		setPreviewImg(state,url) {
			state.previewImg = url
		},
		/**
		 * 设置轮播图
		 */
		setCarousel(state,data) {
			state.arr_carousel = data
		}
	},
	actions: {},
	modules: {}
})
