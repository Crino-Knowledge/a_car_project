<template>
  <div class="my-quotes-page">
    <div class="page-header">
      <h2>我的应标</h2>
      <p>查看历史报价记录及中标状态</p>
    </div>

    <!-- 状态筛选 -->
    <div class="filter-bar card">
      <el-radio-group v-model="statusFilter" @change="handleFilterChange">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button value="pending">待开标</el-radio-button>
        <el-radio-button value="won">中标</el-radio-button>
        <el-radio-button value="lost">未中标</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 报价列表 -->
    <div class="quotes-table card" v-loading="loading">
      <el-table :data="quoteList" style="width: 100%">
        <el-table-column prop="quoteNo" label="报价单号" width="180">
          <template #default="{ row }">
            <el-link type="primary" @click="viewDetail(row)">{{ row.quoteNo }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="demandTitle" label="采购需求" min-width="200">
          <template #default="{ row }">
            <span class="demand-title">{{ row.demandTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="报价金额" width="120">
          <template #default="{ row }">
            <span class="price">{{ row.price }} 元</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="报价时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'won'"
              type="primary"
              size="small"
              @click="goToShipping(row)"
            >
              发货
            </el-button>
            <el-button
              v-else
              size="small"
              @click="viewDetail(row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-bar">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="10"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuoteStore } from '@/stores/quote'
import { useWebSocket } from '@/composables/useWebSocket'
import type { Quote } from '@/types'

const router = useRouter()
const quoteStore = useQuoteStore()

// 初始化WebSocket
useWebSocket()

const statusFilter = ref('')
const currentPage = ref(1)

const loading = computed(() => quoteStore.loading)
const quoteList = computed(() => quoteStore.list)
const total = computed(() => quoteStore.total)

function getStatusType(status: string) {
  const map: Record<string, string> = {
    pending: 'info',
    won: 'success',
    lost: 'info'
  }
  return map[status] || 'info'
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    pending: '待开标',
    won: '中标',
    lost: '未中标'
  }
  return map[status] || status
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function handleFilterChange() {
  currentPage.value = 1
  quoteStore.setStatusFilter(statusFilter.value)
}

function handlePageChange(page: number) {
  currentPage.value = page
  quoteStore.fetchList(true)
}

function viewDetail(row: Quote) {
  router.push(`/demand/${row.demandId}`)
}

function goToShipping(row: Quote) {
  router.push(`/shipping/${row.id}`)
}

onMounted(() => {
  quoteStore.fetchList(true)
})
</script>

<style lang="scss" scoped>
.my-quotes-page {
  .page-header {
    margin-bottom: 20px;

    h2 {
      font-size: 20px;
      font-weight: 600;
      color: $text-primary;
      margin: 0 0 4px;
    }

    p {
      font-size: 14px;
      color: $text-secondary;
      margin: 0;
    }
  }

  .filter-bar {
    padding: 16px 20px;
    margin-bottom: 20px;
  }

  .quotes-table {
    padding: 20px;

    .demand-title {
      color: $text-primary;
    }

    .price {
      font-weight: 600;
      color: $primary-color;
    }
  }

  .pagination-bar {
    display: flex;
    justify-content: flex-end;
    padding-top: 16px;
    border-top: 1px solid $border-light;
    margin-top: 16px;
  }
}
</style>
