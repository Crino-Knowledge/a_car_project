/**
 * Mock 数据 - 供应商报价
 */
import type { ApiResponse } from '@/types/api'
import type { Quote, QuoteListParams, QuoteStatus } from '@/types/quote'
import { QuoteStatus as QS } from '@/types/quote'
import { generateId } from '@/utils/format'

// 供应商代码映射（匿名化）
const supplierCodes = ['A', 'B', 'C', 'D', 'E']

// 生成模拟报价数据
const generateMockQuotes = (purchaseId: string): Quote[] => {
  const quotes: Quote[] = []
  const count = Math.floor(Math.random() * 4) + 2 // 2-5个报价

  for (let i = 0; i < count; i++) {
    const basePrice = Math.floor(Math.random() * 3000) + 500
    const deliveryHours = Math.floor(Math.random() * 72) + 12 // 12-84小时

    quotes.push({
      id: `quote_${generateId()}`,
      supplierCode: `供应商${supplierCodes[i]}`,
      price: basePrice,
      brand: ['博世', '电装', '德尔福', '法雷奥', '大陆'][Math.floor(Math.random() * 5)],
      productionDate: `2024-0${Math.floor(Math.random() * 9) + 1}`,
      quantity: Math.floor(Math.random() * 10) + 1,
      warrantyPeriod: `${Math.floor(Math.random() * 24) + 6}个月`,
      deliveryTime: deliveryHours,
      description: `品质保证，原厂正品，支持验货。送货上门，售后无忧。`,
      status: QS.PENDING,
      statusLabel: '待选择',
      attachments: [],
      createTime: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString()
    })
  }

  // 按价格排序
  quotes.sort((a, b) => a.price - b.price)

  return quotes
}

// 存储各采购单的报价
const quotesMap: Map<string, Quote[]> = new Map()

// 获取报价列表
export const mockGetQuoteList = (params: QuoteListParams): ApiResponse<Quote[]> => {
  let quotes = quotesMap.get(params.purchaseId)

  if (!quotes) {
    quotes = generateMockQuotes(params.purchaseId)
    quotesMap.set(params.purchaseId, quotes)
  }

  // 排序
  if (params.sortBy) {
    quotes = [...quotes]
    const sortOrder = params.sortOrder === 'desc' ? -1 : 1

    switch (params.sortBy) {
      case 'price':
        quotes.sort((a, b) => (a.price - b.price) * sortOrder)
        break
      case 'deliveryTime':
        quotes.sort((a, b) => (a.deliveryTime - b.deliveryTime) * sortOrder)
        break
      default:
        break
    }
  }

  return {
    code: 200,
    message: 'success',
    data: quotes
  }
}

// 获取报价详情
export const mockGetQuoteDetail = (purchaseId: string, quoteId: string): ApiResponse<Quote | null> => {
  const quotes = quotesMap.get(purchaseId)
  if (!quotes) {
    return {
      code: 404,
      message: '报价不存在',
      data: null
    }
  }

  const quote = quotes.find(item => item.id === quoteId)

  return {
    code: 200,
    message: quote ? 'success' : '报价不存在',
    data: quote || null
  }
}

// 确认供应商（成交）
export const mockConfirmSupplier = (purchaseId: string, quoteId: string): ApiResponse<{ success: boolean; supplierPhone: string; supplierName: string }> => {
  const quotes = quotesMap.get(purchaseId)

  if (!quotes) {
    return {
      code: 404,
      message: '报价不存在',
      data: { success: false, supplierPhone: '', supplierName: '' }
    }
  }

  const selectedQuote = quotes.find(item => item.id === quoteId)

  if (!selectedQuote) {
    return {
      code: 404,
      message: '报价不存在',
      data: { success: false, supplierPhone: '', supplierName: '' }
    }
  }

  // 更新报价状态
  quotes.forEach(quote => {
    if (quote.id === quoteId) {
      quote.status = QS.SELECTED
      quote.statusLabel = '已中标'
      // 揭示真实联系信息
      quote.contactPhone = '138****' + String(Math.floor(Math.random() * 10000)).padStart(4, '0')
      quote.contactName = '供应商联系人'
    } else {
      quote.status = QS.REJECTED
      quote.statusLabel = '未中标'
    }
  })

  return {
    code: 200,
    message: 'success',
    data: {
      success: true,
      supplierPhone: selectedQuote.contactPhone || '',
      supplierName: selectedQuote.supplierCode
    }
  }
}
