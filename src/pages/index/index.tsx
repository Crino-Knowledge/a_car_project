/**
 * 首页
 */
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { FC, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { fetchPurchaseList } from '@/store/slices/purchase'
import StatusTag from '@/components/StatusTag'
import Loading from '@/components/Loading'
import EmptyState from '@/components/EmptyState'
import { formatDate } from '@/utils/format'
import { PurchaseStatus } from '@/types/purchase'
import './index.scss'

const Index: FC = () => {
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector((state: RootState) => state.user)
  const { purchaseList, loading, total } = useSelector((state: RootState) => state.purchase)

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchPurchaseList({ page: 1 }) as any)
    }
  }, [isLoggedIn])

  const handleNavigateToCreate = () => {
    Taro.navigateTo({ url: '/pages/purchase/create/index' })
  }

  const handleNavigateToList = () => {
    Taro.switchTab({ url: '/pages/purchase/list/index' })
  }

  const handleNavigateToDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/purchase/detail/index?id=${id}` })
  }

  // 轮播数据
  const banners = [
    { id: 1, title: '欢迎使用汽服配件采购系统', image: '' },
    { id: 2, title: '在线比价，高效采购', image: '' },
    { id: 3, title: '全程留痕，合规透明', image: '' }
  ]

  // 功能入口
  const menuItems = [
    { id: 'publish', icon: '📝', title: '发布采购', url: '/pages/purchase/create/index' },
    { id: 'list', icon: '📋', title: '采购清单', url: '/pages/purchase/list/index' },
    { id: 'order', icon: '📦', title: '订单跟踪', url: '/pages/purchase/list/index?status=confirmed' },
    { id: 'help', icon: '❓', title: '使用帮助', url: '' }
  ]

  // 统计数据
  const statistics = [
    { label: '待应标', value: purchaseList.filter(p => p.status === PurchaseStatus.PENDING).length, color: '#FAAD14' },
    { label: '已应标', value: purchaseList.filter(p => p.status === PurchaseStatus.QUOTED).length, color: '#1677FF' },
    { label: '已成交', value: purchaseList.filter(p => p.status === PurchaseStatus.CONFIRMED).length, color: '#52C41A' },
    { label: '已完成', value: purchaseList.filter(p => p.status === PurchaseStatus.COMPLETED).length, color: '#52C41A' }
  ]

  if (!isLoggedIn) {
    return (
      <View className="page-index">
        <View className="welcome">
          <View className="welcome__content">
            <Text className="welcome__title">汽服配件采购系统</Text>
            <Text className="welcome__desc">高效、透明、可追溯的数字化采购解决方案</Text>
          </View>
          <View className="welcome__action" onClick={() => Taro.navigateTo({ url: '/pages/login/index' })}>
            立即登录
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="page-index">
      {/* 轮播 */}
      <Swiper
        className="banner"
        indicatorDots
        autoplay
        circular
        indicatorColor="rgba(255, 255, 255, 0.5)"
        indicatorActiveColor="#FFFFFF"
      >
        {banners.map(banner => (
          <SwiperItem key={banner.id}>
            <View className="banner__item">
              <View className="banner__content">
                <Text className="banner__title">{banner.title}</Text>
              </View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>

      {/* 功能入口 */}
      <View className="menu">
        {menuItems.map(item => (
          <View
            key={item.id}
            className="menu__item"
            onClick={() => item.url && Taro.navigateTo({ url: item.url })}
          >
            <View className="menu__icon">{item.icon}</View>
            <Text className="menu__title">{item.title}</Text>
          </View>
        ))}
      </View>

      {/* 统计卡片 */}
      <View className="statistics">
        <View className="statistics__header">
          <Text className="statistics__title">采购概览</Text>
        </View>
        <View className="statistics__content">
          {statistics.map((stat, index) => (
            <View key={index} className="statistics__item">
              <Text className="statistics__value" style={{ color: stat.color }}>{stat.value}</Text>
              <Text className="statistics__label">{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 最近采购 */}
      <View className="recent">
        <View className="recent__header">
          <Text className="recent__title">最近采购</Text>
          <Text className="recent__more" onClick={handleNavigateToList}>查看更多 &gt;</Text>
        </View>

        {loading ? (
          <Loading text="加载中..." />
        ) : purchaseList.length === 0 ? (
          <EmptyState
            title="暂无采购记录"
            description="点击下方按钮发布采购需求"
            actionText="发布采购"
            onAction={handleNavigateToCreate}
          />
        ) : (
          <View className="recent__list">
            {purchaseList.slice(0, 5).map(item => (
              <View
                key={item.id}
                className="purchase-card"
                onClick={() => handleNavigateToDetail(item.id)}
              >
                <View className="purchase-card__header">
                  <Text className="purchase-card__name">{item.partName}</Text>
                  <StatusTag status={item.status} label={item.statusLabel} size="small" />
                </View>
                <View className="purchase-card__info">
                  <Text className="purchase-card__brand">{item.brandName}</Text>
                  <Text className="purchase-card__quantity">x{item.quantity}</Text>
                </View>
                <View className="purchase-card__footer">
                  <Text className="purchase-card__time">{formatDate(item.publishTime, 'MM-DD HH:mm')}</Text>
                  <Text className="purchase-card__budget">预算: ¥{item.budget}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 发布按钮 */}
      <View className="fab" onClick={handleNavigateToCreate}>
        <Text className="fab__icon">+</Text>
      </View>
    </View>
  )
}

export default Index
