import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'
import login from './moudles/login'
Vue.use(Vuex);

export default new Vuex.Store({
  // modules:{
  //   login
  // },
  state:{
    active_nav:'',//选中的菜单
    shop_name:'',
    shop_id:'',
    shop_logo:'',
    browser_num:'',
    login_name:''
  },
  mutations:{
    [types.SHOP_NAME](state,res){
      state.shop_name = res;
    },
    [types.SHOP_ID](state,res){
      state.shop_id = res;
    },
    [types.SHOP_LOGO](state,res){
      state.shop_logo = res;
    },
    [types.LOGIN_NAME](state,res){
      state.login_name = res;
    },
    [types.BROWSER_NUM](state,res){
      state.browser_num = res;
    },
    [types.ACTIVE_NAV] (state,res) {
      state.active_nav = res;
    }
  },
  actions:{
    setShopName({commit},res){
      sessionStorage.setItem('shopName',res);
      commit(types.SHOP_NAME,res);
    },
    setShopId({commit},res){
      sessionStorage.setItem('shopId',res);
      commit(types.SHOP_ID,res);
    },
    setShopLogo({commit},res){
      sessionStorage.setItem('shopLogo',res);
      commit(types.SHOP_LOGO,res);
    },
    setLoginName({commit},res){
      sessionStorage.setItem('loginName',res);
      commit(types.LOGIN_NAME,res);
    },
    setBrowserNum({commit},res){
      sessionStorage.setItem('browserNum',res);
      commit(types.BROWSER_NUM,res);
    },
    setActiveNav ({commit},res) {
      sessionStorage.setItem('activeNav',res);
      commit(types.ACTIVE_NAV,res);
    }
  }
})
