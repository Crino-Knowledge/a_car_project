import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { tokenManager, userManager, clearAuthData } from '@/utils/storage'
import { login as loginApi, logout as logoutApi } from '@/api/auth'
import { requestNotificationPermission } from '@/utils/notification'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(tokenManager.getToken())
  const userInfo = ref<User | null>(userManager.getUserInfo())
  const loginFailCount = ref(0)

  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)
  const needCaptcha = computed(() => loginFailCount.value >= 5)

  async function login(username: string, password: string, captcha?: string) {
    const res = await loginApi({ username, password, captcha })

    if (res.code === 0 && res.data) {
      token.value = res.data.token
      userInfo.value = res.data.userInfo
      tokenManager.setToken(res.data.token)
      tokenManager.setRefreshToken(res.data.refreshToken)
      userManager.setUserInfo(res.data.userInfo)
      loginFailCount.value = 0

      // 请求通知权限
      requestNotificationPermission()

      return { success: true }
    } else {
      loginFailCount.value++
      return { success: false, message: res.msg }
    }
  }

  async function logout() {
    try {
      await logoutApi()
    } catch (e) {
      // ignore
    }

    token.value = null
    userInfo.value = null
    clearAuthData()
  }

  function updateUserInfo(info: Partial<User>) {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...info }
      userManager.setUserInfo(userInfo.value)
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    needCaptcha,
    login,
    logout,
    updateUserInfo
  }
})
