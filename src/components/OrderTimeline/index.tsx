/**
 * 订单时间线组件
 */
import { View, Text } from '@tarojs/components'
import { FC } from 'react'
import type { OrderStatusNode } from '@/types/order'
import './OrderTimeline.scss'

interface OrderTimelineProps {
  nodes: OrderStatusNode[]
}

const OrderTimeline: FC<OrderTimelineProps> = ({ nodes }) => {
  return (
    <View className="timeline">
      {nodes.map((node, index) => (
        <View key={node.status} className="timeline__item">
          <View className="timeline__marker">
            <View className={`timeline__dot ${node.completed ? 'timeline__dot--completed' : ''} ${node.current ? 'timeline__dot--current' : ''}`}>
              {node.completed && !node.current && '✓'}
            </View>
            {index < nodes.length - 1 && (
              <View className={`timeline__line ${node.completed ? 'timeline__line--completed' : ''}`}></View>
            )}
          </View>
          <View className="timeline__content">
            <View className="timeline__header">
              <Text className={`timeline__label ${node.current ? 'timeline__label--current' : ''}`}>
                {node.label}
              </Text>
              {node.time && (
                <Text className="timeline__time">{node.time}</Text>
              )}
            </View>
            {node.operator && (
              <Text className="timeline__operator">操作人：{node.operator}</Text>
            )}
            {node.contactPhone && (
              <Text className="timeline__contact">联系电话：{node.contactPhone}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  )
}

export default OrderTimeline
