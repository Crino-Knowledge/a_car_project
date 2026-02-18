import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useDemandStore } from '@/stores/demand'
import { useQuoteStore } from '@/stores/quote'
import { notifyNewDemand, notifyQuoteWon, notifyQuoteLost, playNotificationSound } from '@/utils/notification'
import type { WSMessage, Demand, Quote } from '@/types'

export function useWebSocket() {
  const isConnected = ref(false)
  const userStore = useUserStore()
  const demandStore = useDemandStore()
  const quoteStore = useQuoteStore()

  let ws: WebSocket | null = null
  let reconnectTimer: number | null = null
  let mockInterval: number | null = null

  function connect() {
    if (!userStore.isLoggedIn) return

    // 使用模拟WebSocket
    startMockWebSocket()
  }

  function disconnect() {
    if (ws) {
      ws.close()
      ws = null
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (mockInterval) {
      clearInterval(mockInterval)
      mockInterval = null
    }
    isConnected.value = false
  }

  // 模拟WebSocket消息推送
  function startMockWebSocket() {
    isConnected.value = true

    // 每30秒随机推送一个消息
    mockInterval = window.setInterval(() => {
      const random = Math.random()

      if (random < 0.3) {
        // 模拟新需求推送
        const newDemand: Demand = {
          id: `D${Date.now()}`,
          demandNo: `D${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000)}`,
          title: '紧急采购需求 - 刹车片',
          description: '急需刹车片配件，请尽快报价',
          category: '制动系统',
          brand: '博世',
          quantity: 5,
          budgetMin: 200,
          budgetMax: 400,
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          createdAt: new Date().toISOString(),
          attachments: [],
          storeInfo: {
            id: 'S99',
            name: '测试门店',
            contact: '测试联系人',
            phone: '13800000000',
            address: '测试地址'
          }
        }

        const message: WSMessage = {
          type: 'NEW_DEMAND',
          data: newDemand,
          timestamp: Date.now()
        }

        handleMessage(message)
      } else if (random < 0.5) {
        // 模拟中标通知
        const message: WSMessage = {
          type: 'QUOTE_STATUS_UPDATE',
          data: {
            quoteId: quoteStore.list[0]?.id || 'Q001',
            status: 'won'
          },
          timestamp: Date.now()
        }

        handleMessage(message)
      }
    }, 30000)

    // 初始连接后推送一条测试消息
    setTimeout(() => {
      const newDemand: Demand = {
        id: `D${Date.now()}`,
        demandNo: `D${new Date().toISOString().slice(0, 10).replace(/-/g, '')}999`,
        title: '新发布采购需求 - 机油滤清器',
        description: '需要采购机油滤清器若干',
        category: '滤清器',
        brand: '曼牌',
        quantity: 20,
        budgetMin: 50,
        budgetMax: 100,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        attachments: [],
        storeInfo: {
          id: 'S88',
          name: '示例门店',
          contact: '李经理',
          phone: '13900000000',
          address: '示例地址'
        }
      }

      handleMessage({
        type: 'NEW_DEMAND',
        data: newDemand,
        timestamp: Date.now()
      })
    }, 5000)
  }

  function handleMessage(message: WSMessage) {
    console.log('[WebSocket] Received message:', message)

    switch (message.type) {
      case 'NEW_DEMAND':
        handleNewDemand(message.data as Demand)
        break
      case 'QUOTE_STATUS_UPDATE':
        handleQuoteStatusUpdate(message.data)
        break
      default:
        console.log('[WebSocket] Unknown message type:', message.type)
    }
  }

  function handleNewDemand(demand: Demand) {
    // 添加到需求列表
    demandStore.addNewDemand(demand)

    // 发送通知
    notifyNewDemand(demand.title)

    // 更新角标（这里简化为更新页面标题）
    updateBadge()
  }

  function handleQuoteStatusUpdate(data: { quoteId: string; status: string }) {
    const quote = quoteStore.list.find(q => q.id === data.quoteId)
    const demandTitle = quote?.demandTitle || '采购需求'

    quoteStore.updateQuoteStatus(data.quoteId, data.status as any)

    if (data.status === 'won') {
      notifyQuoteWon(demandTitle)
    } else if (data.status === 'lost') {
      notifyQuoteLost(demandTitle)
    }

    playNotificationSound()
  }

  function updateBadge() {
    // 更新页面标题显示未读数
    const unreadCount = demandStore.list.filter(d => d.status === 'pending').length
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) 待应标清单 - 汽服配件采购报价系统`
    }
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    connect,
    disconnect
  }
}
