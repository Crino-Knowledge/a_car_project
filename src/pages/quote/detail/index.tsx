/**
 * 报价详情页
 */
import { View, Text, Button } from '@tarojs/components'
import { FC, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { getQuoteDetail, confirmSupplier } from '@/services'
import StatusTag from '@/components/StatusTag'
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import { formatDate, formatDuration } from '@/utils/format'
import type { Quote } from '@/types/quote'
import './index.scss'

const QuoteDetail: FC = () => {
  const { purchaseId, quoteId } = Taro.getCurrentInstance().router?.params || {}
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    loadQuote()
  }, [purchaseId, quoteId])

  const loadQuote = async () => {
    if (!purchaseId || !quoteId) return

    setLoading(true)
    try {
      const result = await getQuoteDetail(purchaseId, quoteId)
      setQuote(result)
    } catch (error) {
      console.error('加载报价详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    setConfirming(true)
    try {
      await confirmSupplier({
        purchaseId: purchaseId || '',
        quoteId: quoteId || ''
      })

      Taro.showToast({ title: '成交成功', icon: 'success' })
      setShowConfirmModal(false)

      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (error) {
      console.error('成交失败:', error)
    } finally {
      setConfirming(false)
    }
  }

  if (loading) {
    return <Loading text="加载中..." fullscreen />
  }

  if (!quote) {
    return (
      <View className="page-quote-detail">
        <View className="error-state">报价不存在</View>
      </View>
    )
  }

  return (
    <View className="page-quote-detail">
      {/* 报价信息 */}
      <View className="section">
        <View className="section__header">
          <Text className="section__title">{quote.supplierCode}</Text>
          <StatusTag status={quote.status} label={quote.statusLabel} />
        </View>
        <View className="price-card">
          <Text className="price-card__label">报价金额</Text>
          <Text className="price-card__value">¥{quote.price}</Text>
        </View>
      </View>

      {/* 配件信息 */}
      <View className="section">
        <Text className="section__title">配件信息</Text>
        <View className="info-list">
          <View className="info-item">
            <Text className="info-item__label">品牌</Text>
            <Text className="info-item__value">{quote.brand}</Text>
          </View>
          <View className="info-item">
            <Text className="info-item__label">生产日期</Text>
            <Text className="info-item__value">{quote.productionDate}</Text>
          </View>
          <View className="info-item">
            <Text className="info-item__label">数量</Text>
            <Text className="info-item__value">{quote.quantity}</Text>
          </View>
          <View className="info-item">
            <Text className="info-item__label">质保期</Text>
            <Text className="info-item__value">{quote.warrantyPeriod}</Text>
          </View>
          <View className="info-item">
            <Text className="info-item__label">送货时长</Text>
            <Text className="info-item__value">{formatDuration(quote.deliveryTime)}</Text>
          </View>
        </View>
      </View>

      {/* 详细描述 */}
      <View className="section">
        <Text className="section__title">详细描述</Text>
        <Text className="description">{quote.description || '暂无描述'}</Text>
      </View>

      {/* 联系信息（成交后显示） */}
      {quote.status === 'selected' && quote.contactPhone && (
        <View className="section">
          <Text className="section__title">联系信息</Text>
          <View className="info-list">
            <View className="info-item">
              <Text className="info-item__label">联系人</Text>
              <Text className="info-item__value">{quote.contactName}</Text>
            </View>
            <View className="info-item">
              <Text className="info-item__label">联系电话</Text>
              <Text className="info-item__value">{quote.contactPhone}</Text>
            </View>
          </View>
        </View>
      )}

      {/* 操作按钮 */}
      {quote.status === 'pending' && (
        <View className="bottom-bar">
          <Button
            className="confirm-btn"
            onClick={() => setShowConfirmModal(true)}
          >
            选择此供应商成交
          </Button>
        </View>
      )}

      {/* 确认弹窗 */}
      <Modal
        visible={showConfirmModal}
        title="确认成交"
        confirmText="确认成交"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
      >
        <View className="confirm-content">
          <Text>确定选择 {quote.supplierCode} 为中标方？</Text>
          <Text className="confirm-price">报价: ¥{quote.price}</Text>
        </View>
      </Modal>
    </View>
  )
}

export default QuoteDetail
