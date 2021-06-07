import request from '../utils/request.js'

/**
 * 登录
 */
export const api_login = (data) => request("/login/phone","POST",data)

/**
 * 获取用户个人信息
 */
export const api_getMe = () => request("/userInfo/me","GET",{},{timeout: 2000})

/**
 * 获取指定用户信息
 * @param {Number} userId
 */
export const api_getUser = (userId) => request(`/user/${userId}`,"GET")

/**
 * 获取用户简历信息
 */
export const api_getUserResume = (userId) => request( `/resume/${userId}`,"GET")
