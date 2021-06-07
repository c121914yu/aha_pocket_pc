import _this from '../main.js';

function request (url,method,data,config={}) {
	const defaultConfig = {
		timeout: 10000,
		cancelToken: null,
		...config
	}
	return	axios.request({
				baseURL: process.env.VUE_APP_URL,
				url,
				method,
				headers: {
					Authorization: localStorage.getItem("token")
				},
				timeout: defaultConfig.timeout,
				data: method === "GET" ? null : data,
				params: method === "GET" ? data : null,
				cancelToken: defaultConfig.cancelToken
			})
			.then(res => {
				if(res.headers.authorization){
					console.log(res.headers);
					/* 更新token */
					localStorage.setItem("token",res.headers.authorization)
				}
				return res.data
			})
			.catch(err => {
				if(err.request && err.request.status === 0) {
					_this.gShowError("请求时错误")
				}
				else if(err.response){
					if(err.response.data.code === 103){
						/* 如果请求的token和存储的不同，则重发.否则清除token */
						console.log(err.response.config.headers);
						if(err.response.config.headers.Authorization !== localStorage.getItem("token")) {
							console.log("重发");
							return request(url,method,data,config)
						}
						else {
							_this.gShowError("登录凭证已过期!")
							localStorage.removeItem("token")
							_this.gData.gLoginPath = _this.$route.path
							_this.$router.push("/login")
						}
					}
					else if(err.response.data.msg){
						_this.gShowError(err.response.data.msg)
					}
				}
				else {
					_this.gShowError("未知错误")
				}
				console.error(err)
				return err
			})
}

export default request