import { request } from '@/utils/request'
import { mockApi } from '@/mock'
import type { ApiResponse } from '@/types'

const USE_MOCK = true

// 上传文件
export async function uploadFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<ApiResponse<{ url: string; fileId: string }>> {
  if (USE_MOCK) {
    const result = await mockApi.uploadFile(file)
    return {
      code: result.code,
      msg: result.msg,
      data: {
        url: result.data.url,
        fileId: `F${Date.now()}`
      }
    }
  }
  return request.upload('/upload/chunk', file, onProgress)
}

// 完成分片上传
export async function completeUpload(fileId: string): Promise<ApiResponse<{ url: string }>> {
  if (USE_MOCK) {
    return {
      code: 0,
      msg: 'success',
      data: { url: `https://oss.example.com/uploads/${fileId}` }
    }
  }
  return request.post('/upload/complete', { fileId })
}
