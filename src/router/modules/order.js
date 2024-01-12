// 导入组件
const Layout = () => import('@/layout/index.vue')
const orderStatistics = ()=>import ('@/views/order/orderStatistics.vue')

// 导出该组件
export default [
  {
    path: '/order',
    component: Layout,
    name: 'order',
    meta: {
      title: '订单管理',
    },
    icon: 'ShoppingTrolley',
    children: [
      {
        path: '/orderStatistics',
        name: 'orderStatistics',
        component: orderStatistics,
        meta: {
          title: '订单统计',
        },
        hidden: false,
      },
    
    ],
  },
]
