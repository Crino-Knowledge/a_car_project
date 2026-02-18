/**
 * 登录页面
 */
import { View, Text, Input, Button } from '@tarojs/components'
import { FC, useState } from 'react'
import Taro from '@tarojs/taro'
import { useDispatch } from 'react-redux'
import { setUserInfo } from '@/store/slices/user'
import { wechatLogin, bindPhone } from '@/services'
import { validatePhone, validateVerifyCode } from '@/utils/validator'
import type { UserInfo } from '@/types/api'
import './index.scss'

const Login: FC = () => {
  const dispatch = useDispatch()
  const [step, setStep] = useState<'login' | 'bindPhone'>('login')
  const [phone, setPhone] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)

  // 微信登录
  const handleWechatLogin = async () => {
    setLoading(true)
    try {
      // 获取微信登录凭证
      const { code } = await Taro.login()

      // 调用登录接口
      const result = await wechatLogin({ code })

      if (result.isNewUser) {
        // 新用户，需要绑定手机号
        setStep('bindPhone')
      } else {
        // 老用户，直接登录成功
        dispatch(setUserInfo(result.userInfo))
        Taro.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/index/index' })
        }, 1500)
      }
    } catch (error: any) {
      console.error('登录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 发送验证码
  const handleSendCode = async () => {
    if (!validatePhone(phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    if (countdown > 0) return

    try {
      // 调用发送验证码接口（模拟）
      Taro.showToast({ title: '验证码已发送', icon: 'success' })

      // 开始倒计时
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      console.error('发送验证码失败:', error)
    }
  }

  // 绑定手机号
  const handleBindPhone = async () => {
    if (!validatePhone(phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    if (!validateVerifyCode(verifyCode)) {
      Taro.showToast({ title: '请输入6位验证码', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      const result = await bindPhone({ phone, code: verifyCode })
      dispatch(setUserInfo(result.userInfo))
      Taro.showToast({ title: '绑定成功', icon: 'success' })
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' })
      }, 1500)
    } catch (error) {
      console.error('绑定手机号失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="page-login">
      <View className="login-header">
        <View className="login-header__logo">🚗</View>
        <Text className="login-header__title">汽服配件采购系统</Text>
        <Text className="login-header__subtitle">高效、透明、可追溯</Text>
      </View>

      {step === 'login' ? (
        <View className="login-content">
          <Button
            className="login-btn login-btn--wechat"
            onClick={handleWechatLogin}
            loading={loading}
          >
            微信一键登录
          </Button>
          <Text className="login-tip">登录即表示同意《用户协议》和《隐私政策》</Text>
        </View>
      ) : (
        <View className="login-content">
          <View className="login-form">
            <View className="login-form__item">
              <Input
                className="login-form__input"
                type="number"
                maxlength={11}
                placeholder="请输入手机号"
                value={phone}
                onInput={(e) => setPhone(e.detail.value)}
              />
            </View>
            <View className="login-form__item login-form__item--code">
              <Input
                className="login-form__input"
                type="number"
                maxlength={6}
                placeholder="请输入验证码"
                value={verifyCode}
                onInput={(e) => setVerifyCode(e.detail.value)}
              />
              <View
                className={`login-form__code ${countdown > 0 ? 'login-form__code--disabled' : ''}`}
                onClick={handleSendCode}
              >
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </View>
            </View>
          </View>
          <Button
            className="login-btn login-btn--primary"
            onClick={handleBindPhone}
            loading={loading}
          >
            绑定手机号
          </Button>
          <Text className="login-tip">首次登录需绑定手机号</Text>
        </View>
      )}
    </View>
  )
}

export default Login
