/**
 * 采购状态管理
 */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { Purchase, PurchaseStatus, CreatePurchaseParams } from '@/types/purchase'
import { getPurchaseList, createPurchase as createPurchaseApi, getCategories, getBrands } from '@/services'
import type { PartCategory } from '@/types/purchase'

interface PurchaseState {
  // 采购列表
  purchaseList: Purchase[]
  total: number
  page: number
  size: number
  loading: boolean
  refreshing: boolean

  // 当前采购详情
  currentPurchase: Purchase | null

  // 筛选状态
  filterStatus: PurchaseStatus | null
  keyword: string

  // 分类和品牌
  categories: PartCategory[]
  brands: { id: string; name: string }[]
}

const initialState: PurchaseState = {
  purchaseList: [],
  total: 0,
  page: 1,
  size: 10,
  loading: false,
  refreshing: false,
  currentPurchase: null,
  filterStatus: null,
  keyword: '',
  categories: [],
  brands: []
}

// 异步获取采购列表
export const fetchPurchaseList = createAsyncThunk(
  'purchase/fetchList',
  async (params: { page: number; status?: PurchaseStatus | null; keyword?: string }, { rejectWithValue }) => {
    try {
      const result = await getPurchaseList({
        page: params.page,
        size: 10,
        status: params.status || undefined,
        keyword: params.keyword
      })
      return { ...result, page: params.page }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// 异步获取分类
export const fetchCategories = createAsyncThunk(
  'purchase/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getCategories()
      return result
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// 异步获取品牌
export const fetchBrands = createAsyncThunk(
  'purchase/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getBrands()
      return result
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// 异步创建采购订单
export const createPurchaseOrder = createAsyncThunk(
  'purchase/create',
  async (params: CreatePurchaseParams, { rejectWithValue }) => {
    try {
      const result = await createPurchaseApi(params)
      return result
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    // 设置当前采购详情
    setCurrentPurchase: (state, action: PayloadAction<Purchase | null>) => {
      state.currentPurchase = action.payload
    },
    // 设置筛选状态
    setFilterStatus: (state, action: PayloadAction<PurchaseStatus | null>) => {
      state.filterStatus = action.payload
      state.page = 1
    },
    // 设置关键词
    setKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload
      state.page = 1
    },
    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    // 设置刷新状态
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload
    },
    // 清空列表
    clearPurchaseList: (state) => {
      state.purchaseList = []
      state.total = 0
      state.page = 1
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取列表
      .addCase(fetchPurchaseList.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPurchaseList.fulfilled, (state, action) => {
        state.loading = false
        state.refreshing = false
        if (action.payload.page === 1) {
          state.purchaseList = action.payload.list
        } else {
          state.purchaseList = [...state.purchaseList, ...action.payload.list]
        }
        state.total = action.payload.total
        state.page = action.payload.page
      })
      .addCase(fetchPurchaseList.rejected, (state) => {
        state.loading = false
        state.refreshing = false
      })
      // 获取分类
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      // 获取品牌
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands = action.payload
      })
      // 创建采购订单
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.purchaseList.unshift(action.payload)
        state.total += 1
      })
  }
})

export const {
  setCurrentPurchase,
  setFilterStatus,
  setKeyword,
  setLoading,
  setRefreshing,
  clearPurchaseList
} = purchaseSlice.actions

export default purchaseSlice.reducer
