import { request } from '@/utils/request'
import { mockApi } from '@/mock'
import type { ShippingParams, Shipping, ApiResponse } from '@/types'

const USE_MOCK = true

// 提交发货信息
export async function createShipping(params: ShippingParams): Promise<ApiResponse<Shipping>> {
  if (USE_MOCK) {
    return mockApi.submitShipping(params)
  }
  return request.post('/shipping/create', params)
}

// 获取发货详情
export async function getShippingDetail(quoteId: string): Promise<ApiResponse<Shipping | null>> {
  if (USE_MOCK) {
    return { code: 0, msg: 'success', data: null }
  }
  return request.get('/shipping/detail', { quoteId })
}
