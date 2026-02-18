import { defineConfig } from 'umi';

export default defineConfig({
  title: '汽服报价系统',
  antd: {},
  routes: [
    {
      path: '/login',
      component: 'Login',
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: '分析页',
      icon: 'dashboard',
      component: 'Dashboard',
    },
    {
      path: '/workbench',
      name: '工作台',
      icon: 'desktop',
      component: 'Workbench',
    },
    {
      path: '/system',
      name: '系统管理',
      icon: 'setting',
      routes: [
        {
          path: '/system/user',
          name: '用户管理',
          icon: 'user',
          component: 'System/User',
        },
        {
          path: '/system/shop',
          name: '店铺管理',
          icon: 'shop',
          component: 'System/Shop',
        },
        {
          path: '/system/supplier',
          name: '供应商管理',
          icon: 'team',
          component: 'System/Supplier',
        },
      ],
    },
    {
      path: '/master-data',
      name: '主数据管理',
      icon: 'database',
      routes: [
        {
          path: '/master-data/brand',
          name: '品牌管理',
          icon: 'tag',
          component: 'MasterData/Brand',
        },
        {
          path: '/master-data/category',
          name: '配件分类管理',
          icon: 'apartment',
          component: 'MasterData/Category',
        },
      ],
    },
    {
      path: '/business',
      name: '业务管理',
      icon: 'shopping',
      routes: [
        {
          path: '/business/purchase',
          name: '采购管理',
          icon: 'file-search',
          component: 'Business/Purchase',
        },
        {
          path: '/business/bid',
          name: '应标管理',
          icon: 'solution',
          component: 'Business/Bid',
        },
        {
          path: '/business/order',
          name: '订单管理',
          icon: 'orderedList',
          component: 'Business/Order',
        },
      ],
    },
    {
      path: '*',
      component: '404',
    },
  ],
  proxy: {
    '/api': {
      target: 'http://localhost:8001',
      changeOrigin: true,
    },
  },
  theme: {
    'primary-color': '#475569',
  },
  hash: true,
  history: { type: 'hash' },
  plugins: ['@umijs/plugins/dist/antd'],
});
