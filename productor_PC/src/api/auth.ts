import { request } from '@/utils/request'
import { mockApi } from '@/mock'
import type { LoginParams, LoginResult, ApiResponse } from '@/types'

// 是否使用Mock数据
const USE_MOCK = true

// 登录
export async function login(params: LoginParams): Promise<ApiResponse<LoginResult>> {
  if (USE_MOCK) {
    return mockApi.login(params.username, params.password)
  }
  return request.post('/auth/login', params)
}

// 刷新Token
export async function refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string }>> {
  if (USE_MOCK) {
    return { code: 0, msg: 'success', data: { token: 'new_mock_token_' + Date.now() } }
  }
  return request.post('/auth/refresh', { refreshToken })
}

// 退出登录
export async function logout(): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return { code: 0, msg: 'success', data: null }
  }
  return request.post('/auth/logout')
}

// 获取图形验证码
export function getCaptchaUrl(): string {
  // 返回一个简单的SVG验证码URL
  return `/api/auth/captcha?t=${Date.now()}`
}
