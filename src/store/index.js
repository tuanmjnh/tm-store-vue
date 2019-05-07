import Vue from 'vue'
import Vuex from 'vuex'
import * as storageLanguages from '@/plugins/languages'
//
// import state from './state'
// import actions from './actions'
// import mutations from './mutations'
// modules
// import nav from './modules/nav'
import auth from './modules/auth'
import users from './modules/users'
import languages from './modules/languages'
import dictionary from './modules/dictionary'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    auth,
    users,
    languages,
    dictionary
  },
  state: {
    $user: {},
    $loadingApp: false,
    $loading: false,
    $noimage: `Uploads/noimage.jpg`,
    $language_def: 'vi-VN',
    $language: 'vi-VN', //_languages.GetLanguage(),
    $dictionary: [], //_languages.GetLanguages(),
    $row_per_page: [10, 25, 50, 100, 200, 500], //  { text: "All", value: -1 }
    $message: {
      mode: '',
      x: 'right',
      y: 'top',
      timeout: 6000,
      show: false,
      color: 'success',
      text: '',
      status: '',
      statusText: ''
    },
  }, // State
  getters: {
    languages: state => key => {
      if (!key || key.length < 1) return
      if (typeof key === 'string') key = [key]
      var regx = /:([^"]+)/g
      let rs = ''
      for (let index = 0; index < key.length; index++) {
        const e = key[index].toLowerCase().split('.')
        if (e.length < 2) {
          const e0 = e[0].split(':')
          if (!state.$dictionary[e0[0]]) rs += key[index]
          else rs += (index > 0 ? state.$dictionary[e0[0]].toLowerCaseFirst() : state.$dictionary[e0[0]])
          if (e0.length > 1) rs = rs.format(e0[1])
        } else if (e.length < 3) {
          const e1 = e[1].split(':')
          if (!state.$dictionary[e[0]] || !state.$dictionary[e[0]][e1[0]]) rs += key[index]
          else rs += (index > 0 ? state.$dictionary[e[0]][e1[0]].toLowerCaseFirst() : state.$dictionary[e[0]][e1[0]])
          if (e1.length > 1) rs = rs.format(e1[1].split(','), 'ff')
        }
      }
      return rs
    }
  }, // = computed properties
  mutations: {
    SET_MESSAGE(state, res) {
      state.$message.text = res.text || ''
      state.$message.show = true
    },
    SET_CATCH(state, error) {
      if (error.response.status === 401) {
        this.dispatch('auth/logout')
        state.$message.text = state.$dictionary.auth && state.$dictionary.auth.msg_err_expired ?
          state.$dictionary.auth.msg_err_expired : error.response.statusText
      }
      else { // error.response
        state.$message.text = state.$dictionary.error && state.$dictionary.error.connection ?
          state.$dictionary.error.connection : error.message
        console.log(error)
      }
      state.$message.color = 'danger'
      state.$message.show = true
    },
    SET_LANG(state, $lang) {
      state.$lang = $lang
    },
    PUSH_LANG(state, $lang) {
      state.$lang.push($lang)
    },
    UPDATE_LANG(state, $lang) {
      const index = state.$lang.findIndex(x => x.id === $lang.id)
      state.$lang.splice(index, 1, $lang)
    },
    REMOVE_LANG(state, $lang) {
      const index = state.$lang.findIndex(x => x.id === $lang.id)
      if (index >= 0) state.$lang.splice(index, 1)
    }
  },// Mutations
  actions: {
    message({ commit }, data) { commit('SET_MESSAGE', data) },
    messageClose({ state }, data) { state.$message.show = data },
    async setLanguage({ commit, state }) {
      state.$loadingApp = true
    },
    notification({ state }) {
      state.$notification = !state.$notification
    }
  } // Actions
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
