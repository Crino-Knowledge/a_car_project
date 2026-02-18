import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Demand, DemandFilter, PageResult } from '@/types'
import { getDemandList } from '@/api/demand'

export const useDemandStore = defineStore('demand', () => {
  const list = ref<Demand[]>([])
  const total = ref(0)
  const currentDemand = ref<Demand | null>(null)
  const loading = ref(false)
  const page = ref(1)
  const size = ref(10)
  const filter = ref<DemandFilter>({})

  const hasMore = computed(() => list.value.length < total.value)

  async function fetchList(isRefresh = false) {
    if (loading.value) return

    if (isRefresh) {
      page.value = 1
      list.value = []
    }

    loading.value = true
    try {
      const res = await getDemandList({
        page: page.value,
        size: size.value,
        ...filter.value
      })

      if (res.code === 0 && res.data) {
        if (isRefresh) {
          list.value = res.data.list
        } else {
          list.value.push(...res.data.list)
        }
        total.value = res.data.total
      }
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    if (!hasMore.value) return
    page.value++
    await fetchList()
  }

  function setFilter(newFilter: DemandFilter) {
    filter.value = { ...newFilter }
    fetchList(true)
  }

  function setCurrentDemand(demand: Demand | null) {
    currentDemand.value = demand
  }

  // 添加新需求（用于WebSocket推送）
  function addNewDemand(demand: Demand) {
    list.value.unshift(demand)
    total.value++
  }

  return {
    list,
    total,
    currentDemand,
    loading,
    page,
    size,
    filter,
    hasMore,
    fetchList,
    loadMore,
    setFilter,
    setCurrentDemand,
    addNewDemand
  }
})
