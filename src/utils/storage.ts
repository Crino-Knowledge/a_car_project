// 本地存储键名
const KEYS = {
  TOKEN: 'supplier_token',
  REFRESH_TOKEN: 'supplier_refresh_token',
  USER_INFO: 'supplier_user_info',
  REMEMBER_ME: 'supplier_remember_me',
  LOGIN_USERNAME: 'supplier_login_username',
  LOGIN_PASSWORD: 'supplier_login_password'
}

// Token管理
export const tokenManager = {
  getToken(): string | null {
    return localStorage.getItem(KEYS.TOKEN)
  },

  setToken(token: string): void {
    localStorage.setItem(KEYS.TOKEN, token)
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(KEYS.REFRESH_TOKEN)
  },

  setRefreshToken(token: string): void {
    localStorage.setItem(KEYS.REFRESH_TOKEN, token)
  },

  clearTokens(): void {
    localStorage.removeItem(KEYS.TOKEN)
    localStorage.removeItem(KEYS.REFRESH_TOKEN)
  }
}

// 用户信息管理
export const userManager = {
  getUserInfo(): any {
    const data = localStorage.getItem(KEYS.USER_INFO)
    return data ? JSON.parse(data) : null
  },

  setUserInfo(user: any): void {
    localStorage.setItem(KEYS.USER_INFO, JSON.stringify(user))
  },

  clearUserInfo(): void {
    localStorage.removeItem(KEYS.USER_INFO)
  }
}

// 记住密码管理
export const rememberMeManager = {
  isRemembered(): boolean {
    return localStorage.getItem(KEYS.REMEMBER_ME) === 'true'
  },

  setRemembered(remember: boolean, username?: string, password?: string): void {
    if (remember) {
      localStorage.setItem(KEYS.REMEMBER_ME, 'true')
      if (username) localStorage.setItem(KEYS.LOGIN_USERNAME, username)
      if (password) localStorage.setItem(KEYS.LOGIN_PASSWORD, btoa(password)) // 简单加密
    } else {
      localStorage.removeItem(KEYS.REMEMBER_ME)
      localStorage.removeItem(KEYS.LOGIN_USERNAME)
      localStorage.removeItem(KEYS.LOGIN_PASSWORD)
    }
  },

  getSavedCredentials(): { username: string; password: string } | null {
    if (!this.isRemembered()) return null
    const username = localStorage.getItem(KEYS.LOGIN_USERNAME)
    const password = localStorage.getItem(KEYS.LOGIN_PASSWORD)
    if (username && password) {
      return { username, password: atob(password) }
    }
    return null
  }
}

// 清除所有登录相关数据
export function clearAuthData(): void {
  tokenManager.clearTokens()
  userManager.clearUserInfo()
}
