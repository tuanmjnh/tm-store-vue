import Vue from 'vue'
import Vuex from 'vuex'
import { SET_MESSAGE, SET_CATCH } from './mutation-type'
//
// import state from './state'
// import actions from './actions'
// import mutations from './mutations'
// modules
// import nav from './modules/nav'
import users from './modules/users'
import languages from './modules/languages'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    users,
    languages
  },
  state: {
    _noimage: `Uploads/noimage.jpg`,
    _message: { show: false },
  }, // State
  getters: {}, // = computed properties
  actions: {
    message({ commit }, data) { commit(SET_MESSAGE, data) }
  }, // Actions
  mutations: {
    [SET_MESSAGE](state, res) {
      state._message = {
        mode: '',
        x: 'right',
        y: 'top',
        show: res.text ? true : false,
        timeout: 6000,
        color: res.color || '',
        text: res.text || '',
        status: res.status || 0,
        statusText: res.statusText || 'Error',
      }
    },
    [SET_CATCH](state, error) {
      state._message = {
        color: 'danger',
        text: 'Không thể kết nối đến máy chủ, vui lòng thực hiện lại!', // error.response ? error.response.statusText : error,
        status: error.response ? error.response.status : 0,
        statusText: error.response ? error.response.statusText : error
      }
    }
  } // Mutations
})


// import Vue from 'vue'
// import Vuex from 'vuex'
// import state from './state'
// import actions from './actions'
// import mutations from './mutations'

// Vue.use(Vuex)

// export default new Vuex.Store({
//   state,
//   actions,
//   mutations
// })
