import request from '../utils/request.js'

/**
 * 获取公开上传签名
 * @param {String}  filename
 */
export const api_getPublicSign = (filename) => request(`/project/sign/upload/public?filename=${filename}`,"GET")

/**
 * 获取轮播图
 */
export const api_getCarousel = () => request("/slideShow","GET")