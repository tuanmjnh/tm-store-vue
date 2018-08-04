import { SET_CATCH, SET_ITEMS, SET_ITEM, PUSH_ITEM } from '../mutation-type'
import { FBStore, FBAuth } from '@/plugins/firebaseInit'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    default: {
      name: '',
      desc: '',
      icon: '<i class="material-icons">outlined_flag</i>',
      orders: 1,
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
      return FBStore.collection("languages").get().then(function(querySnapshot) {
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
      FBStore.collection("languages")
        .add(state.item).then((item) => { commit(PUSH_ITEM, item) })
        .catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    }
  }
}
