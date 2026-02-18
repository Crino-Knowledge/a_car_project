export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/login/index',
    'pages/purchase/create/index',
    'pages/purchase/list/index',
    'pages/purchase/detail/index',
    'pages/quote/list/index',
    'pages/quote/detail/index',
    'pages/order/detail/index',
    'pages/order/receive/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1677FF',
    navigationBarTitleText: '汽服配件采购',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F5F5'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#1677FF',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/images/tab-home.png',
        selectedIconPath: 'assets/images/tab-home-active.png'
      },
      {
        pagePath: 'pages/purchase/list/index',
        text: '采购单',
        iconPath: 'assets/images/tab-order.png',
        selectedIconPath: 'assets/images/tab-order-active.png'
      }
    ]
  },
  subPackages: [
    {
      root: 'pages/order',
      pages: [
        'detail/index',
        'receive/index'
      ]
    }
  ]
})
