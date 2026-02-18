/**
 * 表单验证工具函数
 */

/**
 * 验证手机号
 */
export const validatePhone = (phone: string): boolean => {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证验证码（6位数字）
 */
export const validateVerifyCode = (code: string): boolean => {
  const reg = /^\d{6}$/
  return reg.test(code)
}

/**
 * 验证金额（最多两位小数）
 */
export const validateAmount = (amount: string | number): boolean => {
  const reg = /^(0|[1-9]\d*)(\.\d{1,2})?$/
  return reg.test(String(amount))
}

/**
 * 验证正整数
 */
export const validatePositiveInteger = (value: string | number): boolean => {
  const reg = /^[1-9]\d*$/
  return reg.test(String(value))
}

/**
 * 验证非空字符串
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}

/**
 * 验证字符串长度
 */
export const validateLength = (value: string, min: number, max: number): boolean => {
  const len = value.trim().length
  return len >= min && len <= max
}

/**
 * 验证日期格式（YYYY-MM-DD）
 */
export const validateDate = (date: string): boolean => {
  const reg = /^\d{4}-\d{2}-\d{2}$/
  if (!reg.test(date)) return false

  const d = new Date(date)
  return !isNaN(d.getTime())
}

/**
 * 验证日期时间格式（YYYY-MM-DD HH:mm）
 */
export const validateDateTime = (datetime: string): boolean => {
  const reg = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/
  if (!reg.test(datetime)) return false

  const d = new Date(datetime.replace(' ', 'T'))
  return !isNaN(d.getTime())
}

/**
 * 验证时间先后顺序
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns endTime 是否晚于 startTime
 */
export const validateTimeOrder = (startTime: string, endTime: string): boolean => {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  return end > start
}

/**
 * 验证文件大小
 * @param fileSize 文件大小（字节）
 * @param maxSize 最大大小（字节）
 */
export const validateFileSize = (fileSize: number, maxSize: number): boolean => {
  return fileSize <= maxSize
}

/**
 * 验证文件类型
 * @param fileType 文件 MIME 类型
 * @param allowedTypes 允许的类型列表
 */
export const validateFileType = (fileType: string, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(fileType)
}

/**
 * 表单验证结果
 */
export interface ValidationResult {
  valid: boolean
  message: string
}

/**
 * 验证采购发布表单
 */
export const validatePurchaseForm = (formData: {
  categoryId: string
  partName: string
  quantity: number
  budget: number
  expectedArrivalTime: string
  quoteDeadline: string
}): ValidationResult => {
  if (!formData.categoryId) {
    return { valid: false, message: '请选择配件分类' }
  }
  if (!validateRequired(formData.partName)) {
    return { valid: false, message: '请输入配件名称' }
  }
  if (!validatePositiveInteger(formData.quantity)) {
    return { valid: false, message: '请输入有效的数量' }
  }
  if (!validateAmount(formData.budget) || formData.budget <= 0) {
    return { valid: false, message: '请输入有效的预算金额' }
  }
  if (!validateDateTime(formData.expectedArrivalTime)) {
    return { valid: false, message: '请选择期望到货时间' }
  }
  if (!validateDateTime(formData.quoteDeadline)) {
    return { valid: false, message: '请选择报价截止时间' }
  }
  if (!validateTimeOrder(formData.quoteDeadline, formData.expectedArrivalTime)) {
    return { valid: false, message: '报价截止时间必须早于期望到货时间' }
  }
  return { valid: true, message: '' }
}
