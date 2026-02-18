import { request } from '@/utils/request'
import { mockApi } from '@/mock'
import type { Demand, DemandFilter, PageResult, ApiResponse } from '@/types'

const USE_MOCK = true

export interface DemandListParams {
  page: number
  size: number
  category?: string
  brand?: string
  status?: string
  startTime?: string
  endTime?: string
}

// 获取需求列表
export async function getDemandList(params: DemandListParams): Promise<ApiResponse<PageResult<Demand>>> {
  if (USE_MOCK) {
    return mockApi.getDemandList(params.page, params.size, {
      category: params.category,
      brand: params.brand,
      status: params.status
    })
  }
  return request.get('/demand/list', params)
}

// 获取需求详情
export async function getDemandDetail(id: string): Promise<ApiResponse<Demand>> {
  if (USE_MOCK) {
    return mockApi.getDemandDetail(id)
  }
  return request.get('/demand/detail', { id })
}
