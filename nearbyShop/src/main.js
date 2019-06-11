import Vue from 'vue'
import App from './App.vue'
import iView from 'iview'
import vueAmap from 'vue-amap'
import router from './router/index.js'
import store from './store/index.js'
import headView from './components/public/header'//头部组件
import navView from './components/public/nav'//导航组件
import uploadView from './components/public/uploadImg'//上传图片组件
import uploadRevise from './components/public/uploadRevise'
import backView from './components/public/background'
import 'babel-polyfill' //es6转es5 兼容ie
import tool from './assets/js/tool' //一些工具函数
Vue.prototype.$tool = tool;
Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(vueAmap);
vueAmap.initAMapApiLoader({
  key: '5a6ba265fd68eded228497147464bf3e',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});
import 'iview/dist/styles/iview.css'//导入iview样式库
import './assets/css/common.css'// 导入公共样式
import './lib/font-awesome/css/font-awesome.min.css'// 导入字头图标
Vue.component('upload-view',uploadView);
Vue.component('upload-revise',uploadRevise);
Vue.component('back-view',backView);
Vue.component('head-view',headView);
Vue.component('nav-view',navView);
/* eslint-disable no-new */
router.beforeEach((to,from,next) =>{
  store.state.shop_id = sessionStorage.getItem('shopId');
  if (to.meta.requireAuth) {
    if ( store.state.shop_id !== '' &&  store.state.shop_id != null) {
      next()
    } else {
      next({
        path:'/'
      })
    }
  }else {
    next()
  }
});
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
  });
