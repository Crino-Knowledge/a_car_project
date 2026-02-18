/**
 * 弹窗组件
 */
import { View, Text } from '@tarojs/components'
import { FC, ReactNode } from 'react'
import './Modal.scss'

interface ModalProps {
  visible: boolean
  title?: string
  children?: ReactNode
  showClose?: boolean
  showCancel?: boolean
  showConfirm?: boolean
  cancelText?: string
  confirmText?: string
  onCancel?: () => void
  onConfirm?: () => void
  onClose?: () => void
}

const Modal: FC<ModalProps> = ({
  visible,
  title,
  children,
  showClose = false,
  showCancel = true,
  showConfirm = true,
  cancelText = '取消',
  confirmText = '确定',
  onCancel,
  onConfirm,
  onClose
}) => {
  if (!visible) return null

  const handleMaskClick = () => {
    onClose?.()
  }

  const handleContentClick = (e) => {
    e.stopPropagation()
  }

  return (
    <View className="modal" onClick={handleMaskClick}>
      <View className="modal__content" onClick={handleContentClick}>
        {showClose && (
          <View className="modal__close" onClick={onClose}>
            ✕
          </View>
        )}
        {title && (
          <View className="modal__header">
            <Text className="modal__title">{title}</Text>
          </View>
        )}
        <View className="modal__body">
          {children}
        </View>
        {(showCancel || showConfirm) && (
          <View className="modal__footer">
            {showCancel && (
              <View className="modal__btn modal__btn--cancel" onClick={onCancel}>
                {cancelText}
              </View>
            )}
            {showConfirm && (
              <View className="modal__btn modal__btn--confirm" onClick={onConfirm}>
                {confirmText}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  )
}

export default Modal
