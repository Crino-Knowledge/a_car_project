/**
 * 报价服务
 */
import { get, post } from './request'
import { isMockEnabled } from './request'
import { mockGetQuoteList, mockGetQuoteDetail, mockConfirmSupplier } from './mock'
import type { Quote, QuoteListParams, ConfirmSupplierParams } from '@/types/quote'

/**
 * 获取报价列表
 */
export const getQuoteList = async (params: QuoteListParams): Promise<Quote[]> => {
  if (isMockEnabled()) {
    const result = mockGetQuoteList(params)
    return result.data
  }

  const response = await get<Quote[]>('/api/quote/list', params)
  return response
}

/**
 * 获取报价详情
 */
export const getQuoteDetail = async (purchaseId: string, quoteId: string): Promise<Quote | null> => {
  if (isMockEnabled()) {
    const result = mockGetQuoteDetail(purchaseId, quoteId)
    return result.data
  }

  const response = await get<Quote | null>('/api/quote/detail', { purchaseId, quoteId })
  return response
}

/**
 * 确认供应商（成交）
 */
export const confirmSupplier = async (params: ConfirmSupplierParams): Promise<{ success: boolean; supplierPhone: string; supplierName: string }> => {
  if (isMockEnabled()) {
    const result = mockConfirmSupplier(params.purchaseId, params.quoteId)
    return result.data
  }

  const response = await post<{ success: boolean; supplierPhone: string; supplierName: string }>(
    '/api/order/confirm-supplier',
    params
  )
  return response
}
