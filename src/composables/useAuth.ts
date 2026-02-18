import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { rememberMeManager } from '@/utils/storage'
import { showToast } from '@/utils/notification'

export function useAuth() {
  const userStore = useUserStore()
  const router = useRouter()

  const loading = ref(false)
  const loginFailCount = ref(0)

  const needCaptcha = computed(() => loginFailCount.value >= 5)
  const isLoggedIn = computed(() => userStore.isLoggedIn)

  async function login(username: string, password: string, rememberMe: boolean = false, captcha?: string) {
    loading.value = true

    try {
      const result = await userStore.login(username, password, captcha)

      if (result.success) {
        // 处理记住密码
        if (rememberMe) {
          rememberMeManager.setRemembered(true, username, password)
        } else {
          rememberMeManager.setRemembered(false)
        }

        loginFailCount.value = 0
        showToast('登录成功', 'success')

        // 跳转到首页或目标页面
        const redirect = router.currentRoute.value.query.redirect as string
        router.push(redirect || '/demand')

        return true
      } else {
        loginFailCount.value++
        showToast(result.message || '登录失败', 'error')
        return false
      }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await userStore.logout()
    router.push('/login')
    showToast('已退出登录', 'info')
  }

  function getSavedCredentials() {
    return rememberMeManager.getSavedCredentials()
  }

  return {
    loading,
    loginFailCount,
    needCaptcha,
    isLoggedIn,
    login,
    logout,
    getSavedCredentials
  }
}
