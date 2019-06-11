import * as types from '../types'

const state = {
  active_nav:''
};

const mutations = {
  [types.ACTIVE_NAV] (state,res) {
    state.active_nav = res;
  }
};

const actions = {
  setActiveNav ({commit},res) {
    sessionStorage.setItem('activeNav',res);
    commit(types.ACTIVE_NAV,res);
  }
};

export default {
  state,
  mutations,
  actions
}
