/**
 * 订单服务
 */
import { get, post } from './request'
import { isMockEnabled } from './request'
import { mockGetOrderDetail, mockGetOrderStatus, mockReceiveOrder, mockSubmitFeedback } from './mock'
import type { Order, OrderStatus, OrderStatusNode, ReceiveOrderParams, SubmitFeedbackParams } from '@/types/order'

/**
 * 获取订单详情
 */
export const getOrderDetail = async (orderId: string): Promise<Order | null> => {
  if (isMockEnabled()) {
    const result = mockGetOrderDetail(orderId)
    return result.data
  }

  const response = await get<Order | null>('/api/order/detail', { orderId })
  return response
}

/**
 * 获取订单状态
 */
export const getOrderStatus = async (orderId: string): Promise<{
  status: OrderStatus
  statusLabel: string
  statusNodes: OrderStatusNode[]
}> => {
  if (isMockEnabled()) {
    const result = mockGetOrderStatus(orderId)
    return result.data
  }

  const response = await get<{
    status: OrderStatus
    statusLabel: string
    statusNodes: OrderStatusNode[]
  }>('/api/order/status', { orderId })
  return response
}

/**
 * 确认收货
 */
export const receiveOrder = async (params: ReceiveOrderParams): Promise<{ success: boolean }> => {
  if (isMockEnabled()) {
    const result = mockReceiveOrder(params)
    return result.data
  }

  const response = await post<{ success: boolean }>('/api/order/receive', params)
  return response
}

/**
 * 提交评价
 */
export const submitFeedback = async (params: SubmitFeedbackParams): Promise<{ success: boolean }> => {
  if (isMockEnabled()) {
    const result = mockSubmitFeedback(params)
    return result.data
  }

  const response = await post<{ success: boolean }>('/api/feedback/submit', params)
  return response
}
