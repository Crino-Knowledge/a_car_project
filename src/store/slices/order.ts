/**
 * 订单状态管理
 */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { Order, OrderStatus, OrderStatusNode } from '@/types/order'
import { getOrderDetail, getOrderStatus, receiveOrder, submitFeedback } from '@/services'
import type { ReceiveOrderParams, SubmitFeedbackParams } from '@/types/order'

interface OrderState {
  // 当前订单
  currentOrder: Order | null

  // 订单状态
  orderStatus: OrderStatus | null
  statusLabel: string
  statusNodes: OrderStatusNode[]

  // 加载状态
  loading: boolean
}

const initialState: OrderState = {
  currentOrder: null,
  orderStatus: null,
  statusLabel: '',
  statusNodes: [],
  loading: false
}

// 异步获取订单详情
export const fetchOrderDetail = createAsyncThunk(
  'order/fetchDetail',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const result = await getOrderDetail(orderId)
      return result
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// 异步获取订单状态
export const fetchOrderStatus = createAsyncThunk(
  'order/fetchStatus',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const result = await getOrderStatus(orderId)
      return result
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// 异步确认收货
export const confirmReceive = createAsyncThunk(
  'order/receive',
  async (params: ReceiveOrderParams, { rejectWithValue }) => {
    try {
      const result = await receiveOrder(params)
      return result
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// 异步提交评价
export const sendFeedback = createAsyncThunk(
  'order/feedback',
  async (params: SubmitFeedbackParams, { rejectWithValue }) => {
    try {
      const result = await submitFeedback(params)
      return result
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // 设置当前订单
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload
    },
    // 清空订单
    clearOrder: (state) => {
      state.currentOrder = null
      state.orderStatus = null
      state.statusLabel = ''
      state.statusNodes = []
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取订单详情
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
        if (action.payload) {
          state.orderStatus = action.payload.status
          state.statusLabel = action.payload.statusLabel
          state.statusNodes = action.payload.statusNodes
        }
      })
      .addCase(fetchOrderDetail.rejected, (state) => {
        state.loading = false
      })
      // 获取订单状态
      .addCase(fetchOrderStatus.fulfilled, (state, action) => {
        state.orderStatus = action.payload.status
        state.statusLabel = action.payload.statusLabel
        state.statusNodes = action.payload.statusNodes
      })
      // 确认收货
      .addCase(confirmReceive.fulfilled, (state, action) => {
        if (action.payload.success && state.currentOrder) {
          state.currentOrder.status = 'received' as OrderStatus
          state.currentOrder.statusLabel = '已收货'
        }
      })
  }
})

export const { setCurrentOrder, clearOrder } = orderSlice.actions
export default orderSlice.reducer
