<template>
  <div class="demand-detail-page">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft">返回列表</el-button>
    </div>

    <div class="detail-content" v-loading="loading">
      <div class="main-card card">
        <div class="card-header">
          <div class="header-left">
            <span class="demand-no">{{ demand?.demandNo }}</span>
            <span :class="['status-tag', statusClass]">{{ statusText }}</span>
          </div>
          <div class="deadline" v-if="demand && !isExpired">
            <el-icon><Clock /></el-icon>
            <span>{{ remainingTime }}</span>
          </div>
        </div>

        <h2 class="title">{{ demand?.title }}</h2>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">配件分类</span>
            <span class="value">{{ demand?.category }}</span>
          </div>
          <div class="info-item">
            <span class="label">品牌要求</span>
            <span class="value">{{ demand?.brand }}</span>
          </div>
          <div class="info-item">
            <span class="label">需求数量</span>
            <span class="value">{{ demand?.quantity }} 件</span>
          </div>
          <div class="info-item">
            <span class="label">预算范围</span>
            <span class="value price">{{ demand?.budgetMin }} - {{ demand?.budgetMax }} 元</span>
          </div>
          <div class="info-item">
            <span class="label">发布时间</span>
            <span class="value">{{ formatDate(demand?.createdAt) }}</span>
          </div>
          <div class="info-item">
            <span class="label">截止时间</span>
            <span class="value">{{ formatDate(demand?.deadline) }}</span>
          </div>
        </div>

        <div class="description">
          <h4>需求描述</h4>
          <p>{{ demand?.description }}</p>
        </div>

        <div class="store-info">
          <h4>门店信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">门店名称</span>
              <span class="value">{{ demand?.storeInfo?.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">联系人</span>
              <span class="value">{{ demand?.storeInfo?.contact }}</span>
            </div>
            <div class="info-item">
              <span class="label">联系电话</span>
              <span class="value">{{ demand?.storeInfo?.phone }}</span>
            </div>
            <div class="info-item">
              <span class="label">地址</span>
              <span class="value">{{ demand?.storeInfo?.address }}</span>
            </div>
          </div>
        </div>

        <div class="action-bar" v-if="canQuote">
          <el-button type="primary" size="large" @click="goToQuote">
            立即报价
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Clock } from '@element-plus/icons-vue'
import { getDemandDetail } from '@/api/demand'
import type { Demand } from '@/types'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const demand = ref<Demand | null>(null)

const isExpired = computed(() => {
  if (!demand.value) return true
  return new Date(demand.value.deadline) < new Date()
})

const statusText = computed(() => {
  if (isExpired.value) return '已截止'
  return '待报价'
})

const statusClass = computed(() => {
  if (isExpired.value) return 'status-closed'
  return 'status-pending'
})

const canQuote = computed(() => {
  return demand.value && !isExpired.value && demand.value.status === 'pending'
})

const remainingTime = computed(() => {
  if (!demand.value) return ''

  const now = new Date().getTime()
  const deadline = new Date(demand.value.deadline).getTime()
  const diff = deadline - now

  if (diff <= 0) return '已截止'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `剩余 ${days} 天 ${hours} 小时`
  if (hours > 0) return `剩余 ${hours} 小时 ${minutes} 分钟`
  return `剩余 ${minutes} 分钟`
})

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function goBack() {
  router.push('/demand')
}

function goToQuote() {
  if (demand.value) {
    router.push(`/quote/submit/${demand.value.id}`)
  }
}

async function fetchDetail() {
  const id = route.params.id as string
  if (!id) return

  loading.value = true
  try {
    const res = await getDemandDetail(id)
    if (res.code === 0 && res.data) {
      demand.value = res.data
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style lang="scss" scoped>
.demand-detail-page {
  .page-header {
    margin-bottom: 16px;
  }

  .main-card {
    padding: 24px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .demand-no {
          font-size: 14px;
          color: $text-secondary;
        }

        .status-tag {
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;

          &.status-pending {
            background: rgba($primary-color, 0.1);
            color: $primary-color;
          }

          &.status-closed {
            background: rgba($text-secondary, 0.1);
            color: $text-secondary;
          }
        }
      }

      .deadline {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        color: $warning-color;
      }
    }

    .title {
      font-size: 22px;
      font-weight: 600;
      color: $text-primary;
      margin: 0 0 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 24px;

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      .info-item {
        .label {
          display: block;
          font-size: 12px;
          color: $text-secondary;
          margin-bottom: 4px;
        }

        .value {
          font-size: 14px;
          color: $text-primary;
          font-weight: 500;

          &.price {
            color: $primary-color;
          }
        }
      }
    }

    .description, .store-info {
      padding: 20px;
      background: $bg-page;
      border-radius: $radius-md;
      margin-bottom: 20px;

      h4 {
        font-size: 14px;
        font-weight: 600;
        color: $text-primary;
        margin: 0 0 12px;
      }

      p {
        font-size: 14px;
        color: $text-regular;
        line-height: 1.8;
        margin: 0;
      }

      .info-grid {
        margin-bottom: 0;
      }
    }

    .action-bar {
      display: flex;
      justify-content: center;
      padding-top: 20px;
      border-top: 1px solid $border-light;
    }
  }
}
</style>
