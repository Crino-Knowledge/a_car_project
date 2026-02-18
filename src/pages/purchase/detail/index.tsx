/**
 * 采购详情页
 */
import { View, Text, ScrollView, Button } from '@tarojs/components'
import { FC, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { getPurchaseDetail, getQuoteList, confirmSupplier } from '@/services'
import StatusTag from '@/components/StatusTag'
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import { formatDate, formatDuration } from '@/utils/format'
import type { Purchase } from '@/types/purchase'
import type { Quote } from '@/types/quote'
import { PurchaseStatus } from '@/types/purchase'
import './index.scss'

const PurchaseDetail: FC = () => {
  const { id } = Taro.getCurrentInstance().router?.params || {}
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'price' | 'deliveryTime'>('price')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    loadData()
  }, [id])

  useEffect(() => {
    if (purchase && purchase.status !== PurchaseStatus.PENDING) {
      loadQuotes()
    }
  }, [purchase, sortBy])

  const loadData = async () => {
    if (!id) return

    setLoading(true)
    try {
      const result = await getPurchaseDetail(id)
      setPurchase(result)
    } catch (error) {
      console.error('加载失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadQuotes = async () => {
    if (!purchase) return

    try {
      const result = await getQuoteList({
        purchaseId: purchase.id,
        sortBy,
        sortOrder: 'asc'
      })
      setQuotes(result)
    } catch (error) {
      console.error('加载报价失败:', error)
    }
  }

  const handleConfirmSupplier = (quote: Quote) => {
    setSelectedQuote(quote)
    setShowConfirmModal(true)
  }

  const handleDoConfirm = async () => {
    if (!purchase || !selectedQuote) return

    setConfirming(true)
    try {
      await confirmSupplier({
        purchaseId: purchase.id,
        quoteId: selectedQuote.id
      })

      Taro.showToast({ title: '成交成功', icon: 'success' })
      setShowConfirmModal(false)

      // 刷新数据
      setTimeout(() => {
        loadData()
        loadQuotes()
      }, 1500)
    } catch (error) {
      console.error('成交失败:', error)
    } finally {
      setConfirming(false)
    }
  }

  const handleNavigateToOrder = () => {
    Taro.navigateTo({ url: '/pages/order/detail/index?orderId=mock_order_001' })
  }

  if (loading) {
    return <Loading text="加载中..." fullscreen />
  }

  if (!purchase) {
    return (
      <View className="page-detail">
        <View className="error-state">采购单不存在</View>
      </View>
    )
  }

  return (
    <View className="page-detail">
      <ScrollView className="detail-content" scrollY>
        {/* 基本信息 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">基本信息</Text>
            <StatusTag status={purchase.status} label={purchase.statusLabel} />
          </View>
          <View className="info-list">
            <View className="info-item">
              <Text className="info-item__label">订单编号</Text>
              <Text className="info-item__value">{purchase.orderNo}</Text>
            </View>
            <View className="info-item">
              <Text className="info-item__label">配件分类</Text>
              <Text className="info-item__value">{purchase.categoryName}</Text>
            </View>
            <View className="info-item">
              <Text className="info-item__label">品牌</Text>
              <Text className="info-item__value">{purchase.brandName || '-'}</Text>
            </View>
            <View className="info-item">
              <Text className="info-item__label">配件名称</Text>
              <Text className="info-item__value">{purchase.partName}</Text>
            </View>
            <View className="info-item">
              <Text className="info-item__label">规格参数</Text>
              <Text className="info-item__value">{purchase.specification || '-'}</Text>
            </View>
            <View className="info-item">
              <Text className="info-item__label">需求数量</Text>
              <Text className="info-item__value">{purchase.quantity}</Text>
            </View>
            <View className="info-item">
              <Text className="info-item__label">预算金额</Text>
              <Text className="info-item__value info-item__value--price">
                ¥{purchase.budget}
              </Text>
            </View>
            <View className="info-item">
              <Text className="info-item__label">需求详情</Text>
              <Text className="info-item__value">{purchase.description || '-'}</Text>
            </View>
          </View>
        </View>

        {/* 时间信息 */}
        <View className="section">
          <Text className="section__title">时间信息</Text>
          <View className="info-list">
            <View className="info-item">
              <Text className="info-item__label">发布时间</Text>
              <Text className="info-item__value">
                {formatDate(purchase.publishTime, 'YYYY-MM-DD HH:mm')}
              </Text>
            </View>
            <View className="info-item">
              <Text className="info-item__label">报价截止</Text>
              <Text className="info-item__value">
                {formatDate(purchase.quoteDeadline, 'YYYY-MM-DD HH:mm')}
              </Text>
            </View>
            <View className="info-item">
              <Text className="info-item__label">期望到货</Text>
              <Text className="info-item__value">
                {formatDate(purchase.expectedArrivalTime, 'YYYY-MM-DD HH:mm')}
              </Text>
            </View>
          </View>
        </View>

        {/* 报价列表 */}
        {purchase.status !== PurchaseStatus.PENDING && (
          <View className="section">
            <View className="section__header">
              <Text className="section__title">供应商报价 ({quotes.length})</Text>
              <View className="sort-btns">
                <View
                  className={`sort-btn ${sortBy === 'price' ? 'sort-btn--active' : ''}`}
                  onClick={() => setSortBy('price')}
                >
                  按价格
                </View>
                <View
                  className={`sort-btn ${sortBy === 'deliveryTime' ? 'sort-btn--active' : ''}`}
                  onClick={() => setSortBy('deliveryTime')}
                >
                  按时效
                </View>
              </View>
            </View>

            {quotes.length === 0 ? (
              <View className="empty-quotes">暂无报价</View>
            ) : (
              <View className="quote-list">
                {quotes.map(quote => (
                  <View key={quote.id} className="quote-card">
                    <View className="quote-card__header">
                      <Text className="quote-card__supplier">{quote.supplierCode}</Text>
                      <StatusTag status={quote.status} label={quote.statusLabel} size="small" />
                    </View>
                    <View className="quote-card__body">
                      <View className="quote-card__price">¥{quote.price}</View>
                      <View className="quote-card__info">
                        <Text>品牌: {quote.brand}</Text>
                        <Text>送货: {formatDuration(quote.deliveryTime)}</Text>
                        <Text>质保: {quote.warrantyPeriod}</Text>
                      </View>
                    </View>
                    {quote.status === 'pending' && purchase.status === PurchaseStatus.QUOTED && (
                      <View className="quote-card__footer">
                        <Button
                          className="quote-card__btn quote-card__btn--primary"
                          onClick={() => handleConfirmSupplier(quote)}
                        >
                          选择成交
                        </Button>
                      </View>
                    )}
                    {quote.status === 'selected' && quote.contactPhone && (
                      <View className="quote-card__contact">
                        <Text>联系人: {quote.contactName}</Text>
                        <Text>电话: {quote.contactPhone}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* 底部操作 */}
      {purchase.status === PurchaseStatus.CONFIRMED && (
        <View className="bottom-bar">
          <Button className="bottom-btn" onClick={handleNavigateToOrder}>
            查看订单状态
          </Button>
        </View>
      )}

      {/* 确认弹窗 */}
      <Modal
        visible={showConfirmModal}
        title="确认成交"
        confirmText="确认成交"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleDoConfirm}
      >
        <View className="confirm-content">
          <Text>确定选择 {selectedQuote?.supplierCode} 为中标方？</Text>
          <Text className="confirm-price">报价: ¥{selectedQuote?.price}</Text>
        </View>
      </Modal>
    </View>
  )
}

export default PurchaseDetail
