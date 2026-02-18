/**
 * 采购发布页面
 */
import { View, Text, Input, Textarea, Picker, Button } from '@tarojs/components'
import { FC, useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { fetchCategories, fetchBrands, createPurchaseOrder } from '@/store/slices/purchase'
import UploadFile from '@/components/UploadFile'
import Modal from '@/components/Modal'
import { validatePurchaseForm } from '@/utils/validator'
import { formatDate } from '@/utils/format'
import type { PartCategory } from '@/types/purchase'
import type { FileItem } from '@/components/UploadFile'
import './index.scss'

interface FormData {
  categoryId: string
  categoryName: string
  brandId: string
  brandName: string
  partName: string
  specification: string
  quantity: string
  budget: string
  description: string
  expectedArrivalTime: string
  quoteDeadline: string
}

const initialFormData: FormData = {
  categoryId: '',
  categoryName: '',
  brandId: '',
  brandName: '',
  partName: '',
  specification: '',
  quantity: '',
  budget: '',
  description: '',
  expectedArrivalTime: '',
  quoteDeadline: ''
}

const PurchaseCreate: FC = () => {
  const dispatch = useDispatch()
  const { categories, brands } = useSelector((state: RootState) => state.purchase)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [files, setFiles] = useState<FileItem[]>([])
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [showBrandPicker, setShowBrandPicker] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState<'arrival' | 'deadline' | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchCategories() as any)
    dispatch(fetchBrands() as any)
  }, [])

  // 获取扁平化的分类列表
  const flatCategories = categories.reduce((acc: { id: string; name: string }[], cat: PartCategory) => {
    if (cat.children && cat.children.length > 0) {
      cat.children.forEach(child => {
        acc.push({ id: child.id, name: `${cat.name} / ${child.name}` })
      })
    } else {
      acc.push({ id: cat.id, name: cat.name })
    }
    return acc
  }, [])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCategorySelect = (index: number) => {
    const selected = flatCategories[index]
    setFormData(prev => ({
      ...prev,
      categoryId: selected.id,
      categoryName: selected.name
    }))
    setShowCategoryPicker(false)
  }

  const handleBrandSelect = (index: number) => {
    const selected = brands[index]
    setFormData(prev => ({
      ...prev,
      brandId: selected.id,
      brandName: selected.name
    }))
    setShowBrandPicker(false)
  }

  const handleDateSelect = (e: any) => {
    const date = e.detail.value
    const timeStr = `${date} 12:00`

    if (showDatePicker === 'arrival') {
      setFormData(prev => ({ ...prev, expectedArrivalTime: timeStr }))
    } else {
      setFormData(prev => ({ ...prev, quoteDeadline: timeStr }))
    }
    setShowDatePicker(null)
  }

  const handleSubmit = () => {
    const validation = validatePurchaseForm({
      categoryId: formData.categoryId,
      partName: formData.partName,
      quantity: parseInt(formData.quantity) || 0,
      budget: parseFloat(formData.budget) || 0,
      expectedArrivalTime: formData.expectedArrivalTime,
      quoteDeadline: formData.quoteDeadline
    })

    if (!validation.valid) {
      Taro.showToast({ title: validation.message, icon: 'none' })
      return
    }

    setShowConfirmModal(true)
  }

  const handleConfirmSubmit = async () => {
    setSubmitting(true)
    setShowConfirmModal(false)

    try {
      await dispatch(createPurchaseOrder({
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        partName: formData.partName,
        specification: formData.specification,
        quantity: parseInt(formData.quantity),
        budget: parseFloat(formData.budget),
        description: formData.description,
        expectedArrivalTime: formData.expectedArrivalTime,
        quoteDeadline: formData.quoteDeadline,
        attachmentUrls: files.map(f => f.url)
      }) as any)

      Taro.showToast({ title: '发布成功', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (error) {
      console.error('发布失败:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View className="page-create">
      <View className="form">
        {/* 配件分类 */}
        <View className="form-item" onClick={() => setShowCategoryPicker(true)}>
          <Text className="form-item__label">配件分类 *</Text>
          <View className="form-item__value">
            <Text className={formData.categoryName ? '' : 'form-item__placeholder'}>
              {formData.categoryName || '请选择配件分类'}
            </Text>
            <Text className="form-item__arrow">&gt;</Text>
          </View>
        </View>

        {/* 品牌 */}
        <View className="form-item" onClick={() => setShowBrandPicker(true)}>
          <Text className="form-item__label">品牌</Text>
          <View className="form-item__value">
            <Text className={formData.brandName ? '' : 'form-item__placeholder'}>
              {formData.brandName || '请选择品牌'}
            </Text>
            <Text className="form-item__arrow">&gt;</Text>
          </View>
        </View>

        {/* 配件名称 */}
        <View className="form-item">
          <Text className="form-item__label">配件名称 *</Text>
          <Input
            className="form-item__input"
            placeholder="请输入配件名称"
            value={formData.partName}
            onInput={(e) => handleInputChange('partName', e.detail.value)}
          />
        </View>

        {/* 规格参数 */}
        <View className="form-item">
          <Text className="form-item__label">规格参数</Text>
          <Input
            className="form-item__input"
            placeholder="请输入规格参数"
            value={formData.specification}
            onInput={(e) => handleInputChange('specification', e.detail.value)}
          />
        </View>

        {/* 数量 */}
        <View className="form-item">
          <Text className="form-item__label">需求数量 *</Text>
          <Input
            className="form-item__input"
            type="number"
            placeholder="请输入数量"
            value={formData.quantity}
            onInput={(e) => handleInputChange('quantity', e.detail.value)}
          />
        </View>

        {/* 预算 */}
        <View className="form-item">
          <Text className="form-item__label">预算金额 *</Text>
          <Input
            className="form-item__input"
            type="digit"
            placeholder="请输入预算金额"
            value={formData.budget}
            onInput={(e) => handleInputChange('budget', e.detail.value)}
          />
        </View>

        {/* 需求详情 */}
        <View className="form-item form-item--textarea">
          <Text className="form-item__label">需求详情</Text>
          <Textarea
            className="form-item__textarea"
            placeholder="请详细描述您的采购需求"
            value={formData.description}
            onInput={(e) => handleInputChange('description', e.detail.value)}
            maxlength={500}
          />
        </View>

        {/* 报价截止时间 */}
        <View className="form-item" onClick={() => setShowDatePicker('deadline')}>
          <Text className="form-item__label">报价截止时间 *</Text>
          <View className="form-item__value">
            <Text className={formData.quoteDeadline ? '' : 'form-item__placeholder'}>
              {formData.quoteDeadline ? formatDate(formData.quoteDeadline, 'YYYY-MM-DD HH:mm') : '请选择报价截止时间'}
            </Text>
            <Text className="form-item__arrow">&gt;</Text>
          </View>
        </View>

        {/* 期望到货时间 */}
        <View className="form-item" onClick={() => setShowDatePicker('arrival')}>
          <Text className="form-item__label">期望到货时间 *</Text>
          <View className="form-item__value">
            <Text className={formData.expectedArrivalTime ? '' : 'form-item__placeholder'}>
              {formData.expectedArrivalTime ? formatDate(formData.expectedArrivalTime, 'YYYY-MM-DD HH:mm') : '请选择期望到货时间'}
            </Text>
            <Text className="form-item__arrow">&gt;</Text>
          </View>
        </View>

        {/* 附件上传 */}
        <View className="form-item form-item--upload">
          <Text className="form-item__label">附件</Text>
          <UploadFile files={files} onChange={setFiles} />
        </View>
      </View>

      {/* 提交按钮 */}
      <View className="submit-bar">
        <Button
          className="submit-btn"
          onClick={handleSubmit}
          loading={submitting}
        >
          发布采购
        </Button>
      </View>

      {/* 分类选择器 */}
      {showCategoryPicker && (
        <View className="picker-mask" onClick={() => setShowCategoryPicker(false)}>
          <View className="picker-content" onClick={(e) => e.stopPropagation()}>
            <View className="picker-header">
              <Text className="picker-title">选择配件分类</Text>
              <Text className="picker-close" onClick={() => setShowCategoryPicker(false)}>关闭</Text>
            </View>
            <View className="picker-list">
              {flatCategories.map((item, index) => (
                <View
                  key={item.id}
                  className={`picker-item ${formData.categoryId === item.id ? 'picker-item--active' : ''}`}
                  onClick={() => handleCategorySelect(index)}
                >
                  {item.name}
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* 品牌选择器 */}
      {showBrandPicker && (
        <View className="picker-mask" onClick={() => setShowBrandPicker(false)}>
          <View className="picker-content" onClick={(e) => e.stopPropagation()}>
            <View className="picker-header">
              <Text className="picker-title">选择品牌</Text>
              <Text className="picker-close" onClick={() => setShowBrandPicker(false)}>关闭</Text>
            </View>
            <View className="picker-list">
              {brands.map((item, index) => (
                <View
                  key={item.id}
                  className={`picker-item ${formData.brandId === item.id ? 'picker-item--active' : ''}`}
                  onClick={() => handleBrandSelect(index)}
                >
                  {item.name}
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* 确认弹窗 */}
      <Modal
        visible={showConfirmModal}
        title="确认发布"
        confirmText="确认发布"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
      >
        <Text>确认发布此采购需求吗？</Text>
      </Modal>

      {/* 日期选择器 */}
      {showDatePicker && (
        <Picker
          mode="date"
          onChange={handleDateSelect}
          start={formatDate(new Date(), 'YYYY-MM-DD')}
        >
          <View style={{ display: 'none' }}></View>
        </Picker>
      )}
    </View>
  )
}

export default PurchaseCreate
