import Vue from 'vue'
import Vuex from 'vuex'
import { SET_MESSAGE, SET_CATCH } from './mutation-type'
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
    $loadingApp: false,
    $loading: false,
    $noimage: `Uploads/noimage.jpg`,
    $message: { show: false },
    $language_def: 'vi-VN',
    $language: 'vi-VN', //_languages.GetLanguage(),
    $dictionary: [] //_languages.GetLanguages(),
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
  actions: {
    message({ commit }, data) { commit(SET_MESSAGE, data) },
    messageClose({ state }, data) { state.$message.show = data },
    async setLanguage({ commit, state }) {
      state.$loadingApp = true
    },
  }, // Actions
  mutations: {
    [SET_MESSAGE](state, res) {
      state.$message = {
        mode: '',
        x: 'right',
        y: 'top',
        show: res.text ? true : false,
        timeout: 6000,
        color: res.color || 'success',
        text: res.text || '',
        status: res.status || 0,
        statusText: res.statusText || 'Error'
      }
    },
    [SET_CATCH](state, error) {
      if (!error.response) {
        console.log(error)
        return
      }
      if (error.response.status === 401) {
        this.dispatch('auth/logout')
        let text = state.$dictionary.auth && state.$dictionary.auth.msg_err_expired ?
          state.$dictionary.auth.msg_err_expired :
          error.response ? error.response.statusText : error
        state.$message = {
          mode: '',
          x: 'right',
          y: 'top',
          timeout: 6000,
          show: true,
          color: 'danger',
          text: text,
          status: error.response ? error.response.status : 0,
          statusText: error.response ? error.response.statusText : error
        }
      } else {
        let text = state.$dictionary.messages && state.$dictionary.messages.err_connection ?
          state.$dictionary.messages.err_connection :
          error.response ? error.response.statusText : error
        state.$message = {
          mode: '',
          x: 'right',
          y: 'top',
          timeout: 6000,
          show: true,
          color: 'danger',
          text: text,
          status: error.response ? error.response.status : 0,
          statusText: error.response ? error.response.statusText : error
        }
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
