/**
 * 常量定义
 */

// API 基础地址
export const API_BASE_URL = 'https://api.example.com'

// 是否启用 Mock
export const ENABLE_MOCK = true

// Token 存储键名
export const TOKEN_KEY = 'auth_token'

// 用户信息存储键名
export const USER_INFO_KEY = 'user_info'

// 请求超时时间
export const REQUEST_TIMEOUT = 30000

// 重试次数
export const RETRY_COUNT = 3

// 文件上传限制
export const FILE_UPLOAD_LIMIT = {
  maxSize: 2 * 1024 * 1024, // 2MB
  maxCount: 3,
  imageMaxWidth: 1080,
  imageMaxHeight: 1080,
  allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
}

// 订单状态颜色映射
export const STATUS_COLORS: Record<string, string> = {
  pending: '#FAAD14',    // 警告黄
  quoted: '#1677FF',     // 主色蓝
  confirmed: '#52C41A',  // 成功绿
  completed: '#52C41A',  // 成功绿
  cancelled: '#999999',  // 灰色
  preparing: '#1677FF',
  ready: '#FAAD14',
  shipped: '#1677FF',
  delivering: '#1677FF',
  delivered: '#52C41A',
  received: '#52C41A'
}

// 分页配置
export const PAGE_SIZE = 10

// 时间格式
export const DATE_FORMAT = 'YYYY-MM-DD'
export const TIME_FORMAT = 'YYYY-MM-DD HH:mm'
