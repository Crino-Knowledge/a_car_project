/**
 * 认证服务
 */
import { post } from './request'
import { isMockEnabled } from './request'
import { mockLogin, mockSendCode, mockBindPhone } from './mock'
import type { ApiResponse, LoginParams, LoginResponse, SendCodeParams } from '@/types/api'

/**
 * 微信登录
 */
export const wechatLogin = async (params: LoginParams): Promise<LoginResponse> => {
  if (isMockEnabled()) {
    const result = mockLogin()
    return result.data
  }

  const response = await post<LoginResponse>('/api/auth/wechat-login', params)
  return response
}

/**
 * 发送验证码
 */
export const sendVerifyCode = async (params: SendCodeParams): Promise<boolean> => {
  if (isMockEnabled()) {
    const result = mockSendCode()
    return result.data
  }

  const response = await post<boolean>('/api/auth/send-code', params)
  return response
}

/**
 * 绑定手机号
 */
export const bindPhone = async (params: { phone: string; code: string }): Promise<LoginResponse> => {
  if (isMockEnabled()) {
    const result = mockBindPhone(params.phone)
    return result.data
  }

  const response = await post<LoginResponse>('/api/auth/bind-phone', params)
  return response
}
