import request from '../utils/request.js'

/**
 * 获取公开上传签名
 */
export const api_getPublicSign = (filename) => request(`/project/sign/upload/public?filename=${filename}`,"GET")

