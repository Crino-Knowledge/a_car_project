<template>
  <div class="demand-list-page">
    <div class="page-header">
      <h2>待应标清单</h2>
      <p>查看门店发布的采购需求，及时响应报价</p>
    </div>

    <!-- 筛选区 -->
    <div class="filter-card card">
      <el-form :model="filterForm" inline>
        <el-form-item label="配件分类">
          <el-select v-model="filterForm.category" placeholder="全部分类" clearable style="width: 160px">
            <el-option
              v-for="item in categoryOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="filterForm.brand" placeholder="全部品牌" clearable style="width: 160px">
            <el-option
              v-for="item in brandOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="待报价" value="pending" />
            <el-option label="已截止" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 需求列表 -->
    <div class="demand-list" v-loading="loading">
      <template v-if="demandList.length > 0">
        <DemandCard
          v-for="item in demandList"
          :key="item.id"
          :demand="item"
          @click="handleCardClick(item)"
        />

        <!-- 加载更多 -->
        <div class="load-more" v-if="hasMore">
          <el-button @click="handleLoadMore" :loading="loading">加载更多</el-button>
        </div>
      </template>

      <el-empty v-else description="暂无采购需求" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDemandStore } from '@/stores/demand'
import { useWebSocket } from '@/composables/useWebSocket'
import { categoryOptions, brandOptions } from '@/mock'
import DemandCard from '@/components/DemandCard.vue'
import type { Demand } from '@/types'

const router = useRouter()
const demandStore = useDemandStore()

// 初始化WebSocket连接
useWebSocket()

const filterForm = reactive({
  category: '',
  brand: '',
  status: ''
})

const loading = computed(() => demandStore.loading)
const demandList = computed(() => demandStore.list)
const hasMore = computed(() => demandStore.hasMore)

// 搜索
function handleSearch() {
  demandStore.setFilter({
    category: filterForm.category || undefined,
    brand: filterForm.brand || undefined,
    status: filterForm.status || undefined
  })
}

// 重置
function handleReset() {
  filterForm.category = ''
  filterForm.brand = ''
  filterForm.status = ''
  demandStore.setFilter({})
}

// 加载更多
function handleLoadMore() {
  demandStore.loadMore()
}

// 点击卡片
function handleCardClick(item: Demand) {
  router.push(`/demand/${item.id}`)
}

onMounted(() => {
  demandStore.fetchList(true)
})
</script>

<style lang="scss" scoped>
.demand-list-page {
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

  .filter-card {
    padding: 16px 20px;
    margin-bottom: 20px;
  }

  .demand-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 16px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .load-more {
    grid-column: 1 / -1;
    text-align: center;
    padding: 20px;
  }
}
</style>
