/**
 * 用户状态管理
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserInfo } from '@/types/api'
import { getUserInfo, setUserInfo as saveUserInfo, removeUserInfo, clearAuth } from '@/utils/storage'

interface UserState {
  isLoggedIn: boolean
  userInfo: UserInfo | null
  token: string | null
}

const savedUserInfo = getUserInfo()

const initialState: UserState = {
  isLoggedIn: !!savedUserInfo,
  userInfo: savedUserInfo,
  token: savedUserInfo?.token || null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 设置用户信息
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.isLoggedIn = true
      state.userInfo = action.payload
      state.token = action.payload.token
      saveUserInfo(action.payload)
    },
    // 更新用户信息
    updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload }
        saveUserInfo(state.userInfo)
      }
    },
    // 清除用户信息
    clearUserInfo: (state) => {
      state.isLoggedIn = false
      state.userInfo = null
      state.token = null
      clearAuth()
    },
    // 登出
    logout: (state) => {
      state.isLoggedIn = false
      state.userInfo = null
      state.token = null
      clearAuth()
    }
  }
})

export const { setUserInfo, updateUserInfo, clearUserInfo, logout } = userSlice.actions
export default userSlice.reducer
