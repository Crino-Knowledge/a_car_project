import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/demand',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'demand',
        name: 'DemandList',
        component: () => import('@/views/DemandList.vue'),
        meta: { title: '待应标清单', icon: 'Document' }
      },
      {
        path: 'demand/:id',
        name: 'DemandDetail',
        component: () => import('@/views/DemandDetail.vue'),
        meta: { title: '采购需求详情', hidden: true }
      },
      {
        path: 'quote/submit/:demandId',
        name: 'QuoteSubmit',
        component: () => import('@/views/QuoteSubmit.vue'),
        meta: { title: '应标报价', hidden: true }
      },
      {
        path: 'my-quotes',
        name: 'MyQuotes',
        component: () => import('@/views/MyQuotes.vue'),
        meta: { title: '我的应标', icon: 'Tickets' }
      },
      {
        path: 'shipping/:quoteId',
        name: 'Shipping',
        component: () => import('@/views/Shipping.vue'),
        meta: { title: '发货操作', hidden: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/demand'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '供应商端'} - 汽服配件采购报价系统`

  const userStore = useUserStore()

  // 需要认证的路由
  if (to.meta.requiresAuth !== false && !userStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // 已登录用户访问登录页
  if (to.name === 'Login' && userStore.isLoggedIn) {
    next({ name: 'DemandList' })
    return
  }

  next()
})

export default router
