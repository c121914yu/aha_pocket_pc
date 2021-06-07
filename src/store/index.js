Vue.use( Vuex )
export default new Vuex.Store( {
	state: {
		loading: false,
	},
	mutations: {
		/**
		 * 设置加载动画
		 * @param {Object} type
		 */
		setLoading( state, type ) {
			state.loading = type
		}
	},
	actions: {},
	modules: {}
})
