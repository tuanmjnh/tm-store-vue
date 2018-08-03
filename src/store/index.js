import Vue from 'vue'
import Vuex from 'vuex'
import * as axios from '@/utils/axios-config'
import * as storage from '@/utils/storage'
import * as types from './mutation-type'
//
// import state from './state'
// import actions from './actions'
// import mutations from './mutations'
// modules
import nav from './modules/nav'
import authentication from './modules/authentication'
import modules from './modules/modules'
import test from './modules/test'
import users from './modules/users'
import member from './modules/member'
import courses from './modules/courses'
import classes from './modules/classes'
import lesson from './modules/lesson'
import exercises from './modules/exercises'
import question from './modules/question'
import questionSub from './modules/questionSub'
import classComponent from './modules/classComponent'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    nav,
    authentication,
    modules,
    test,
    users,
    member,
    courses,
    classes,
    lesson,
    exercises,
    question,
    questionSub,
    classComponent
  },
  state: {
    _axios_config: axios.mle.defaults,
    _file_manager: {
      controller: 'api/filemanager',
      base_path: 'Uploads'
    },
    _action: {
      quick_edit: 'quickedit/',
      delete: 'delete/'
    },
    _noimage: `${axios.mle.defaults.host}Uploads/noimage.jpg`,
    _message: {},
    _auth: storage.get()
  }, // State
  getters: {}, // = computed properties
  actions: {}, // Actions
  mutations: {
    [types.SET_MESSAGE](state, res) {
      state._message = res.data.message || {}
      state._message.status = res.status || 0
      state._message.statusText = res.statusText || 'Error'
    },
    [types.SET_AUTH](state, auth) {
      storage.set(axios.mle, auth)
      state._auth = storage.get()
    },
    [types.REMOVE_AUTH](state) {
      storage.set(axios.mle, state._auth, true)
      state._auth = storage.get(true)
    },
    [types.AXIOS_CATCH](state, error) {
      storage.set(axios.mle, state._auth, true)
      state._auth = storage.get(true)
      state._message = {
        type: 'danger',
        text: 'Không thể kết nối đến máy chủ, vui lòng thực hiện lại!', // error.response ? error.response.statusText : error,
        status: error.response ? error.response.status : 0,
        statusText: error.response ? error.response.statusText : 'Error'
      }
    }
  } // Mutations
})
