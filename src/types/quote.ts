/* eslint-disable @typescript-eslint/no-explicit-any */

// 报价状态
export enum QuoteStatus {
  PENDING = 'pending',       // 待处理
  SELECTED = 'selected',     // 已中标
  REJECTED = 'rejected',     // 未中标
  EXPIRED = 'expired'        // 已过期
}

// 报价状态标签映射
export const QuoteStatusLabels: Record<QuoteStatus, string> = {
  [QuoteStatus.PENDING]: '待选择',
  [QuoteStatus.SELECTED]: '已中标',
  [QuoteStatus.REJECTED]: '未中标',
  [QuoteStatus.EXPIRED]: '已过期'
}

// 供应商报价（匿名化）
export interface Quote {
  id: string
  // 匿名供应商标识
  supplierCode: string  // 供应商A、供应商B等
  // 报价信息
  price: number
  brand: string
  productionDate: string
  quantity: number
  warrantyPeriod: string
  deliveryTime: number  // 送货时长（小时）
  description: string
  // 联系方式（成交后可见）
  contactPhone?: string
  contactName?: string
  // 状态
  status: QuoteStatus
  statusLabel: string
  // 附件
  attachments: { id: string; url: string; name: string }[]
  // 时间
  createTime: string
}

// 报价列表查询参数
export interface QuoteListParams {
  purchaseId: string
  sortBy?: 'price' | 'deliveryTime' | 'brandMatch'
  sortOrder?: 'asc' | 'desc'
}

// 成交操作参数
export interface ConfirmSupplierParams {
  purchaseId: string
  quoteId: string
}
