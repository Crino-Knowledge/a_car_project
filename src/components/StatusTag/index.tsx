/**
 * 状态标签组件
 */
import { View } from '@tarojs/components'
import { FC } from 'react'
import './StatusTag.scss'

interface StatusTagProps {
  status: string
  label: string
  size?: 'small' | 'default' | 'large'
}

const StatusTag: FC<StatusTagProps> = ({ status, label, size = 'default' }) => {
  const getStatusClass = () => {
    const statusMap: Record<string, string> = {
      pending: 'status-warning',
      quoted: 'status-primary',
      confirmed: 'status-success',
      completed: 'status-success',
      cancelled: 'status-default',
      preparing: 'status-primary',
      ready: 'status-warning',
      shipped: 'status-primary',
      delivering: 'status-primary',
      delivered: 'status-success',
      received: 'status-success',
      selected: 'status-success',
      rejected: 'status-default',
      expired: 'status-default'
    }

    return statusMap[status] || 'status-default'
  }

  return (
    <View className={`status-tag ${getStatusClass()} status-tag--${size}`}>
      {label}
    </View>
  )
}

export default StatusTag
