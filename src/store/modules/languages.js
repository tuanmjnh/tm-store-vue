import { SET_CATCH, SET_ITEMS, SET_ITEM, PUSH_ITEMS } from '../mutation-type'
import { FBStore, timestamp } from '@/plugins/firebaseInit'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    default: {
      name: '',
      icon: '<i class="material-icons">outlined_flag</i>',
      desc: '',
      orders: 1,
      created: { by: '', at: new Date() },
      updated: { by: '', at: null },
      deleted: { by: '', at: null },
      flag: 1
    }
  },
  getters: {
    getAll(state) {
      return state.items
    },
    getById: state => id => {
      return state.items.find(x => x.id === id)
    },
    getByFlag: state => flag => {
      return state.items.filter(x => x.flag === flag)
    }
  },
  mutations: {
    [SET_ITEMS](state, items) {
      state.items = items
    },
    [SET_ITEM](state, item) {
      state.item = item
    },
    [PUSH_ITEMS](state, item) {
      state.items.push(item)
    }
  },
  actions: {
    select({ commit, state }) {
      state.items = []
      return FBStore.collection("languages").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data())
          var items = state.default
          items = doc.data()
          items.id = doc.id
          if (items.created.at) items.created.at = items.created.at.toDate()
          if (items.updated.at) items.updated.at = items.updated.at.toDate()
          if (items.deleted.at) items.deleted.at = items.deleted.at.toDate()
          commit(PUSH_ITEMS, items)
        })
      }).catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    insert({ commit, state }) {
      state.item.created = { by: 'Admin', at: timestamp }
      // state.item.created = { by: 'Admin', at: new Date() }
      FBStore.collection("languages")
        .add(state.item).then((item) => {
          commit(PUSH_ITEMS, item)
          commit(SET_ITEM, state.default)
        }).catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    selected({ commit, state }) {
      commit(SET_ITEM, state.default)
    }
  }
}
