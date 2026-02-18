/**
 * 报价列表页
 */
import { View, Text } from '@tarojs/components'
import { FC, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { getQuoteList } from '@/services'
import StatusTag from '@/components/StatusTag'
import Loading from '@/components/Loading'
import { formatDuration } from '@/utils/format'
import type { Quote } from '@/types/quote'
import './index.scss'

const QuoteList: FC = () => {
  const { purchaseId } = Taro.getCurrentInstance().router?.params || {}
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'price' | 'deliveryTime'>('price')

  useEffect(() => {
    loadQuotes()
  }, [purchaseId, sortBy])

  const loadQuotes = async () => {
    if (!purchaseId) return

    setLoading(true)
    try {
      const result = await getQuoteList({
        purchaseId,
        sortBy,
        sortOrder: 'asc'
      })
      setQuotes(result)
    } catch (error) {
      console.error('加载报价失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNavigateToDetail = (quoteId: string) => {
    Taro.navigateTo({
      url: `/pages/quote/detail/index?purchaseId=${purchaseId}&quoteId=${quoteId}`
    })
  }

  if (loading) {
    return <Loading text="加载中..." fullscreen />
  }

  return (
    <View className="page-quote-list">
      {/* 排序选项 */}
      <View className="sort-bar">
        <View
          className={`sort-item ${sortBy === 'price' ? 'sort-item--active' : ''}`}
          onClick={() => setSortBy('price')}
        >
          按价格排序
        </View>
        <View
          className={`sort-item ${sortBy === 'deliveryTime' ? 'sort-item--active' : ''}`}
          onClick={() => setSortBy('deliveryTime')}
        >
          按时效排序
        </View>
      </View>

      {/* 报价列表 */}
      <View className="quote-list">
        {quotes.map((quote, index) => (
          <View
            key={quote.id}
            className="quote-card"
            onClick={() => handleNavigateToDetail(quote.id)}
          >
            <View className="quote-card__rank">
              {index + 1}
            </View>
            <View className="quote-card__content">
              <View className="quote-card__header">
                <Text className="quote-card__supplier">{quote.supplierCode}</Text>
                <StatusTag status={quote.status} label={quote.statusLabel} size="small" />
              </View>
              <View className="quote-card__body">
                <View className="quote-card__price">¥{quote.price}</View>
                <View className="quote-card__meta">
                  <Text>品牌: {quote.brand}</Text>
                  <Text>送货: {formatDuration(quote.deliveryTime)}</Text>
                  <Text>质保: {quote.warrantyPeriod}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {quotes.length === 0 && (
        <View className="empty-state">
          <Text>暂无报价</Text>
        </View>
      )}
    </View>
  )
}

export default QuoteList
