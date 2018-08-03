import * as axios from '@/utils/axios-config'
import * as types from '../mutation-type'
const controller = 'auth/'
export default {
  namespaced: true,
  state: {},
  getters: {
    isAuth: state => !!state.token
  },
  actions: {
    async login({ commit }, data) {
      await axios.mle
        .post(controller, data)
        .then(function(res) {
          // commit auth
          if (res.data.data && res.data.token) commit(types.SET_AUTH, { token: res.data.token, user: data.username, remember: data.remember }, { root: true })
          // commit message
          commit(types.SET_MESSAGE, res, { root: true })
        })
        .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) }) // commit catch
    },
    async logout({ commit }) {
      commit(types.REMOVE_AUTH, {}, { root: true })
      var res = {
        data: { message: { type: 'danger', text: 'Đăng xuất thành công' } },
        status: 200,
        statusText: 'OK'
      }
      commit(types.SET_MESSAGE, res, { root: true })
    },
    async get({ commit }, data) {
      console.log(axios)
      await axios.mle
        .get(controller, data)
        .then(function(res) {
          // commit message
          commit(types.SET_MESSAGE, res, { root: true })
        })
        .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) }) // commit catch
    }
  },
  mutations: {}
}
