import { onMounted, onUnmounted } from 'vue'
import { requestNotificationPermission, sendBrowserNotification, playNotificationSound } from '@/utils/notification'

export function useNotification() {
  let permissionGranted = false

  async function init() {
    permissionGranted = await requestNotificationPermission()
  }

  function notify(title: string, body: string) {
    if (permissionGranted) {
      sendBrowserNotification(title, { body })
    }
    playNotificationSound()
  }

  onMounted(() => {
    init()
  })

  return {
    notify,
    permissionGranted
  }
}
