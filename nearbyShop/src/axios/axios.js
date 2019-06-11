/**
 * 接口调用方法
 * author：MarLion
 * time：2018-12-1
 * axios.方法名
 */
import axios from 'axios'
import qs from 'querystring'
import * as base from './base'
//axios配置
axios.defaults.timeout = 20000;   //超时
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';  //请求头
//axios.defaults.baseURL = base.baseUrl;   //请求基本路径

////设置拦截器
// //POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }
  return config;
}, (error) => {
  console.log('参数错误');
  return Promise.reject(error);
});

//请求返回Promise对象 post方法
export function fetchPost(url,params) {
  return new Promise((resolve, reject) => {
      axios.post(url,params)
        .then(response => {
          resolve(response.data);
        }, err => {
          reject(err);
        })
        .catch((error) => {
          reject(error);
        })
    }
  )
}

//get方法
export  function fetchGet(url,params) {
  return new Promise((resolve, reject) => {
      axios.get(url,{params:params})
        .then(response => {
          resolve(response.data);
        }, err => {
          reject(err);
        })
        .catch((error) => {
          reject(error);
        })
    }
  )
}

export default {
  /***
   * 登录
   * */
  Login(params){
    return fetchPost(base.baseUrl.serviceOne + '/sys/businessesLogin', params);
  },

  /**
   *首页展示数据
   **/
  //销售统计
  HomeSaleStatic(params){
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/homeSalesStatistics',params);
  },

  //订单统计
  HomeOrderStatic(params){
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/homeOrderStatistics',params);
  },

  //销售排行
  HomeSaleRank(params){
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/homeSalesRanking',params);
  },

  //销售金额趋势
  HomeSaleAmount(params){
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/getHomeSalesAmountTrend',params);
  },

  //销售订单趋势
  HomeOrderAmount(params){
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/getHomeSalesOrderTrend',params);
  },

  /**
   *商品管理
   * */
  // 获取商品列表
  ProductGetGoodList(params){
    return fetchPost(base.baseUrl.serviceOne + '/goods/getgoodsList',params);
  },

  //获取商品一级分类
  ProductFirstClass(params){
    return fetchGet(base.baseUrl.serviceOne + '/goodsType/getFirstClassLevel',params);
  },

  //获取商品二级分类
  ProductSecondClass(params){
    return fetchPost(base.baseUrl.serviceOne + '/goodsType/getSecondClassLevelByFirstClass',params);
  },

  //上架 下架商品
  ProductChangeStatus(params){
    return fetchPost(base.baseUrl.serviceOne + '/goods/editGoodsStatus',params);
  },
  /*新增商品时*/
  //查询规格参数
  ProductGetParams(params){
    return fetchPost(base.baseUrl.serviceOne + '/goodsSpecificTemplateValue/getSpecificList',params);
  },

  //计算所需积分
  ProductIntegral(params){
    return fetchPost(base.baseUrl.serviceOne + '/goods/calculateIntegral',params);
  },

  //提交商品
  ProductSave(params){
    return fetchPost(base.baseUrl.serviceOne + '/goods/saveOrAddGoods',params);
  },

  //获取商品信息
  ProductDetail(params){
    return fetchGet(base.baseUrl.serviceOne + '/goods/editGoods',params);
  },

  //获取售后服务信息
  ProductSaleServiceMessage(params){
    return fetchPost(base.baseUrl.serviceOne + '/app-shop-manage/getSaleServer',params);
  },

  //待审批状态下取消上架
  ProductCancelUp(params){
    return fetchPost(base.baseUrl.serviceOne + '/goodsCheck/cancelShelf',params);
  },

  /**
   * 订单管理
   * */
  //获取订单统计
  OrderStatics (params) {
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/getOrderSalesStatistics',params);
  },

  //获取门店列表
  OrderGetShopList (params) {
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/getShopInfoList',params);
  },

  //获取订单列表
  OrderList (params) {
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/getGoodsListByOrderInfo',params);
  },

  //批量出货
  OrderLotsExport(params){
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/batchShopSendOrder',params);
  },

  //门店出货
  OrderShopExport(params){
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/batckOwnShopSendOrder',params);
  },

  //同意退货
  OrderReturnGoods(params){
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/pcShopAcceptOrRefuse',params);
  },

  //退款
  OrderDrawBack(params){
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/shopRefundOrder',params);
  },

  //获取物流列表
  OrderExpressList(params){
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/getExpressCompanys',params);
  },

  //立即发货
  OrderSendGoods(params){
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/shopSendOrder',params);
  },

  //订单详情
  OrderDetail(params){
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/getNewOrderDetails',params);
  },

  //订单追踪
  OrderContract(params){
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/getLogisticsInfo',params);
  },

  //获取物流信息
  OrderExpressMessage(params){
    return fetchPost(base.baseUrl.serviceOne + '/shoppingOrder/getOrderExpressInfo',params);
  },


  /***
   * 财务管理
   * */
  //销售统计
  FinanceStatic(params){
    return fetchPost(base.baseUrl.serviceOne + '/financial/getFinancialStatistic',params);
  },

  //财务列表
  FinaaceStaticList(params){
    return fetchPost(base.baseUrl.serviceOne + '/financial/getFinancialNotes',params);
  },

  /**
   * 小店管理
   * */
  //查看小店信息
  ShopOringalMessage(params){
    return fetchPost(base.baseUrl.serviceOne + '/shop/getShopDetails',params);
  },

  //小店基本信息修改
  ShopUpdateBasic(params){
    return fetchPost(base.baseUrl.serviceOne + '/shop/updateShopBasicInformation',params);
  },

  //经营范围修改
  ShopUpdateRange(params){
    return fetchPost(base.baseUrl.serviceOne + '/shop/updateBusinessScope',params);
  },

  //商户特色修改
  ShopUpdateFeature(params){
    return fetchPost(base.baseUrl.serviceOne + '/shop/updateShopFeature',params);
  },

  //商户描述修改
  ShopUpdateDesc(params){
    return fetchPost(base.baseUrl.serviceOne + '/shop/updateStoreDesc',params);
  },

  //特色标签修改
  ShopUpdateLabel(params){
    return fetchPost(base.baseUrl.serviceOne + '/shop/updateFeaturedLabel',params);
  },

  //商家相册修改
  ShopUpdatePgoto(params){
    return fetchPost(base.baseUrl.serviceOne + '/shop/updateShopAlbum',params);
  },

  //商户Logo修改
  ShopUpdateLogo(params){
    return fetchPost(base.baseUrl.serviceOne + '/shop/updateShopLogo',params);
  },

  //商户背景图修改
  ShopUpdateImage(params){
    return fetchPost(base.baseUrl.serviceOne + '/shop/updateShopBackgroundImage',params);
  },

  /**
   * 个人中心
   * */
  //修改密码
  CenterUpdatePassword(params){
    return fetchGet(base.baseUrl.serviceOne + '/sys/changePassword',params);
  },

  //获取售后服务信息
  CenterGetService(params){
    return fetchGet(base.baseUrl.serviceOne + '/afterService/getAfterServiceList',params);
  },

  //保存
  CenterSaveService(params){
    return fetchGet(base.baseUrl.serviceOne + '/afterService/saveAfterService',params);
  }
}


