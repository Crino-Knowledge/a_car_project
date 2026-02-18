/**
 * 采购清单列表页
 */
import { View, Text, ScrollView } from '@tarojs/components'
import { FC, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { fetchPurchaseList, setFilterStatus, setRefreshing } from '@/store/slices/purchase'
import StatusTag from '@/components/StatusTag'
import Loading from '@/components/Loading'
import EmptyState from '@/components/EmptyState'
import { formatDate } from '@/utils/format'
import { PurchaseStatus } from '@/types/purchase'
import './index.scss'

const PurchaseList: FC = () => {
  const dispatch = useDispatch()
  const { purchaseList, total, page, loading, refreshing, filterStatus } = useSelector(
    (state: RootState) => state.purchase
  )

  const [currentTab, setCurrentTab] = useState<string>('all')

  useEffect(() => {
    loadData(1)
  }, [filterStatus])

  const loadData = (pageNum: number) => {
    dispatch(fetchPurchaseList({
      page: pageNum,
      status: filterStatus || undefined
    }) as any)
  }

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    dispatch(setFilterStatus(tab === 'all' ? null : (tab as PurchaseStatus)))
  }

  const handleRefresh = () => {
    dispatch(setRefreshing(true))
    loadData(1)
  }

  const handleLoadMore = () => {
    if (!loading && purchaseList.length < total) {
      loadData(page + 1)
    }
  }

  const handleNavigateToDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/purchase/detail/index?id=${id}` })
  }

  const handleNavigateToCreate = () => {
    Taro.navigateTo({ url: '/pages/purchase/create/index' })
  }

  const tabs = [
    { key: 'all', label: '全部' },
    { key: PurchaseStatus.PENDING, label: '待应标' },
    { key: PurchaseStatus.QUOTED, label: '已应标' },
    { key: PurchaseStatus.CONFIRMED, label: '已成交' },
    { key: PurchaseStatus.COMPLETED, label: '已完成' }
  ]

  const hasMore = purchaseList.length < total

  return (
    <View className="page-list">
      {/* 标签栏 */}
      <View className="tabs">
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={`tabs__item ${currentTab === tab.key ? 'tabs__item--active' : ''}`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
          </View>
        ))}
      </View>

      {/* 列表 */}
      <ScrollView
        className="list-container"
        scrollY
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
        onScrollToLower={handleLoadMore}
      >
        {loading && page === 1 ? (
          <Loading text="加载中..." />
        ) : purchaseList.length === 0 ? (
          <EmptyState
            title="暂无采购记录"
            description="点击右下角按钮发布采购需求"
            actionText="发布采购"
            onAction={handleNavigateToCreate}
          />
        ) : (
          <View className="list">
            {purchaseList.map(item => (
              <View
                key={item.id}
                className="purchase-card"
                onClick={() => handleNavigateToDetail(item.id)}
              >
                <View className="purchase-card__header">
                  <Text className="purchase-card__order-no">{item.orderNo}</Text>
                  <StatusTag status={item.status} label={item.statusLabel} />
                </View>
                <View className="purchase-card__body">
                  <Text className="purchase-card__name">{item.partName}</Text>
                  <View className="purchase-card__info">
                    <Text className="purchase-card__brand">{item.brandName}</Text>
                    <Text className="purchase-card__spec">{item.specification}</Text>
                  </View>
                </View>
                <View className="purchase-card__footer">
                  <View className="purchase-card__meta">
                    <Text className="purchase-card__time">
                      {formatDate(item.publishTime, 'YYYY-MM-DD HH:mm')}
                    </Text>
                    {item.quoteCount > 0 && (
                      <Text className="purchase-card__quote-count">
                        {item.quoteCount}个报价
                      </Text>
                    )}
                  </View>
                  <Text className="purchase-card__budget">¥{item.budget}</Text>
                </View>
              </View>
            ))}

            {/* 加载更多 */}
            {hasMore && (
              <View className="load-more">
                {loading ? '加载中...' : '上拉加载更多'}
              </View>
            )}

            {/* 没有更多 */}
            {!hasMore && purchaseList.length > 0 && (
              <View className="no-more">没有更多了</View>
            )}
          </View>
        )}
      </ScrollView>

      {/* 发布按钮 */}
      <View className="fab" onClick={handleNavigateToCreate}>
        <Text className="fab__icon">+</Text>
      </View>
    </View>
  )
}

export default PurchaseList
