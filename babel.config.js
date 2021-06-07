module.exports = {
	presets: [
		'@vue/cli-plugin-babel/preset'
	],
	"plugins": [
		[
			"component",
			{
				"libraryName": "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/system_static",
				"styleLibraryName": "theme"
			}
		]
	]
}
