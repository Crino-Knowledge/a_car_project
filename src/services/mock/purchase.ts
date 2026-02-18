/**
 * Mock 数据 - 采购订单
 */
import type { ApiResponse, PageResult } from '@/types/api'
import type { Purchase, PurchaseStatus, CreatePurchaseParams, PurchaseListParams, PartCategory } from '@/types/purchase'
import { PurchaseStatus as PS } from '@/types/purchase'
import { generateId, generateOrderNo } from '@/utils/format'

// 模拟配件分类
const mockCategories: PartCategory[] = [
  {
    id: 'cat_001',
    name: '发动机系统',
    children: [
      { id: 'cat_001_001', name: '活塞' },
      { id: 'cat_001_002', name: '气缸套' },
      { id: 'cat_001_003', name: '曲轴' },
      { id: 'cat_001_004', name: '凸轮轴' }
    ]
  },
  {
    id: 'cat_002',
    name: '制动系统',
    children: [
      { id: 'cat_002_001', name: '刹车片' },
      { id: 'cat_002_002', name: '刹车盘' },
      { id: 'cat_002_003', name: '刹车卡钳' }
    ]
  },
  {
    id: 'cat_003',
    name: '悬挂系统',
    children: [
      { id: 'cat_003_001', name: '减震器' },
      { id: 'cat_003_002', name: '弹簧' },
      { id: 'cat_003_003', name: '控制臂' }
    ]
  },
  {
    id: 'cat_004',
    name: '电气系统',
    children: [
      { id: 'cat_004_001', name: '发电机' },
      { id: 'cat_004_002', name: '起动机' },
      { id: 'cat_004_003', name: '点火线圈' }
    ]
  },
  {
    id: 'cat_005',
    name: '冷却系统',
    children: [
      { id: 'cat_005_001', name: '散热器' },
      { id: 'cat_005_002', name: '水泵' },
      { id: 'cat_005_003', name: '节温器' }
    ]
  }
]

// 模拟品牌
const mockBrands = [
  { id: 'brand_001', name: '博世' },
  { id: 'brand_002', name: '电装' },
  { id: 'brand_003', name: '德尔福' },
  { id: 'brand_004', name: '法雷奥' },
  { id: 'brand_005', name: '大陆' },
  { id: 'brand_006', name: '采埃孚' }
]

// 生成模拟采购订单
const generateMockPurchases = (): Purchase[] => {
  const purchases: Purchase[] = []
  const statuses = [PS.PENDING, PS.QUOTED, PS.CONFIRMED, PS.COMPLETED]

  for (let i = 1; i <= 20; i++) {
    const categoryIndex = Math.floor(Math.random() * mockCategories.length)
    const category = mockCategories[categoryIndex]
    const subCategory = category.children?.[Math.floor(Math.random() * (category.children?.length || 1))]
    const brand = mockBrands[Math.floor(Math.random() * mockBrands.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)] as PurchaseStatus

    const baseDate = new Date()
    baseDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 30))

    const expectedArrival = new Date(baseDate)
    expectedArrival.setDate(expectedArrival.getDate() + 7)

    const quoteDeadline = new Date(baseDate)
    quoteDeadline.setDate(quoteDeadline.getDate() + 3)

    purchases.push({
      id: `purchase_${String(i).padStart(3, '0')}`,
      orderNo: generateOrderNo('PO'),
      categoryId: subCategory?.id || category.id,
      categoryName: subCategory?.name || category.name,
      brandId: brand.id,
      brandName: brand.name,
      partName: `${brand.name}${subCategory?.name || category.name}`,
      specification: `规格型号-${String(i).padStart(4, '0')}`,
      quantity: Math.floor(Math.random() * 10) + 1,
      budget: Math.floor(Math.random() * 5000) + 500,
      description: `采购描述：需要采购${subCategory?.name || category.name}，用于车辆维修。质量要求：原厂品质或同等品质替代品。`,
      expectedArrivalTime: expectedArrival.toISOString(),
      quoteDeadline: quoteDeadline.toISOString(),
      publishTime: baseDate.toISOString(),
      attachments: [],
      status,
      statusLabel: {
        [PS.PENDING]: '待应标',
        [PS.QUOTED]: '已应标',
        [PS.CONFIRMED]: '已成交',
        [PS.COMPLETED]: '已完成',
        [PS.CANCELLED]: '已取消'
      }[status],
      quoteCount: status === PS.PENDING ? 0 : Math.floor(Math.random() * 5) + 1,
      storeId: 'store_001',
      storeName: '测试汽服门店'
    })
  }

  return purchases
}

let mockPurchases = generateMockPurchases()

// 获取分类列表
export const mockGetCategories = (): ApiResponse<PartCategory[]> => {
  return {
    code: 200,
    message: 'success',
    data: mockCategories
  }
}

// 获取品牌列表
export const mockGetBrands = (): ApiResponse<{ id: string; name: string }[]> => {
  return {
    code: 200,
    message: 'success',
    data: mockBrands
  }
}

// 获取采购列表
export const mockGetPurchaseList = (params: PurchaseListParams): ApiResponse<PageResult<Purchase>> => {
  let filteredList = [...mockPurchases]

  // 状态筛选
  if (params.status) {
    filteredList = filteredList.filter(item => item.status === params.status)
  }

  // 关键词搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredList = filteredList.filter(item =>
      item.partName.toLowerCase().includes(keyword) ||
      item.orderNo.toLowerCase().includes(keyword)
    )
  }

  // 排序（按发布时间倒序）
  filteredList.sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime())

  // 分页
  const page = params.page || 1
  const size = params.size || 10
  const startIndex = (page - 1) * size
  const endIndex = startIndex + size
  const list = filteredList.slice(startIndex, endIndex)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredList.length,
      page,
      size
    }
  }
}

// 获取采购详情
export const mockGetPurchaseDetail = (id: string): ApiResponse<Purchase | null> => {
  const purchase = mockPurchases.find(item => item.id === id)

  return {
    code: 200,
    message: purchase ? 'success' : '采购单不存在',
    data: purchase || null
  }
}

// 创建采购订单
export const mockCreatePurchase = (params: CreatePurchaseParams): ApiResponse<Purchase> => {
  const newPurchase: Purchase = {
    id: generateId(),
    orderNo: generateOrderNo('PO'),
    categoryId: params.categoryId,
    categoryName: '待更新',
    brandId: params.brandId,
    brandName: '待更新',
    partName: params.partName,
    specification: params.specification,
    quantity: params.quantity,
    budget: params.budget,
    description: params.description,
    expectedArrivalTime: params.expectedArrivalTime,
    quoteDeadline: params.quoteDeadline,
    publishTime: new Date().toISOString(),
    attachments: params.attachmentUrls.map((url, index) => ({
      id: `att_${index}`,
      url,
      name: `附件${index + 1}`,
      type: url.includes('.pdf') ? 'pdf' : 'image'
    })),
    status: PS.PENDING,
    statusLabel: '待应标',
    quoteCount: 0,
    storeId: 'store_001',
    storeName: '测试汽服门店'
  }

  mockPurchases.unshift(newPurchase)

  return {
    code: 200,
    message: 'success',
    data: newPurchase
  }
}

// 取消采购订单
export const mockCancelPurchase = (id: string): ApiResponse<boolean> => {
  const index = mockPurchases.findIndex(item => item.id === id)
  if (index !== -1) {
    mockPurchases[index].status = PS.CANCELLED
    mockPurchases[index].statusLabel = '已取消'
    return {
      code: 200,
      message: 'success',
      data: true
    }
  }
  return {
    code: 404,
    message: '采购单不存在',
    data: false
  }
}
