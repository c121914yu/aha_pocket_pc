/* 订单相关 */
import request from '../utils/request.js'

/**
 * 创建订单
 * @param {Number}  prohjectId 项目ID
 * @param {Number[]}   resourceIds 购买的附件id
 */
export const postOrder = (data) => request("/contribPoint/order","POST",data)

/**
 * 付款/取消付款
 * @param {Number}  orderId 订单ID
 * @param {String} action 取值pay，cancel 
 */
export const putOrder = (orderId,action) => request(`/contribPoint/order/${orderId}?action=${action}`,"PUT",{})

/**
 * 获取个人贡献点变化日志
 * @param {Number}  pageNum
 * @param {Number}  pageSize
 * @param {String}  sortBy 排序参考，取值time,type,contribPoint,ahaPoint,ahaCredit
 * @param {String}  orderBy 排序方式，取值desc,asc默认desc
 */
export const getPointOrder = (params) => request("/contribPoint/log/me","GET",params)

/**
 * 获取个人全部订单
 * @param {Number}  pageNum
 * @param {Number}  pageSize
 */
export const getOrders = (params) => request("/contribPoint/order/me","GET",params)

/**
 * 获取订单详细
 * @param {Number}  orderId 订单ID
 */
export const getOrder = (orderId) => request(`/contribPoint/order/${orderId}`,"GET",{})

/**
 * 获取个人已购附件
 * @param {Number} projectId
 */
export const api_getPurchasedFiles = (projectId) => request(`/project/purchased/${projectId}`,"GET")
