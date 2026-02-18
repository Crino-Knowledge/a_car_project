/* eslint-disable @typescript-eslint/no-explicit-any */

// 通用响应结构
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页请求参数
export interface PageParams {
  page: number
  size: number
}

// 分页响应结构
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  size: number
}

// 用户信息
export interface UserInfo {
  id: string
  openId: string
  phone: string
  name: string
  avatar: string
  storeId: string
  storeName: string
  token: string
}

// 登录请求参数
export interface LoginParams {
  code: string
  phone?: string
  verifyCode?: string
}

// 登录响应
export interface LoginResponse {
  token: string
  userInfo: UserInfo
  isNewUser: boolean
}

// 发送验证码参数
export interface SendCodeParams {
  phone: string
}

// 文件上传响应
export interface UploadResponse {
  url: string
  name: string
  size: number
}
