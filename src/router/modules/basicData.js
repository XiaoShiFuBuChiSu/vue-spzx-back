const Layout = () => import('@/layout/index.vue')
const productUnit = ()=>import ('@/views/basicData/productUnit.vue')

export default [
  {
    path: '/basicData',
    component: Layout,
    name: 'basicData',
    meta: {
      title: '基本数据管理',
    },
    icon: 'Grid',
    children: [
      {
        path: '/productUnit',
        name: 'productUnit',
        component: productUnit,
        meta: {
          title: '商品单位管理',
        },
      },
    ],
  },
]