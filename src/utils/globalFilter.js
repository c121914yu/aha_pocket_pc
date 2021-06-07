/**
 * 分割Tags字符串
 * @param {String}  tags 以空格分开的字符串转化成数组
 */
Vue.filter("splitTags", (tags) => {
	if(tags){
		return tags.split(" ").filter(tag => tag !== '')
	}
	return []
})