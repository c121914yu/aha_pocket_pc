import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

/* 注册md编辑器 */
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

/* 注册全局变量 */
import "./utils/globalData.js"
/* 注册全局事件 */
import "./utils/globalFun.js"
/* 注册全局filter */
import "./utils/globalFilter.js"
/* 注册全局组件 */
import "./utils/RegisterComponent.js"

const app =  new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')

export default app
