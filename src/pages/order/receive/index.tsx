/**
 * 收货确认页
 */
import { View, Text, Input, Button, Textarea } from '@tarojs/components'
import { FC, useState } from 'react'
import Taro from '@tarojs/taro'
import { receiveOrder, submitFeedback } from '@/services'
import UploadFile from '@/components/UploadFile'
import Modal from '@/components/Modal'
import type { FileItem } from '@/components/UploadFile'
import './index.scss'

const OrderReceive: FC = () => {
  const { orderId } = Taro.getCurrentInstance().router?.params || {}
  const [deliveryNo, setDeliveryNo] = useState('')
  const [photos, setPhotos] = useState<FileItem[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [deliveryScore, setDeliveryScore] = useState(5)
  const [qualityScore, setQualityScore] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleReceive = async () => {
    if (!deliveryNo.trim()) {
      Taro.showToast({ title: '请输入送货单号', icon: 'none' })
      return
    }

    setSubmitting(true)
    try {
      await receiveOrder({
        orderId: orderId || '',
        deliveryNo,
        photos: photos.map(p => p.url)
      })

      setShowFeedback(true)
    } catch (error) {
      console.error('收货确认失败:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleFeedback = async () => {
    setSubmitting(true)
    try {
      await submitFeedback({
        orderId: orderId || '',
        deliveryScore,
        qualityScore,
        comment
      })

      Taro.showToast({ title: '评价成功', icon: 'success' })
      setShowFeedback(false)

      setTimeout(() => {
        Taro.navigateBack({ delta: 2 })
      }, 1500)
    } catch (error) {
      console.error('评价失败:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (score: number, onChange: (s: number) => void) => {
    return (
      <View className="stars">
        {[1, 2, 3, 4, 5].map(i => (
          <View
            key={i}
            className={`star ${i <= score ? 'star--active' : ''}`}
            onClick={() => onChange(i)}
          >
            ★
          </View>
        ))}
      </View>
    )
  }

  return (
    <View className="page-receive">
      <View className="form">
        {/* 送货单号 */}
        <View className="form-item">
          <Text className="form-item__label">送货单号 *</Text>
          <Input
            className="form-item__input"
            placeholder="请输入送货单号"
            value={deliveryNo}
            onInput={(e) => setDeliveryNo(e.detail.value)}
          />
        </View>

        {/* 签收凭证 */}
        <View className="form-item form-item--upload">
          <Text className="form-item__label">签收凭证</Text>
          <UploadFile files={photos} onChange={setPhotos} maxCount={3} />
        </View>
      </View>

      <View className="submit-bar">
        <Button
          className="submit-btn"
          onClick={handleReceive}
          loading={submitting}
        >
          确认收货
        </Button>
      </View>

      {/* 评价弹窗 */}
      <Modal
        visible={showFeedback}
        title="服务评价"
        confirmText="提交评价"
        showCancel={false}
        onConfirm={handleFeedback}
        onClose={() => setShowFeedback(false)}
      >
        <View className="feedback-form">
          <View className="feedback-item">
            <Text className="feedback-item__label">送货时效</Text>
            {renderStars(deliveryScore, setDeliveryScore)}
          </View>
          <View className="feedback-item">
            <Text className="feedback-item__label">报价匹配度</Text>
            {renderStars(qualityScore, setQualityScore)}
          </View>
          <View className="feedback-item">
            <Text className="feedback-item__label">评价内容</Text>
            <Textarea
              className="feedback-item__textarea"
              placeholder="请输入评价内容（选填）"
              value={comment}
              onInput={(e) => setComment(e.detail.value)}
              maxlength={200}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default OrderReceive
