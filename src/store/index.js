import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-type'
//
// import state from './state'
// import actions from './actions'
// import mutations from './mutations'
// modules
// import nav from './modules/nav'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {},
  state: {
    _noimage: `Uploads/noimage.jpg`,
    _message: {},
  }, // State
  getters: {}, // = computed properties
  actions: {}, // Actions
  mutations: {
    [types.SET_MESSAGE](state, res) {
      state._message = res.data.message || {}
      state._message.status = res.status || 0
      state._message.statusText = res.statusText || 'Error'
    },
    [types.AXIOS_CATCH](state, error) {
      state._message = {
        type: 'danger',
        text: 'Không thể kết nối đến máy chủ, vui lòng thực hiện lại!', // error.response ? error.response.statusText : error,
        status: error.response ? error.response.status : 0,
        statusText: error.response ? error.response.statusText : 'Error'
      }
    }
  } // Mutations
})
