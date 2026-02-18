/**
 * Redux Store 配置
 */
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/user'
import purchaseReducer from './slices/purchase'
import orderReducer from './slices/order'

export const store = configureStore({
  reducer: {
    user: userReducer,
    purchase: purchaseReducer,
    order: orderReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
