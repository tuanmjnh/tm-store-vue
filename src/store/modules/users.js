import { SET_CATCH, SET_ITEMS, SET_ITEM, PUSH_ITEM } from '../mutation-type'
import { FBStore, FBAuth } from '@/plugins/firebaseInit'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    default: {
      username: '',
      password: '',
      full_name: '',
      email: '',
      image: '',
      created: { by: '', at: new Date() },
      updated: { by: '', at: null },
      deleted: { by: '', at: null },
      flag: 1
    }
  },
  getters: {
    getAll(state) {
      return state.data
    },
    getById: state => id => {
      return state.data.find(data => data.uid === id)
    },
    getByStatus: state => status => {
      return state.data.filter(data => data.status === status)
    }
  },
  mutations: {
    [SET_ITEMS](state, data) {
      state.data = data
    },
    [SET_ITEM](state, selected) {
      state.selected = selected
    },
    [PUSH_ITEM](state, item) {
      state.data.push(item)
    }
  },
  actions: {
    select({ commit, state }) {
      return FBStore.collection("users").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data())
          var items = state.default
          items = doc.data()
          items.id = doc.id
          commit(SET_ITEMS, items)
        })
      }).catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    insert({ commit, state }) {
      state.item.created = { by: 'Admin', at: new Date() }
      FBStore.collection("users")
        .add(state.item).then((item) => { commit(PUSH_ITEM, item) })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    }
    // async insert({ commit, state }, data) {
    //   await axios.mle
    //     .post(controller, data)
    //     .then(function(res) {
    //       if (res.status === 200) {
    //         commit(types.PUSH_DATA, res.data.data)
    //         commit(types.SET_SELECTED, state.default)
    //       }
    //       commit(types.SET_MESSAGE, res, { root: true })
    //     })
    //     .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) })
    // },
    // async update({ commit }, data) {
    //   await axios.mle
    //     .put(controller + data.uid, data)
    //     .then(function(res) {
    //       if (res.status === 200) data.data = res.data
    //       commit(types.SET_MESSAGE, res, { root: true })
    //     })
    //     .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) })
    // },
    // async delete({ commit, state }, data) {
    //   var _data = []
    //   data.forEach(i => { _data.push({ uid: i.selected.uid, status: i.status }) })
    //   await axios.mle
    //     .put(controller + this.state._action.delete, data)
    //     .then(function(res) {
    //       if (res.status === 200) {
    //         data.forEach(i => { i.selected.status = i.status })
    //         commit(types.SET_SELECTED, state.default)
    //       }
    //       commit(types.SET_MESSAGE, res, { root: true })
    //     })
    //     .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) })
    // },
    // async selected({ commit, state }, data) {
    //   if (data) commit(types.SET_SELECTED, data)
    //   else commit(types.SET_SELECTED, state.default)
    // },
    // async updateq({ commit }, data) {
    //   await axios.mle
    //     .put(controller + this.state._action.quick_edit, data)
    //     .then(function(res) { commit(types.SET_MESSAGE, res, { root: true }) })
    //     .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) })
    // }
  }
}
