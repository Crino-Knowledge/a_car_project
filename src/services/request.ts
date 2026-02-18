/**
 * 网络请求封装
 */
import Taro from '@tarojs/taro'
import { API_BASE_URL, REQUEST_TIMEOUT, RETRY_COUNT, ENABLE_MOCK } from '@/utils/constants'
import { getToken, clearAuth } from '@/utils/storage'
import type { ApiResponse } from '@/types/api'

// 请求配置
interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  showLoading?: boolean
  loadingText?: string
  showError?: boolean
  retryCount?: number
}

// 请求拦截器
const requestInterceptor = (config: RequestConfig): RequestConfig => {
  // 添加 Token
  const token = getToken()
  if (token) {
    config.header = {
      ...config.header,
      Authorization: `Bearer ${token}`
    }
  }

  // 添加默认 Content-Type
  if (!config.header?.['Content-Type']) {
    config.header = {
      ...config.header,
      'Content-Type': 'application/json'
    }
  }

  return config
}

// 响应拦截器
const responseInterceptor = <T>(response: Taro.request.SuccessCallbackResult<ApiResponse<T>>): ApiResponse<T> => {
  const { statusCode, data } = response

  // HTTP 状态码判断
  if (statusCode === 401) {
    // 未授权，清除登录状态
    clearAuth()
    Taro.showToast({
      title: '登录已过期，请重新登录',
      icon: 'none'
    })
    // 跳转到登录页
    setTimeout(() => {
      Taro.reLaunch({ url: '/pages/login/index' })
    }, 1500)
    throw new Error('登录已过期')
  }

  if (statusCode === 403) {
    Taro.showToast({
      title: '没有访问权限',
      icon: 'none'
    })
    throw new Error('没有访问权限')
  }

  if (statusCode === 404) {
    Taro.showToast({
      title: '请求的资源不存在',
      icon: 'none'
    })
    throw new Error('请求的资源不存在')
  }

  if (statusCode >= 500) {
    Taro.showToast({
      title: '服务器错误，请稍后重试',
      icon: 'none'
    })
    throw new Error('服务器错误')
  }

  // 业务状态码判断
  if (data.code !== 200) {
    Taro.showToast({
      title: data.message || '请求失败',
      icon: 'none'
    })
    throw new Error(data.message || '请求失败')
  }

  return data
}

/**
 * 统一请求方法
 */
export const request = async <T = any>(config: RequestConfig): Promise<T> => {
  const {
    url,
    method = 'GET',
    data,
    header,
    showLoading = false,
    loadingText = '加载中...',
    showError = true,
    retryCount = RETRY_COUNT
  } = config

  // 显示加载提示
  if (showLoading) {
    Taro.showLoading({ title: loadingText })
  }

  // 应用请求拦截器
  const processedConfig = requestInterceptor({
    url,
    method,
    data,
    header,
    showLoading,
    loadingText,
    showError,
    retryCount
  })

  // 完整 URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`

  // 重试逻辑
  let lastError: Error | null = null
  for (let i = 0; i <= retryCount; i++) {
    try {
      const response = await Taro.request({
        url: fullUrl,
        method: processedConfig.method,
        data: processedConfig.data,
        header: processedConfig.header,
        timeout: REQUEST_TIMEOUT
      })

      if (showLoading) {
        Taro.hideLoading()
      }

      const result = responseInterceptor<T>(response as any)
      return result.data
    } catch (error: any) {
      lastError = error
      console.error(`Request failed (attempt ${i + 1}/${retryCount + 1}):`, error)

      // 如果是认证错误，不重试
      if (error.message === '登录已过期') {
        break
      }

      // 如果不是网络错误，不重试
      if (error.errMsg && !error.errMsg.includes('network')) {
        break
      }

      // 等待一段时间后重试
      if (i < retryCount) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }

  if (showLoading) {
    Taro.hideLoading()
  }

  if (showError) {
    Taro.showToast({
      title: lastError?.message || '网络连接失败，请检查后重试',
      icon: 'none'
    })
  }

  throw lastError || new Error('请求失败')
}

/**
 * GET 请求
 */
export const get = <T = any>(url: string, params?: any, config?: Partial<RequestConfig>): Promise<T> => {
  // 将参数拼接到 URL
  if (params) {
    const queryString = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')

    if (queryString) {
      url = `${url}?${queryString}`
    }
  }

  return request<T>({
    url,
    method: 'GET',
    ...config
  })
}

/**
 * POST 请求
 */
export const post = <T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> => {
  return request<T>({
    url,
    method: 'POST',
    data,
    ...config
  })
}

/**
 * PUT 请求
 */
export const put = <T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> => {
  return request<T>({
    url,
    method: 'PUT',
    data,
    ...config
  })
}

/**
 * DELETE 请求
 */
export const del = <T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> => {
  return request<T>({
    url,
    method: 'DELETE',
    data,
    ...config
  })
}

/**
 * 文件上传
 */
export const uploadFile = async (
  filePath: string,
  options?: {
    url?: string
    name?: string
    formData?: Record<string, any>
  }
): Promise<{ url: string; name: string; size: number }> => {
  const uploadUrl = options?.url || `${API_BASE_URL}/api/file/upload`

  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: uploadUrl,
      filePath,
      name: options?.name || 'file',
      formData: options?.formData,
      header: {
        Authorization: `Bearer ${getToken()}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(res.data)
            if (data.code === 200) {
              resolve(data.data)
            } else {
              reject(new Error(data.message || '上传失败'))
            }
          } catch (error) {
            reject(new Error('上传响应解析失败'))
          }
        } else {
          reject(new Error('上传失败'))
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

// 是否使用 Mock
export const isMockEnabled = (): boolean => {
  return ENABLE_MOCK
}
