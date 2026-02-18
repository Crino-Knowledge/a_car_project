import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { tokenManager } from './storage'
import { showToast } from './notification'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    // 业务错误处理
    if (res.code !== 0 && res.code !== 200) {
      showToast(res.msg || '请求失败', 'error')

      // 401 未授权
      if (res.code === 401) {
        tokenManager.clearTokens()
        window.location.href = '/login'
      }

      return Promise.reject(new Error(res.msg || '请求失败'))
    }

    return res
  },
  (error) => {
    console.error('响应错误:', error)

    if (error.response) {
      const status = error.response.status

      switch (status) {
        case 401:
          showToast('登录已过期，请重新登录', 'error')
          tokenManager.clearTokens()
          window.location.href = '/login'
          break
        case 403:
          showToast('没有权限访问', 'error')
          break
        case 404:
          showToast('请求的资源不存在', 'error')
          break
        case 500:
          showToast('服务器错误', 'error')
          break
        default:
          showToast(error.message || '网络错误', 'error')
      }
    } else {
      showToast('网络连接失败', 'error')
    }

    return Promise.reject(error)
  }
)

// 封装请求方法
export const request = {
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, { params, ...config })
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, { params, ...config })
  },

  upload<T = any>(url: string, file: File, onProgress?: (percent: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percent)
        }
      }
    })
  }
}

export default service
