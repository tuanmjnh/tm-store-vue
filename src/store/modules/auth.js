import { SET_CATCH, SET_ITEM, SET_MESSAGE } from '../mutation-type'
import { FBAuth, FBStore, timestamp, docChanges } from '@/plugins/firebaseInit'
import * as storageAuth from '@/plugins/storage-auth'
const collection = 'languages'
export default {
  namespaced: true,
  state: {
    item: {},
    user: {},
    authenticated: false,
    default: {
      token: '',
      username: '',
      password: '',
      remember: false
    }
  },
  getters: {},
  mutations: {
    [SET_ITEM](state, item) {
      state.item = item ? { ...item } : state.default
    },
    ['SET_AUTHENTICAION'](state, val) {
      state.authenticated = val || false
      // console.log(state.authenticated)
    },
    ['SET_USER'](state, user) {
      state.user = user || null
    }
  },
  actions: {
    async signIn({ commit, state, rootGetters, rootState }, loading = false) {
      // Loading
      if (loading) rootState.$loadingApp = true
      // http
      FBAuth.signInWithEmailAndPassword(state.item.username, state.item.password)
        .then(rs => {
          rootState.$user.uid = rs.user.uid
          rootState.$user.token = rs.user.refreshToken
          rootState.$user.remember = state.item.remember
          rootState.$user.username = state.item.username
          storageAuth.signIn(rootState.$user)
          commit('SET_AUTHENTICAION', true)
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
        .finally(() => { setTimeout(() => { rootState.$loadingApp = false }, 200) })
    },
    async signOut({ commit, state, rootGetters, rootState }, loading = false) {
      // Loading
      if (loading) rootState.$loadingApp = true
      // http
      FBAuth.signOut()
        .then(() => {
          storageAuth.signOut()
          commit('SET_AUTHENTICAION')
        })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
        .finally(() => { setTimeout(() => { rootState.$loadingApp = false }, 200) })
    },
    async setAuthenticated({ commit, rootState }, val = false) {
      commit('SET_AUTHENTICAION', val)
      //commit('SET_USER', storageAuth.GetStorage())
      rootState.$user = storageAuth.GetStorage() || null
    },
    async item({ commit }, item = null) {
      commit('SET_ITEM', item)
    }
  }
}
