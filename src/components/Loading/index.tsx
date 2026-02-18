/**
 * 加载状态组件
 */
import { View, Text } from '@tarojs/components'
import { FC } from 'react'
import './Loading.scss'

interface LoadingProps {
  text?: string
  size?: 'small' | 'default' | 'large'
  fullscreen?: boolean
}

const Loading: FC<LoadingProps> = ({
  text = '加载中...',
  size = 'default',
  fullscreen = false
}) => {
  return (
    <View className={`loading loading--${size} ${fullscreen ? 'loading--fullscreen' : ''}`}>
      <View className="loading__spinner">
        <View className="loading__dot"></View>
        <View className="loading__dot"></View>
        <View className="loading__dot"></View>
      </View>
      {text && <Text className="loading__text">{text}</Text>}
    </View>
  )
}

export default Loading
