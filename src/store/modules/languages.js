import { SET_CATCH, SET_ITEMS, SET_ITEM, PUSH_ITEMS, UPDATE_ITEMS, SET_MESSAGE } from '../mutation-type'
import { FBStore, timestamp, docChanges } from '@/plugins/firebaseInit'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    query: {
      search: ''
    },
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
      return FBStore.collection("languages").get().then(qss => {
        qss.forEach(doc => {
          var item = doc.data()
          item.id = doc.id
          state.items.push(item)
        })
      })
    },
    getAllId(state) {
      return state.items
    },
    getById: state => id => {
      return state.items.find(x => x.id === id)
    },
    getByFlag: state => flag => {
      return state.items.filter(x => x.flag === flag)
    },
    getFilter: state => query => {
      var items = state.items
      if (query.search) {
        items = items.filter(function(row) {
          return Object.keys(row).some(function(key) {
            return String(row[key]).toLowerCase().indexOf(query.search) > -1
          })
        })
      }
      return items
    },
  },
  mutations: {
    [SET_ITEMS](state, items) {
      state.items = items
    },
    [SET_ITEM](state, item) {
      state.item = Object.assign({}, item)
    },
    [PUSH_ITEMS](state, item) {
      state.items.push(item)
    },
    [UPDATE_ITEMS](state, item) {
      const index = state.items.findIndex(x => x.id === item.id)
      state.items.splice(index, 1, state.item)
    }
  },
  actions: {
    init({ state }) {
      state.items = []
      docChanges({
        data: state.items,
        collections: FBStore.collection("languages").orderBy("created.at", "desc")
        // .startAfter((page - 1) * rowsPerPage)
        // .limit(rowsPerPage)
      })
    },
    select({ commit, state }) {
      return FBStore.collection("languages").get().then(function(querySnapshot) {
        var items = []
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data())
          var item = state.default
          item = doc.data()
          item.id = doc.id
          items.push(item)
        })
        commit(SET_ITEMS, items)
      }).catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    insert({ commit, state }) {
      // state.item.created = { by: 'Admin', at: new Date() }
      // state.items.push(state.item)
      state.item.created = { by: 'Admin', at: timestamp }
      FBStore.collection("languages")
        .add(state.item)
        .then(docRef => {
          commit(PUSH_ITEMS, Object.assign({ id: docRef.id }, state.item))
          commit(SET_ITEM, state.default)
          commit(SET_MESSAGE, { text: 'Cập nhật thành công', color: 'success' }, { root: true })
        })
        .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    update({ commit, state }) {
      FBStore.collection("languages").doc(state.item.id)
        .set(state.item)
        .then(docRef => {
          commit(UPDATE_ITEMS, state.item)
          commit(SET_MESSAGE, { text: 'Cập nhật thành công', color: 'success' }, { root: true })
        })
        .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    delete({ commit, state }) {
      FBStore.collection("languages").doc(state.item.id)
        .update({ flag: state.item.flag === 1 ? 0 : 1 })
        .then(docRef => {
          state.item.flag = state.item.flag === 1 ? 0 : 1
          commit(UPDATE_ITEMS, state.item)
          commit(SET_ITEM, state.default)
          commit(SET_MESSAGE, { text: 'Cập nhật thành công', color: 'success' }, { root: true })
        })
        .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    remove({ commit, state }) {

    },
    item({ commit, state }, item) {
      if (item) commit(SET_ITEM, item)
      else commit(SET_ITEM, state.default)
    }
  }
}
