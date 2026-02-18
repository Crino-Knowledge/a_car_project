// 手机号验证
export function validatePhone(phone: string): boolean {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

// 邮箱验证
export function validateEmail(email: string): boolean {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return reg.test(email)
}

// 价格验证（正数，最多两位小数）
export function validatePrice(price: string | number): boolean {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num) || num <= 0) return false
  const str = num.toString()
  const parts = str.split('.')
  if (parts.length > 1 && parts[1].length > 2) return false
  return true
}

// 数量验证（正整数）
export function validateQuantity(quantity: string | number): boolean {
  const num = typeof quantity === 'string' ? parseInt(quantity) : quantity
  return !isNaN(num) && num > 0 && Number.isInteger(num)
}

// 送货单号验证
export function validateTrackingNumber(trackingNo: string): boolean {
  // 支持多种快递单号格式
  const reg = /^[A-Za-z0-9]{8,30}$/
  return reg.test(trackingNo)
}

// 密码强度验证（至少6位）
export function validatePassword(password: string): boolean {
  return password.length >= 6
}

// 非空验证
export function validateRequired(value: any): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

// 文件大小验证（默认2MB）
export function validateFileSize(file: File, maxSizeMB: number = 2): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxBytes
}

// 文件类型验证
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  const mimeType = file.type.toLowerCase()

  return allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return ext === type.slice(1).toLowerCase()
    }
    if (type.includes('*')) {
      const [mainType] = type.split('/')
      return mimeType.startsWith(mainType)
    }
    return mimeType === type || ext === type
  })
}

// 表单验证规则生成器
export function createRequiredRule(message: string = '此项为必填项') {
  return { required: true, message, trigger: 'blur' }
}

export function createPhoneRule() {
  return {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入有效的手机号码',
    trigger: 'blur'
  }
}

export function createEmailRule() {
  return {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: '请输入有效的邮箱地址',
    trigger: 'blur'
  }
}

export function createPriceRule() {
  return {
    validator: (rule: any, value: any, callback: any) => {
      if (!validatePrice(value)) {
        callback(new Error('请输入有效的价格（正数，最多两位小数）'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }
}
