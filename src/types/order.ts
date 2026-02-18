/* eslint-disable @typescript-eslint/no-explicit-any */

// 订单状态
export enum OrderStatus {
  PREPARING = 'preparing',     // 供应商备货
  READY_TO_SHIP = 'ready',     // 待发货
  SHIPPED = 'shipped',         // 已发货
  DELIVERING = 'delivering',   // 派送中
  DELIVERED = 'delivered',     // 已送达
  RECEIVED = 'received',       // 已收货
  CANCELLED = 'cancelled'      // 已取消
}

// 订单状态标签映射
export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PREPARING]: '供应商备货',
  [OrderStatus.READY_TO_SHIP]: '待发货',
  [OrderStatus.SHIPPED]: '已发货',
  [OrderStatus.DELIVERING]: '派送中',
  [OrderStatus.DELIVERED]: '已送达',
  [OrderStatus.RECEIVED]: '已收货',
  [OrderStatus.CANCELLED]: '已取消'
}

// 订单状态节点
export interface OrderStatusNode {
  status: OrderStatus
  label: string
  time?: string
  operator?: string
  contactPhone?: string
  completed: boolean
  current: boolean
}

// 订单详情
export interface Order {
  id: string
  orderNo: string
  // 关联的采购单
  purchaseId: string
  purchaseOrderNo: string
  // 供应商信息
  supplierId: string
  supplierName: string
  supplierPhone: string
  supplierContact: string
  // 配件信息
  partName: string
  specification: string
  quantity: number
  unitPrice: number
  totalPrice: number
  // 状态
  status: OrderStatus
  statusLabel: string
  statusNodes: OrderStatusNode[]
  // 物流信息
  trackingNo?: string
  logisticsCompany?: string
  // 送货单号
  deliveryNo?: string
  // 收货信息
  receiveTime?: string
  receivePhotos?: string[]
  // 时间
  createTime: string
  updateTime: string
}

// 订单状态查询参数
export interface OrderStatusParams {
  orderId: string
}

// 收货确认参数
export interface ReceiveOrderParams {
  orderId: string
  deliveryNo: string
  photos: string[]
}

// 评价参数
export interface SubmitFeedbackParams {
  orderId: string
  deliveryScore: number      // 送货时效评分 1-5
  qualityScore: number       // 报价匹配度评分 1-5
  comment: string
}
