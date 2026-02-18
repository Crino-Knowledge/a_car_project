<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>汽服配件采购报价系统</h1>
        <p>供应商端登录</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入账号/邮箱"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item v-if="needCaptcha" prop="captcha">
          <div class="captcha-row">
            <el-input
              v-model="form.captcha"
              placeholder="请输入验证码"
              size="large"
              :prefix-icon="Key"
            />
            <div class="captcha-img" @click="refreshCaptcha">
              <canvas ref="captchaCanvas" width="120" height="40"></canvas>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="form.rememberMe">记住密码</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p>测试账号: admin / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElForm, FormRules } from 'element-plus'
import { User, Lock, Key } from '@element-plus/icons-vue'
import { useAuth } from '@/composables/useAuth'
import { createRequiredRule } from '@/utils/validator'

const formRef = ref<InstanceType<typeof ElForm>>()
const captchaCanvas = ref<HTMLCanvasElement>()

const { loading, needCaptcha, loginFailCount, login, getSavedCredentials } = useAuth()

const form = reactive({
  username: '',
  password: '',
  captcha: '',
  rememberMe: false
})

const rules = reactive<FormRules>({
  username: [createRequiredRule('请输入账号')],
  password: [createRequiredRule('请输入密码')],
  captcha: [{ required: false, message: '请输入验证码', trigger: 'blur' }]
})

// 根据登录失败次数动态设置验证码规则
const dynamicRules = computed(() => {
  if (needCaptcha.value) {
    rules.captcha = [createRequiredRule('请输入验证码')]
  } else {
    rules.captcha = []
  }
  return rules
})

// 刷新验证码
function refreshCaptcha() {
  if (!captchaCanvas.value) return

  const canvas = captchaCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 清空画布
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 生成随机验证码
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  // 绘制验证码
  ctx.font = 'bold 28px Arial'
  ctx.textBaseline = 'middle'

  for (let i = 0; i < code.length; i++) {
    const x = 15 + i * 25
    const y = 20
    const deg = (Math.random() * 30 - 15) * Math.PI / 180

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(deg)
    ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 40%)`
    ctx.fillText(code[i], 0, 0)
    ctx.restore()
  }

  // 绘制干扰线
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.stroke()
  }

  // 绘制干扰点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
    ctx.beginPath()
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI)
    ctx.fill()
  }

  // 存储验证码（实际应该在后端存储）
  ;(window as any).__captchaCode = code.toLowerCase()
}

// 登录处理
async function handleLogin() {
  const valid = await formRef.value?.validate()
  if (!valid) return

  // 如果需要验证码，校验验证码
  if (needCaptcha.value && form.captcha.toLowerCase() !== (window as any).__captchaCode) {
    // 增加失败计数
    loginFailCount.value++
    refreshCaptcha()
    return
  }

  const success = await login(form.username, form.password, form.rememberMe, form.captcha)
  if (!success) {
    refreshCaptcha()
  }
}

// 初始化
onMounted(() => {
  // 恢复保存的账号密码
  const saved = getSavedCredentials()
  if (saved) {
    form.username = saved.username
    form.password = saved.password
    form.rememberMe = true
  }

  // 如果需要验证码，生成验证码
  nextTick(() => {
    if (needCaptcha.value) {
      refreshCaptcha()
    }
  })
})
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: $bg-card;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 8px;
  }

  p {
    font-size: 14px;
    color: $text-secondary;
    margin: 0;
  }
}

.login-form {
  .captcha-row {
    display: flex;
    gap: 12px;
    width: 100%;

    .el-input {
      flex: 1;
    }

    .captcha-img {
      width: 120px;
      height: 40px;
      border: 1px solid $border-color;
      border-radius: 4px;
      cursor: pointer;
      overflow: hidden;

      &:hover {
        border-color: $primary-color;
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 44px;
    font-size: 16px;
  }
}

.login-footer {
  margin-top: 20px;
  text-align: center;

  p {
    font-size: 12px;
    color: $text-secondary;
    margin: 0;
  }
}
</style>
