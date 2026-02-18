/**
 * 空状态组件
 */
import { View, Image, Text } from '@tarojs/components'
import { FC } from 'react'
import './EmptyState.scss'

interface EmptyStateProps {
  image?: string
  title?: string
  description?: string
  actionText?: string
  onAction?: () => void
}

const EmptyState: FC<EmptyStateProps> = ({
  image,
  title = '暂无数据',
  description,
  actionText,
  onAction
}) => {
  return (
    <View className="empty-state">
      <View className="empty-state__image">
        {image ? (
          <Image src={image} mode="aspectFit" className="empty-state__img" />
        ) : (
          <View className="empty-state__icon">📭</View>
        )}
      </View>
      <View className="empty-state__content">
        <Text className="empty-state__title">{title}</Text>
        {description && (
          <Text className="empty-state__description">{description}</Text>
        )}
      </View>
      {actionText && onAction && (
        <View className="empty-state__action" onClick={onAction}>
          {actionText}
        </View>
      )}
    </View>
  )
}

export default EmptyState
