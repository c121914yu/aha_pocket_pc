/* 表单规则 */

/**
 * 手机校验
 */
const checkPhone = (rule, value, callback) => {
	if (!value){
		return callback(new Error('手机号不能为空'))
	} 
	else {
		const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
		if (reg.test(value)){
			callback();
		} 
		else {
			return callback(new Error('手机号格式错误'))
		} 
	}
}

/**
 * 登录校验
 */
export const loginRule = {
	phone: [{ validator: checkPhone }],
	password: [{ required: true, message: '密码不能为空' }]
}