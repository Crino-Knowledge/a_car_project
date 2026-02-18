import { request } from '@/utils/request'
import { mockApi } from '@/mock'
import type { Quote, QuoteSubmitParams, PageResult, ApiResponse } from '@/types'

const USE_MOCK = true

export interface QuoteListParams {
  page: number
  size: number
  status?: string
}

// 提交报价
export async function submitQuote(params: QuoteSubmitParams): Promise<ApiResponse<Quote>> {
  if (USE_MOCK) {
    return mockApi.submitQuote(params)
  }
  return request.post('/quote/submit', params)
}

// 获取我的报价列表
export async function getMyQuoteList(params: QuoteListParams): Promise<ApiResponse<PageResult<Quote>>> {
  if (USE_MOCK) {
    return mockApi.getMyQuoteList(params.page, params.size, params.status)
  }
  return request.get('/quote/my-list', params)
}

// 获取报价详情
export async function getQuoteDetail(id: string): Promise<ApiResponse<Quote>> {
  if (USE_MOCK) {
    // 从mockQuotes中查找
    const { mockQuotes } = await import('@/mock')
    const quote = mockQuotes.find(q => q.id === id)
    if (quote) {
      return { code: 0, msg: 'success', data: quote }
    }
    return { code: 404, msg: '报价不存在', data: null as any }
  }
  return request.get('/quote/detail', { id })
}
