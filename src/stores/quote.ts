import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Quote, QuoteSubmitParams, PageResult } from '@/types'
import { getMyQuoteList, submitQuote as submitQuoteApi } from '@/api/quote'

export const useQuoteStore = defineStore('quote', () => {
  const list = ref<Quote[]>([])
  const total = ref(0)
  const currentQuote = ref<Quote | null>(null)
  const loading = ref(false)
  const page = ref(1)
  const size = ref(10)
  const statusFilter = ref<string>('')

  const hasMore = computed(() => list.value.length < total.value)
  const pendingCount = computed(() => list.value.filter(q => q.status === 'pending').length)
  const wonCount = computed(() => list.value.filter(q => q.status === 'won').length)

  async function fetchList(isRefresh = false) {
    if (loading.value) return

    if (isRefresh) {
      page.value = 1
      list.value = []
    }

    loading.value = true
    try {
      const res = await getMyQuoteList({
        page: page.value,
        size: size.value,
        status: statusFilter.value || undefined
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

  function setStatusFilter(status: string) {
    statusFilter.value = status
    fetchList(true)
  }

  async function submitQuote(params: QuoteSubmitParams) {
    const res = await submitQuoteApi(params)
    if (res.code === 0 && res.data) {
      list.value.unshift(res.data)
      total.value++
      return { success: true, data: res.data }
    }
    return { success: false, message: res.msg }
  }

  // 更新报价状态（用于WebSocket推送）
  function updateQuoteStatus(quoteId: string, status: 'pending' | 'won' | 'lost') {
    const quote = list.value.find(q => q.id === quoteId)
    if (quote) {
      quote.status = status
      quote.isWinner = status === 'won'
    }
  }

  function setCurrentQuote(quote: Quote | null) {
    currentQuote.value = quote
  }

  return {
    list,
    total,
    currentQuote,
    loading,
    page,
    size,
    statusFilter,
    hasMore,
    pendingCount,
    wonCount,
    fetchList,
    loadMore,
    setStatusFilter,
    submitQuote,
    updateQuoteStatus,
    setCurrentQuote
  }
})
