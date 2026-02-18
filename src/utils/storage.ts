/**
 * 本地存储工具函数
 */
import Taro from '@tarojs/taro'
import { TOKEN_KEY, USER_INFO_KEY } from './constants'
import type { UserInfo } from '@/types/api'

/**
 * 获取存储数据
 */
export const getStorage = <T>(key: string): T | null => {
  try {
    const value = Taro.getStorageSync(key)
    return value ? value : null
  } catch (error) {
    console.error('getStorage error:', error)
    return null
  }
}

/**
 * 设置存储数据
 */
export const setStorage = <T>(key: string, value: T): boolean => {
  try {
    Taro.setStorageSync(key, value)
    return true
  } catch (error) {
    console.error('setStorage error:', error)
    return false
  }
}

/**
 * 移除存储数据
 */
export const removeStorage = (key: string): boolean => {
  try {
    Taro.removeStorageSync(key)
    return true
  } catch (error) {
    console.error('removeStorage error:', error)
    return false
  }
}

/**
 * 清空所有存储
 */
export const clearStorage = (): boolean => {
  try {
    Taro.clearStorageSync()
    return true
  } catch (error) {
    console.error('clearStorage error:', error)
    return false
  }
}

/**
 * 获取 Token
 */
export const getToken = (): string | null => {
  return getStorage<string>(TOKEN_KEY)
}

/**
 * 设置 Token
 */
export const setToken = (token: string): boolean => {
  return setStorage(TOKEN_KEY, token)
}

/**
 * 移除 Token
 */
export const removeToken = (): boolean => {
  return removeStorage(TOKEN_KEY)
}

/**
 * 获取用户信息
 */
export const getUserInfo = (): UserInfo | null => {
  return getStorage<UserInfo>(USER_INFO_KEY)
}

/**
 * 设置用户信息
 */
export const setUserInfo = (userInfo: UserInfo): boolean => {
  return setStorage(USER_INFO_KEY, userInfo)
}

/**
 * 移除用户信息
 */
export const removeUserInfo = (): boolean => {
  return removeStorage(USER_INFO_KEY)
}

/**
 * 清除登录状态
 */
export const clearAuth = (): void => {
  removeToken()
  removeUserInfo()
}
