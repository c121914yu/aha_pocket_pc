import Vue from 'vue'
import { MessageBox,Message } from "element-ui"
import store from "@/store"

/**
 * gShowSucess - 成功提示
 * gShowWarn - 警告提示
 * gShowError - 报错提示
 * gConfirm - 提示确认框
 * gformatDate - 格式化日期
 * gUploadFile - 上传文件
 * gGetFileUrl - 根据签名获取COS文件地址
 * gSelectFile - 选择文件
 * gBinaryToBase64Img - 二进制转base64图片
 * gCopyText - 复制文本
 */

// Vue.prototype.$prompt = MessageBox.prompt

/**
 * 成功提示弹窗
 * @param {String} msg 提示文本 
 * @param {Number}  duration 持续时间
 */
Vue.prototype.gShowSucess = (msg,duration=2000) => {
	Message({
		message: msg,
		type: 'success',
		duration
	})
}

/**
 * 警告提示弹窗
 */
Vue.prototype.gShowWarn = (msg,duration=2000) => {
	Message({
		message: msg,
		type: 'warning',
		duration
	})
}

/**
 * 错误提示弹窗
 */
Vue.prototype.gShowError = (msg,duration=2000) => {
	Message({
		message: msg,
		type: 'error',
		duration
	})
}

/**
 * 确认提示框
 * @param {String}  msg 提示内容
 * @param {Function}  success 确认后执行内容
 * @param {Function}  fail 取消后执行内容
 */
Vue.prototype.gConfirm = (msg,success,fail=null) => {
	MessageBox.confirm(msg,"提示",{
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
	.then(success)
	.catch(fail)
}

/**
 * 展示和隐藏加载动画
 */
Vue.prototype.gShowLoading = () => {
	store.commit("setLoading",true)
}
Vue.prototype.gHideLoading = () => {
	store.commit("setLoading",false)
}


/* 
	name: formatDate
	desc: 格式化日期成yy/mm/dd HH:mm
	input: Date
	return: String
*/
/**
 * 格式化日期
 * @param {String}  time 字符串日期
 * @param {Boolean}  abb 是否简写
 * @param {Boolean}  wrap 是否换行
 * @return {String}
 */
Vue.prototype.gformatDate = (time,abb=true,wrap=false) => {
	const date = new Date(time)
	const year = date.getFullYear() 
	const month = date.getMonth() + 1 
	const day = date.getDate() 
	const hour = date.getHours()
	const minutes = date.getMinutes() 
	const second = date.getSeconds()
	
	const nDay = new Date()
	const nyear = nDay.getFullYear()
	const nmonth = nDay.getMonth() + 1
	const nday = nDay.getDate()
	if(abb) {
		if(year === nyear && month === nmonth && day === nday){
			return `${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}:${second < 10 ? '0'+second : second}`
		}
		if(year === nyear){
			return `${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day} ${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}:${second < 10 ? '0'+second : second}`
		}
	}
	if(wrap){
		return `${year < 10 ? '0'+year : year}/${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day}\n${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}:${second < 10 ? '0'+second : second}`
	}
	return `${year < 10 ? '0'+year : year}/${month < 10 ? '0'+month : month}/${day < 10 ? '0'+day : day} ${hour < 10 ? '0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}:${second < 10 ? '0'+second : second}`
}

/**
 * 文件上传
 * @param {File}  file input选择的文件
 * @param {Object}  signature 签名
 * @param {Function}  updateFunc 上传进程函数
 * @return {String} 文件路径
 */
Vue.prototype.gUploadFile = (file,signature,updateFunc=null) => {
	return new Promise((resolve,reject) => {
		let formData = new FormData()
		formData.append("key",signature.filename)
		formData.append("policy",signature.policy)
		formData.append("q-sign-algorithm","sha1")
		formData.append("q-ak",signature.secretId)
		formData.append("q-key-time",signature.keyTime)
		formData.append("q-signature",signature.signature)
		formData.append("file",file)
		axios({
			url: `https://${signature.bucketName}.cos.${signature.region}.myqcloud.com`,
			method: "POST",
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data"
			},
			onUploadProgress: (progressEvent) => {
				if(updateDom){
					updateFunc(Math.round(progressEvent.loaded / progressEvent.total * 100) | 0)
				}
			}
		})
		.then(res => {
			if(res.status === 204){
				resolve(res.config.url + signature.filename)
			}
			else{
				reject(res)
			}
		})
		.catch(err => {
			reject(err)
		})
	})
}

/**
 * 获取文件URL
 * @param {Object}  sign 签名
 */
Vue.prototype.gGetFileUrl = (sign) => {
	return new Promise((resolve,reject) => {
		let cos
		try{
			cos = new COS({
			   getAuthorization: (options, callback) => {
				   callback({
				       Authorization: sign.authorization
				   })
			   }
			})
		} catch(err){
			reject(err)
		}
		
		cos.getObjectUrl({
		    Bucket: sign.bucketName,
		    Region: sign.region, 
		    Key: sign.filename,
		    Sign: true
		}, (err, data) => {
			if(err){
				reject(err)
			}
			else{
				resolve(data.Url)
			}
		})
	})
}

/**
 * 选择文件
 * @param {Element} Input对象
 * @param {String} 文件类型 
 * @return {Object[]} 附件和
 */
Vue.prototype.gSelectFile = (dom,type="") => {
	const reg = new RegExp(`${type}`,"g")
	const data = []
	for(const file of dom.files) {
		console.log(file);
	}
	// if(reg.test(file.type)){
	// 	return{
	// 		file,
	// 		url: window.URL.createObjectURL(file)
	// 	}
	// }
	// else{
	// 	this.$showError(`格式错误: ${type}`)
	// 	return false
	// }
}

/**
 * 二进制文件转base64图片
 * @param {Binary} 二进制数据
 * @return {String} base64字符串
 */
Vue.prototype.gBinaryToBase64Img = (binary) => {
	let u8 = ''
	let bytes = new Uint8Array(binary)
	for (let i=0;i<bytes.byteLength;i++) {
		u8 += String.fromCharCode(bytes[i])
	}
	return 'data:image/jpeg;base64,' + window.btoa(u8)
}

/**
 * 复制到剪切板
 * @param {String}  text
 */
Vue.prototype.gCopyText = (copyText,msg="") => {
	const textarea = document.querySelector("#copy-area") //创建input对象
	textarea.value = copyText
	textarea.select()
	document.execCommand("copy",false,null) //执行复制
	Vue.prototype.gShowSucess(msg,1000)
}

