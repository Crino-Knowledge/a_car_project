/* eslint-disable @typescript-eslint/no-explicit-any */

// 订单状态枚举
export enum PurchaseStatus {
  PENDING = 'pending',       // 待应标
  QUOTED = 'quoted',         // 已应标
  CONFIRMED = 'confirmed',   // 已成交
  COMPLETED = 'completed',   // 已完成
  CANCELLED = 'cancelled'    // 已取消
}

// 订单状态标签映射
export const PurchaseStatusLabels: Record<PurchaseStatus, string> = {
  [PurchaseStatus.PENDING]: '待应标',
  [PurchaseStatus.QUOTED]: '已应标',
  [PurchaseStatus.CONFIRMED]: '已成交',
  [PurchaseStatus.COMPLETED]: '已完成',
  [PurchaseStatus.CANCELLED]: '已取消'
}

// 配件分类
export interface PartCategory {
  id: string
  name: string
  children?: PartCategory[]
}

// 采购订单附件
export interface PurchaseAttachment {
  id: string
  url: string
  name: string
  type: 'image' | 'pdf'
}

// 采购订单
export interface Purchase {
  id: string
  orderNo: string
  // 配件信息
  categoryId: string
  categoryName: string
  brandId: string
  brandName: string
  partName: string
  specification: string
  quantity: number
  budget: number
  description: string
  // 时间信息
  expectedArrivalTime: string
  quoteDeadline: string
  publishTime: string
  // 附件
  attachments: PurchaseAttachment[]
  // 状态
  status: PurchaseStatus
  statusLabel: string
  // 报价数量
  quoteCount: number
  // 门店信息
  storeId: string
  storeName: string
}

// 创建采购订单参数
export interface CreatePurchaseParams {
  categoryId: string
  brandId: string
  partName: string
  specification: string
  quantity: number
  budget: number
  description: string
  expectedArrivalTime: string
  quoteDeadline: string
  attachmentUrls: string[]
}

// 采购列表查询参数
export interface PurchaseListParams {
  page: number
  size: number
  status?: PurchaseStatus
  keyword?: string
}
