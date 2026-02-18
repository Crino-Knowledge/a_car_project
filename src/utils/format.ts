/**
 * 格式化工具函数
 */

/**
 * 格式化金额
 * @param amount 金额
 * @param decimals 小数位数
 */
export const formatAmount = (amount: number, decimals: number = 2): string => {
  return amount.toFixed(decimals)
}

/**
 * 格式化金额（带千分位）
 */
export const formatAmountWithComma = (amount: number, decimals: number = 2): string => {
  const parts = amount.toFixed(decimals).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

/**
 * 格式化日期
 * @param date 日期对象或字符串
 * @param format 格式字符串
 */
export const formatDate = (date: Date | string, format: string = 'YYYY-MM-DD'): string => {
  const d = typeof date === 'string' ? new Date(date) : date

  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化时间（相对时间）
 */
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) {
    return formatDate(d, 'MM-DD HH:mm')
  } else if (days > 0) {
    return `${days}天前`
  } else if (hours > 0) {
    return `${hours}小时前`
  } else if (minutes > 0) {
    return `${minutes}分钟前`
  } else {
    return '刚刚'
  }
}

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + units[i]
}

/**
 * 格式化手机号（隐藏中间4位）
 */
export const formatPhoneHidden = (phone: string): string => {
  if (!phone || phone.length !== 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化时长（小时转天时分）
 */
export const formatDuration = (hours: number): string => {
  if (hours < 24) {
    return `${hours}小时`
  }

  const days = Math.floor(hours / 24)
  const remainHours = hours % 24

  if (remainHours === 0) {
    return `${days}天`
  }
  return `${days}天${remainHours}小时`
}

/**
 * 格式化订单号（每4位一组）
 */
export const formatOrderNo = (orderNo: string): string => {
  return orderNo.replace(/(.{4})/g, '$1 ').trim()
}

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

/**
 * 生成订单号
 */
export const generateOrderNo = (prefix: string = 'PO'): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')

  return `${prefix}${year}${month}${day}${random}`
}
