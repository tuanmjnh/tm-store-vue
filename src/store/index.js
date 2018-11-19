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
import lang_items from './modules/lang_items'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    users,
    languages,
    lang_items
  },
  state: {
    $noimage: `Uploads/noimage.jpg`,
    $message: { show: false },
    $isAuth: false,
    $lang: []
  }, // State
  getters: {}, // = computed properties
  actions: {
    message({ commit }, data) { commit(SET_MESSAGE, data) },
    messageClose({ state }, data) { state.$message.show = data }
  }, // Actions
  mutations: {
    [SET_MESSAGE](state, res) {
      state.$message = {
        mode: '',
        x: 'right',
        y: 'top',
        show: res.text ? true : false,
        timeout: 5000,
        color: res.color || '',
        text: res.text || '',
        status: res.status || 0,
        statusText: res.statusText || 'Error',
      }
    },
    [SET_CATCH](state, error) {
      // if (error.response.status === 401) this.dispatch('auth/logout')
      state.$message = {
        mode: '',
        x: 'right',
        y: 'top',
        show: true,
        timeout: 5000,
        color: 'danger',
        text: 'Không thể kết nối đến máy chủ, vui lòng thực hiện lại!', // error.response ? error.response.statusText : error,
        status: error.response ? error.response.status : 0,
        statusText: error.response ? error.response.statusText : error
      }
    },
    ['SET_LANG'](state, $lang) {
      state.$lang = $lang
    },
    ['PUSH_LANG'](state, $lang) {
      state.$lang.push($lang)
    },
    ['UPDATE_LANG'](state, $lang) {
      const index = state.$lang.findIndex(x => x.id === $lang.id)
      state.$lang.splice(index, 1, $lang)
    },
    ['REMOVE_LANG'](state, $lang) {
      const index = state.$lang.findIndex(x => x.id === $lang.id)
      if (index >= 0) state.$lang.splice(index, 1)
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
