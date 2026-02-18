/**
 * Mock 数据 - 用户认证
 */
import type { ApiResponse, LoginResponse, UserInfo } from '@/types/api'

// 模拟用户数据
const mockUserInfo: UserInfo = {
  id: 'user_001',
  openId: 'mock_open_id_12345',
  phone: '138****8888',
  name: '测试门店店长',
  avatar: 'https://via.placeholder.com/100',
  storeId: 'store_001',
  storeName: '测试汽服门店',
  token: 'mock_token_' + Date.now()
}

// 模拟登录响应
export const mockLogin = (): ApiResponse<LoginResponse> => {
  return {
    code: 200,
    message: 'success',
    data: {
      token: mockUserInfo.token,
      userInfo: mockUserInfo,
      isNewUser: false
    }
  }
}

// 模拟发送验证码
export const mockSendCode = (): ApiResponse<boolean> => {
  return {
    code: 200,
    message: 'success',
    data: true
  }
}

// 模拟绑定手机号
export const mockBindPhone = (phone: string): ApiResponse<LoginResponse> => {
  mockUserInfo.phone = phone
  return {
    code: 200,
    message: 'success',
    data: {
      token: mockUserInfo.token,
      userInfo: mockUserInfo,
      isNewUser: false
    }
  }
}
