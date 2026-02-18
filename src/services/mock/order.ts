/**
 * Mock 数据 - 订单
 */
import type { ApiResponse } from '@/types/api'
import type { Order, OrderStatus, OrderStatusNode, ReceiveOrderParams, SubmitFeedbackParams } from '@/types/order'
import { OrderStatus as OS } from '@/types/order'
import { generateId, generateOrderNo, formatDuration } from '@/utils/format'

// 订单状态节点配置
const statusNodeConfig: { status: OrderStatus; label: string }[] = [
  { status: OS.PREPARING, label: '供应商备货' },
  { status: OS.READY_TO_SHIP, label: '待发货' },
  { status: OS.SHIPPED, label: '已发货' },
  { status: OS.DELIVERING, label: '派送中' },
  { status: OS.DELIVERED, label: '已送达' }
]

// 生成订单状态节点
const generateStatusNodes = (currentStatus: OrderStatus): OrderStatusNode[] => {
  const currentIndex = statusNodeConfig.findIndex(item => item.status === currentStatus)

  return statusNodeConfig.map((config, index) => ({
    status: config.status,
    label: config.label,
    time: index <= currentIndex ? new Date(Date.now() - (currentIndex - index) * 3600000).toISOString() : undefined,
    operator: index <= currentIndex ? '系统' : undefined,
    contactPhone: index <= currentIndex ? '400-xxx-xxxx' : undefined,
    completed: index < currentIndex,
    current: index === currentIndex
  }))
}

// 生成模拟订单
const generateMockOrder = (purchaseId: string, quoteId: string, price: number): Order => {
  const statuses = [OS.PREPARING, OS.READY_TO_SHIP, OS.SHIPPED, OS.DELIVERING, OS.DELIVERED]
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)] as OrderStatus

  return {
    id: generateId(),
    orderNo: generateOrderNo('OD'),
    purchaseId,
    purchaseOrderNo: generateOrderNo('PO'),
    supplierId: 'supplier_001',
    supplierName: '供应商A',
    supplierPhone: '138****8888',
    supplierContact: '张经理',
    partName: '博世刹车片',
    specification: '规格型号-0001',
    quantity: 2,
    unitPrice: price,
    totalPrice: price * 2,
    status: randomStatus,
    statusLabel: {
      [OS.PREPARING]: '供应商备货',
      [OS.READY_TO_SHIP]: '待发货',
      [OS.SHIPPED]: '已发货',
      [OS.DELIVERING]: '派送中',
      [OS.DELIVERED]: '已送达',
      [OS.RECEIVED]: '已收货',
      [OS.CANCELLED]: '已取消'
    }[randomStatus],
    statusNodes: generateStatusNodes(randomStatus),
    createTime: new Date(Date.now() - 86400000 * 2).toISOString(),
    updateTime: new Date().toISOString()
  }
}

// 存储订单
const ordersMap: Map<string, Order> = new Map()

// 获取订单详情
export const mockGetOrderDetail = (orderId: string): ApiResponse<Order | null> => {
  let order = ordersMap.get(orderId)

  if (!order) {
    // 生成一个模拟订单
    order = generateMockOrder('purchase_001', 'quote_001', 1200)
    ordersMap.set(orderId, order)
  }

  return {
    code: 200,
    message: 'success',
    data: order
  }
}

// 获取订单状态
export const mockGetOrderStatus = (orderId: string): ApiResponse<{ status: OrderStatus; statusLabel: string; statusNodes: OrderStatusNode[] }> => {
  const order = ordersMap.get(orderId)

  if (!order) {
    return {
      code: 404,
      message: '订单不存在',
      data: { status: OS.PREPARING, statusLabel: '供应商备货', statusNodes: [] }
    }
  }

  return {
    code: 200,
    message: 'success',
    data: {
      status: order.status,
      statusLabel: order.statusLabel,
      statusNodes: order.statusNodes
    }
  }
}

// 确认收货
export const mockReceiveOrder = (params: ReceiveOrderParams): ApiResponse<{ success: boolean }> => {
  const order = ordersMap.get(params.orderId)

  if (!order) {
    return {
      code: 404,
      message: '订单不存在',
      data: { success: false }
    }
  }

  order.status = OS.RECEIVED
  order.statusLabel = '已收货'
  order.deliveryNo = params.deliveryNo
  order.receiveTime = new Date().toISOString()
  order.receivePhotos = params.photos

  return {
    code: 200,
    message: 'success',
    data: { success: true }
  }
}

// 提交评价
export const mockSubmitFeedback = (params: SubmitFeedbackParams): ApiResponse<{ success: boolean }> => {
  return {
    code: 200,
    message: 'success',
    data: { success: true }
  }
}

// 创建订单（成交后调用）
export const mockCreateOrder = (purchaseId: string, quoteId: string, price: number): ApiResponse<Order> => {
  const order = generateMockOrder(purchaseId, quoteId, price)
  ordersMap.set(order.id, order)

  return {
    code: 200,
    message: 'success',
    data: order
  }
}
