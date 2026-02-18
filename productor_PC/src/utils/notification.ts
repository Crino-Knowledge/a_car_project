import { ElNotification, ElMessage } from 'element-plus'

// 浏览器通知权限请求
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('浏览器不支持通知功能')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

// 发送浏览器通知
export function sendBrowserNotification(
  title: string,
  options: NotificationOptions = {}
): Notification | null {
  if (Notification.permission !== 'granted') {
    console.warn('未获得通知权限')
    return null
  }

  const notification = new Notification(title, {
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    requireInteraction: false,
    ...options
  })

  notification.onclick = () => {
    window.focus()
    notification.close()
  }

  return notification
}

// 播放提示音
export function playNotificationSound(): void {
  try {
    // 创建音频上下文生成提示音
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (error) {
    console.warn('播放提示音失败:', error)
  }
}

// Toast消息类型
type ToastType = 'success' | 'warning' | 'info' | 'error'

// 显示Toast消息
export function showToast(
  message: string,
  type: ToastType = 'info',
  duration: number = 3000
): void {
  ElMessage({
    message,
    type,
    duration,
    showClose: true
  })
}

// 显示通知（页面内）
export function showNotification(
  title: string,
  message: string,
  type: ToastType = 'info'
): void {
  ElNotification({
    title,
    message,
    type,
    duration: 4500,
    position: 'top-right'
  })
}

// 新需求通知
export function notifyNewDemand(demandTitle: string): void {
  // 浏览器通知
  sendBrowserNotification('新采购需求', {
    body: demandTitle,
    tag: 'new-demand'
  })

  // 声音提醒
  playNotificationSound()

  // 页面内通知
  showNotification('新采购需求', demandTitle, 'info')
}

// 中标通知
export function notifyQuoteWon(demandTitle: string): void {
  // 浏览器通知
  sendBrowserNotification('恭喜中标！', {
    body: `您在"${demandTitle}"的报价已中标`,
    tag: 'quote-won'
  })

  // 声音提醒
  playNotificationSound()

  // 页面内通知
  showNotification('恭喜中标！', `您在"${demandTitle}"的报价已中标`, 'success')
}

// 未中标通知
export function notifyQuoteLost(demandTitle: string): void {
  showNotification('报价结果', `很遗憾，您在"${demandTitle}"的报价未中标`, 'warning')
}

// 发货成功通知
export function notifyShippingSuccess(): void {
  showToast('发货信息提交成功', 'success')
}
