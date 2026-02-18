<template>
  <div class="demand-card" @click="$emit('click')">
    <div class="card-header">
      <span class="demand-no">{{ demand.demandNo }}</span>
      <span :class="['status-tag', statusClass]">{{ statusText }}</span>
    </div>

    <h3 class="card-title">{{ demand.title }}</h3>

    <div class="card-info">
      <div class="info-item">
        <span class="label">分类:</span>
        <span class="value">{{ demand.category }}</span>
      </div>
      <div class="info-item">
        <span class="label">品牌:</span>
        <span class="value">{{ demand.brand }}</span>
      </div>
      <div class="info-item">
        <span class="label">数量:</span>
        <span class="value">{{ demand.quantity }} 件</span>
      </div>
    </div>

    <div class="card-budget">
      <span class="label">预算:</span>
      <span class="price">{{ demand.budgetMin }} - {{ demand.budgetMax }} 元</span>
    </div>

    <div class="card-footer">
      <div class="store-info">
        <el-icon><Shop /></el-icon>
        <span>{{ demand.storeInfo.name }}</span>
      </div>
      <div class="deadline">
        <span v-if="isExpired" class="expired">已截止</span>
        <span v-else>
          <el-icon><Clock /></el-icon>
          {{ remainingTime }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Shop, Clock } from '@element-plus/icons-vue'
import type { Demand } from '@/types'

const props = defineProps<{
  demand: Demand
}>()

defineEmits(['click'])

const isExpired = computed(() => {
  return new Date(props.demand.deadline) < new Date()
})

const statusText = computed(() => {
  if (isExpired.value) return '已截止'
  return '待报价'
})

const statusClass = computed(() => {
  if (isExpired.value) return 'status-closed'
  return 'status-pending'
})

const remainingTime = computed(() => {
  const now = new Date().getTime()
  const deadline = new Date(props.demand.deadline).getTime()
  const diff = deadline - now

  if (diff <= 0) return '已截止'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `剩余 ${days} 天 ${hours} 小时`
  return `剩余 ${hours} 小时`
})
</script>

<style lang="scss" scoped>
.demand-card {
  padding: 16px;
  background: $bg-card;
  border-radius: $radius-lg;
  border: 1px solid $border-color;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: $shadow-md;
    border-color: $primary-color;
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .demand-no {
      font-size: 12px;
      color: $text-secondary;
    }

    .status-tag {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;

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

  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 12px;
    line-height: 1.4;
  }

  .card-info {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 12px;

    .info-item {
      font-size: 13px;

      .label {
        color: $text-secondary;
      }

      .value {
        color: $text-primary;
        font-weight: 500;
      }
    }
  }

  .card-budget {
    padding: 8px 12px;
    background: rgba($primary-color, 0.05);
    border-radius: $radius-md;
    margin-bottom: 12px;
    font-size: 14px;

    .label {
      color: $text-secondary;
    }

    .price {
      color: $primary-color;
      font-weight: 600;
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid $border-light;
    font-size: 12px;
    color: $text-secondary;

    .store-info {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .deadline {
      display: flex;
      align-items: center;
      gap: 4px;

      .expired {
        color: $danger-color;
      }
    }
  }
}
</style>
