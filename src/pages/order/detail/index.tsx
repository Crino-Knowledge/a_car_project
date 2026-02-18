/**
 * 订单详情页
 */
import { View, Text, Button } from '@tarojs/components'
import { FC, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { getOrderDetail } from '@/services'
import OrderTimeline from '@/components/OrderTimeline'
import Loading from '@/components/Loading'
import StatusTag from '@/components/StatusTag'
import { formatDate } from '@/utils/format'
import type { Order } from '@/types/order'
import { OrderStatus } from '@/types/order'
import './index.scss'

const OrderDetail: FC = () => {
  const { orderId } = Taro.getCurrentInstance().router?.params || {}
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    if (!orderId) return

    setLoading(true)
    try {
      const result = await getOrderDetail(orderId)
      setOrder(result)
    } catch (error) {
      console.error('加载订单失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNavigateToReceive = () => {
    Taro.navigateTo({ url: `/pages/order/receive/index?orderId=${orderId}` })
  }

  if (loading) {
    return <Loading text="加载中..." fullscreen />
  }

  if (!order) {
    return (
      <View className="page-order-detail">
        <View className="error-state">订单不存在</View>
      </View>
    )
  }

  const canReceive = order.status === OrderStatus.DELIVERED

  return (
    <View className="page-order-detail">
      {/* 订单状态 */}
      <View className="status-card">
        <View className="status-card__header">
          <StatusTag status={order.status} label={order.statusLabel} size="large" />
        </View>
        <Text className="status-card__order-no">订单编号: {order.orderNo}</Text>
      </View>

      {/* 订单信息 */}
      <View className="section">
        <Text className="section__title">订单信息</Text>
        <View className="info-list">
          <View className="info-item">
            <Text className="info-item__label">配件名称</Text>
            <Text className="info-item__value">{order.partName}</Text>
          </View>
          <View className="info-item">
            <Text className="info-item__label">规格参数</Text>
            <Text className="info-item__value">{order.specification}</Text>
          </View>
          <View className="info-item">
            <Text className="info-item__label">数量</Text>
            <Text className="info-item__value">{order.quantity}</Text>
          </View>
          <View className="info-item">
            <Text className="info-item__label">单价</Text>
            <Text className="info-item__value">¥{order.unitPrice}</Text>
          </View>
          <View className="info-item">
            <Text className="info-item__label">总价</Text>
            <Text className="info-item__value info-item__value--price">
              ¥{order.totalPrice}
            </Text>
          </View>
        </View>
      </View>

      {/* 供应商信息 */}
      <View className="section">
        <Text className="section__title">供应商信息</Text>
        <View className="info-list">
          <View className="info-item">
            <Text className="info-item__label">供应商</Text>
            <Text className="info-item__value">{order.supplierName}</Text>
          </View>
          <View className="info-item">
            <Text className="info-item__label">联系人</Text>
            <Text className="info-item__value">{order.supplierContact}</Text>
          </View>
          <View className="info-item">
            <Text className="info-item__label">联系电话</Text>
            <Text className="info-item__value">{order.supplierPhone}</Text>
          </View>
        </View>
      </View>

      {/* 订单进度 */}
      <View className="section">
        <Text className="section__title">订单进度</Text>
        <OrderTimeline nodes={order.statusNodes} />
      </View>

      {/* 物流信息 */}
      {order.trackingNo && (
        <View className="section">
          <Text className="section__title">物流信息</Text>
          <View className="info-list">
            <View className="info-item">
              <Text className="info-item__label">物流公司</Text>
              <Text className="info-item__value">{order.logisticsCompany}</Text>
            </View>
            <View className="info-item">
              <Text className="info-item__label">运单号</Text>
              <Text className="info-item__value">{order.trackingNo}</Text>
            </View>
          </View>
        </View>
      )}

      {/* 收货按钮 */}
      {canReceive && (
        <View className="bottom-bar">
          <Button className="receive-btn" onClick={handleNavigateToReceive}>
            确认收货
          </Button>
        </View>
      )}
    </View>
  )
}

export default OrderDetail
