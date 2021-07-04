Vue.use(VueRouter)

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

const loginRoute = [
	{
		path: '/login',
		name: 'Login',
		meta: {
			login: false,
			hideTop: true
		},
		component: () => import('../views/Login/Login.vue')
	},
]

const projectRoute = [
	{
		path: '/projects',
		name: 'Projects',
		meta: {
			login: true,
		},
		component: () => import('../views/Project/Projects.vue')
	},
	{
		path: '/project/:projectId',
		name: 'Project',
		meta: {
			login: true,
		},
		component: () => import('../views/Project/Project.vue')
	},
	{
		path: '/project/file/:fileId',
		name: 'Project',
		meta: {
			login: true,
			hideTop: true
		},
		component: () => import('../views/Project/ReadFile.vue')
	}
]

const routes = [
	...projectRoute,
	...loginRoute,
	{
		path: '/',
		name: 'Home',
		meta: {
			login: false,
		},
		component: () => import('../views/Aha-home.vue')
	},
	{
		path: '/resume/:id/:token',
		name: 'Resume',
		meta: {
			login: true
		},
		component: () => import('../views/Users/Resume.vue')
	},
	{
		path: '/project/up/:token',
		name: 'UpProject',
		meta: {
			login: true
		},
		component: () => import('../views/Project/UpProject.vue')
	},
	{
		path: '/project/edit/:projectId/:token',
		name: 'EditProject',
		meta: {
			login: true
		},
		component: () => import('../views/Project/EditProject.vue')
	},
	{
		path: '*',
		component: () => import('../views/404.vue')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

/**
 * 路由拦截，判断如果是需要登录的页面需要有个人信息
 * 无token直接跳登录
 * 有token判断有无个人信息，无个人信息则请求getMe进行token校验
 */
router.beforeEach((to,from,next) => {
	if(to.meta.login && !localStorage.getItem("token")){
		Vue.prototype.gShowWarn("请先登录")
		Vue.prototype.gData.gLoginPath = to.fullPath
		next("/login")
	}
	else {
		next()
	}
})

export default router
