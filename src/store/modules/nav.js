// import api from "@/api";
import * as types from '../mutation-type'
export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetch({ commit }, items) {
      commit(types.SET_DATA, items)
    }
  },
  mutations: {
    [types.SET_DATA](state, items) {
      state.items = items
    }
  }
}
