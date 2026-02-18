// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  phone: string
  companyName: string
  role: 'supplier' | 'admin'
  avatar?: string
}

export interface LoginParams {
  username: string
  password: string
  captcha?: string
  rememberMe?: boolean
}

export interface LoginResult {
  token: string
  refreshToken: string
  userInfo: User
}

// 采购需求相关类型
export interface Demand {
  id: string
  demandNo: string
  title: string
  description: string
  category: string
  brand: string
  quantity: number
  budgetMin: number
  budgetMax: number
  deadline: string
  status: 'pending' | 'quoted' | 'closed' | 'awarded'
  createdAt: string
  attachments: Attachment[]
  storeInfo: StoreInfo
}

export interface StoreInfo {
  id: string
  name: string
  contact: string
  phone: string
  address: string
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: 'image' | 'pdf' | 'other'
  size: number
}

// 报价相关类型
export interface Quote {
  id: string
  quoteNo: string
  demandId: string
  demandNo: string
  demandTitle: string
  price: number
  brand: string
  productionDate: string
  quantity: number
  warrantyPeriod: string
  deliveryMethod: 'express' | 'pickup' | 'logistics'
  deliveryDuration: string
  contactPhone: string
  detailContent: string
  attachments: Attachment[]
  status: 'pending' | 'won' | 'lost'
  createdAt: string
  isWinner?: boolean
}

export interface QuoteSubmitParams {
  demandId: string
  price: number
  brand: string
  productionDate: string
  quantity: number
  warrantyPeriod: string
  deliveryMethod: 'express' | 'pickup' | 'logistics'
  deliveryDuration: string
  contactPhone: string
  detailContent: string
  attachmentUrls: string[]
}

// 发货相关类型
export interface Shipping {
  id: string
  quoteId: string
  demandId: string
  deliveryPerson: string
  deliveryPhone: string
  deliveryTime: string
  consignee: string
  consigneePhone: string
  trackingNumber: string
  remark?: string
  deliverySlipUrl: string
  status: 'shipped' | 'received'
  createdAt: string
}

export interface ShippingParams {
  quoteId: string
  deliveryPerson: string
  deliveryPhone: string
  deliveryTime: string
  consignee: string
  consigneePhone: string
  trackingNumber: string
  remark?: string
  deliverySlipUrl: string
}

// WebSocket消息类型
export interface WSMessage {
  type: 'NEW_DEMAND' | 'QUOTE_STATUS_UPDATE' | 'SHIPPING_UPDATE'
  data: any
  timestamp: number
}

// 分页请求参数
export interface PageParams {
  page: number
  size: number
}

// 分页响应
export interface PageResult<T> {
  total: number
  list: T[]
  page: number
  size: number
}

// 筛选参数
export interface DemandFilter {
  category?: string
  brand?: string
  startTime?: string
  endTime?: string
  status?: string
}

// API响应
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}
