import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
//登录
import login from '../components/login/login'
// 导入首页组件
import firstPage from '../components/homePage/firstPage'
// 导入商品管理主组件
import productManage from '../components/productManage/productManage'
import productAddNew from '../components/productManage/productAddNew'
import productEdit from '../components/productManage/productEdit'
import productLook from '../components/productManage/productLook'
// 导入订单管理模块
import allOrders from '../components/orderManage/allOrders'
import orderDetail from '../components/orderManage/orderDetail'
// 导入财务管理模块
import financeManageFirst from '../components/financeManage/financeManageFirst'
// 导入小店管理模块
import shopInfoCheck from '../components/shopManage/shopInfoCheck'
// 导入个人中心模块
import userCenter from '../components/usersCenter/userCenter'
export default new Router({
//   mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
    },
    {
      path: '/firstPage',
      name: 'firstPage',
      component: firstPage,
      meta:{
        requireAuth:true
      }
    },
    {
      path: '/productManage',
      name: 'productManage',
      component: productManage,
      meta:{
        requireAuth:true
      }
    },
    {
      path: '/productAddNew',
      name: 'productAddNew',
      component: productAddNew,
      meta:{
        requireAuth:true
      }
    },
    {
      path: '/productEdit',
      name: 'productEdit',
      component: productEdit,
      meta:{
        requireAuth:true
      }
    },
    {
      path: '/productLook',
      name: 'productLook',
      component: productLook,
      meta:{
        requireAuth:true
      }
    },
    {
      path: '/allOrders',
      name: 'allOrders',
      component: allOrders,
      meta:{
        requireAuth:true
      }
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: orderDetail,
      meta:{
        requireAuth:true
      }
    },
    {
      path: '/financeManageFirst',
      name: 'financeManageFirst',
      component: financeManageFirst,
      meta:{
        requireAuth:true
      }
    },
    {
      path: '/shopInfoCheck',
      name: 'shopInfoCheck',
      component: shopInfoCheck,
      meta:{
        requireAuth:true
      }
    },
    {
      path: '/userCenter',
      name: 'userCenter',
      component: userCenter,
      meta:{
        requireAuth:true
      }
    },
  ]
})
