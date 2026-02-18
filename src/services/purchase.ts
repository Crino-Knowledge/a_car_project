/**
 * 采购服务
 */
import { get, post } from './request'
import { isMockEnabled } from './request'
import {
  mockGetPurchaseList,
  mockGetPurchaseDetail,
  mockCreatePurchase,
  mockCancelPurchase,
  mockGetCategories,
  mockGetBrands
} from './mock'
import type { ApiResponse, PageResult } from '@/types/api'
import type { Purchase, CreatePurchaseParams, PurchaseListParams, PartCategory } from '@/types/purchase'

/**
 * 获取配件分类
 */
export const getCategories = async (): Promise<PartCategory[]> => {
  if (isMockEnabled()) {
    const result = mockGetCategories()
    return result.data
  }

  const response = await get<PartCategory[]>('/api/purchase/categories')
  return response
}

/**
 * 获取品牌列表
 */
export const getBrands = async (): Promise<{ id: string; name: string }[]> => {
  if (isMockEnabled()) {
    const result = mockGetBrands()
    return result.data
  }

  const response = await get<{ id: string; name: string }[]>('/api/purchase/brands')
  return response
}

/**
 * 获取采购列表
 */
export const getPurchaseList = async (params: PurchaseListParams): Promise<PageResult<Purchase>> => {
  if (isMockEnabled()) {
    const result = mockGetPurchaseList(params)
    return result.data
  }

  const response = await get<PageResult<Purchase>>('/api/purchase/list', params)
  return response
}

/**
 * 获取采购详情
 */
export const getPurchaseDetail = async (id: string): Promise<Purchase | null> => {
  if (isMockEnabled()) {
    const result = mockGetPurchaseDetail(id)
    return result.data
  }

  const response = await get<Purchase | null>('/api/purchase/detail', { id })
  return response
}

/**
 * 创建采购订单
 */
export const createPurchase = async (params: CreatePurchaseParams): Promise<Purchase> => {
  if (isMockEnabled()) {
    const result = mockCreatePurchase(params)
    return result.data
  }

  const response = await post<Purchase>('/api/purchase/create', params)
  return response
}

/**
 * 取消采购订单
 */
export const cancelPurchase = async (id: string): Promise<boolean> => {
  if (isMockEnabled()) {
    const result = mockCancelPurchase(id)
    return result.code === 200
  }

  const response = await post<boolean>('/api/purchase/cancel', { id })
  return response
}
