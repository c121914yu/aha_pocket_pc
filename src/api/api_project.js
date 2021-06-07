import request from '../utils/request.js'

/**
 * 获取比赛信息
 */
export const api_getComps = (data) => request("/competition","GET")

/**
 * 根据ID加载项目
 * @param {Number} projectId
 */
export const api_getProject = (projectId) => request(`/project/${projectId}`,"GET")

/**
 * 获取项目评论
 * @param {Object} params
 */
export const api_getProjectComments = (params) => request("/project/resource/score","GET",params)

/**
 * 获取项目公开评论
 */
export const api_getProjectPubComments = ({projectId,...params}) => request(`/project/discuss/${projectId}`,"GET",params)


/**
 * 发布评论
 * @param {Number}  resourceId 附件ID
 * @param {Number} score 评分
 * @param {String}  comment 内容
 */
export const postFileComment = ({resourceId,...data}) => request(`/project/resource/score/${resourceId}`,"POST",data)

/**
 * 新建公开评论
 * @param {Number}  projectId 项目ID
 * @param {String}  comment 内容
 */
export const postPublicComment = (data) => request(`/project/discuss`,"POST",data)

/**
 * 删除评价
 * @param {Number}  projectResourceId
 */
export const deleteFileComment = (projectResourceId) => request(`/project/resource/score/${projectResourceId}`,"DELETE")

/**
 * 删除公开评论
 * @param {Number}  commentId
 */
export const deletePublicComment = (commentId) => request(`/project/discuss/${commentId}`,"DELETE")

/**
 * 判断是否申领过匿名资源
 */
/**
 * 判断是否收藏
 * @param {Number}  projectId
 */
export const isCollectedProject = (projectId) => request(`/project/collection/check/${projectId}`,"GET")

/**
 * 收藏项目
 * @param {Number}  projectId
 */
export const collectProject = (projectId) => request(`/project/collection/${projectId}`,"POST")

/**
 * 取消收藏项目
 * @param {Number}  projectId
 */
export const cancleCollectProject = (projectId) => request(`/project/collection/${projectId}`,"DELETE")

/* 获取下载签名 */
/**
 * 获取附件下载签名
 * @param {Number} fileId
 */
export const api_getFileLoadSign = (fileId) => request(`/project/resource/${fileId}/sign/download `,"GET")

/*
 * 获取文档的html内容
 * @param {Object} sign
 */
export const api_getFileHtml = (sign) => axios.get(`https://${sign.bucketName}.cos.${sign.region}.myqcloud.com${sign.filename}`,{
									params: {
										"ci-process": "doc-preview",
										"dstType": "html",
										"sign": sign.authorization,
										"copyable": "0", // 不可复制
										"weboffice_url": "1"
									}
								})

/**
 * 获取项目文件上传签名
 * @param {Number} projectId
 * @param {String} filename
 */
export const api_getUpfileSign = (projectId,filename) => request(`/project/${projectId}/resources/sign/upload/private?filename=${filename}`,"GET")

/* 创建项目数据，保存至数据库 */
// export function postProject(data){
// 	return request({
// 		url: "/project",
// 		method : "POST",
// 		data
// 	})
// }
// /* 修改项目信息*/
// export function putProject(data){
// 	return request({
// 		url: `/project/${data.id}`,
// 		method : "PUT",
// 		data
// 	})
// }
// /* 获取项目所有资源信息 */
// export function getResources(params){
// 	return request({
// 		url: `/project/${params.projectId}/resources`,
// 		method : "GET",
// 		params
// 	})
// }
// /* 创建项目的资源信息 */
// export function postResource(projectId,data){
// 	return request({
// 		url: `/project/resource/${projectId}`,
// 		method : "POST",
// 		data
// 	})
// }
// /* 修改附件信息 */
// export function putFile(data){
// 	return request({
// 		url: `/project/resource/${data.id}`,
// 		method : "PUT",
// 		data
// 	})
// }
// /* 删除资源 */
// export function deleteResource(projectResourceId){
// 	return request({
// 		url: `/project/resource/${projectResourceId}`,
// 		method : "DELETE",
// 	})
// }

// /* 创建成员 */
// export function postMember(projectId,data){
// 	return request({
// 		url: `/project/member/${projectId}`,
// 		method : "POST",
// 		data
// 	})
// }
// /* 修改项目成员信息 */
// export function putMember(projectId,data){
// 	return request({
// 		url: `/project/member/${projectId}/${data.memberUserId}`,
// 		method : "PUT",
// 		data
// 	})
// }
// export function putMembers(projectId,data){
// 	return request({
// 		url: `/project/members/${projectId}`,
// 		method : "PUT",
// 		data
// 	})
// }
// /* 删除成员 */
// export function deleteMember(projectId,memberUserId){
// 	return request({
// 		url: `/project/member/${projectId}/${memberUserId}`,
// 		method : "DELETE",
// 	})
// }