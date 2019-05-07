import { SET_CATCH, SET_ITEMS, PUSH_ITEMS, UPDATE_ITEMS, REMOVE_ITEMS, SET_ITEM, SET_MESSAGE } from '../mutation-type'
import { FBStore, timestamp, docChanges } from '@/plugins/firebaseInit'
import * as storageAuth from '@/plugins/storage-auth'
const collection = 'languages'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    selected: [],
    dialog: false,
    isGetFirst: true,
    cll: FBStore.collection(collection),
    default: {
      name: '',
      code: '',
      icon: '<i class="material-icons">outlined_flag</i>',
      desc: '',
      orders: 1,
      attach: '',
      lang: '',
      created_by: '',
      created_at: new Date(),
      updated_by: '',
      updated_at: null,
      deleted_by: '',
      deleted_at: null,
      flag: 1
    }
  },
  getters: {
    getAll(state) {
      return FBStore.collection(collection).get().then(qss => {
        qss.forEach(doc => {
          const item = doc.data()
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
    getFilter: state => pagination => {
      return state.items.filterValue(pagination.find)
    }
  },
  mutations: {
    [SET_ITEMS](state, items) {
      state.items = items
    },
    [SET_ITEM](state, item) {
      state.item = item ? { ...item } : { ...state.default }
    },
    [PUSH_ITEMS](state, item) {
      state.items.push(item)
    },
    [UPDATE_ITEMS](state, item) {
      const index = state.items.findIndex(x => x.id === item.id)
      state.items.splice(index, 1, item)
    },
    [REMOVE_ITEMS](state, item) {
      const index = state.items.findIndex(x => x.id === item.id)
      if (index >= 0) state.items.splice(index, 1)
    }
  },
  actions: {
    init({ state }) {
      docChanges({
        items: state.items,
        collections: FBStore.collection(collection).orderBy('orders', 'desc')
        // .startAfter((page - 1) * rowsPerPage)
        // .limit(rowsPerPage)
      })
    },
    // select({ commit, state }) {
    //   return FBStore.collection(collection).get().then(function(paginationSnapshot) {
    //     const items = []
    //     paginationSnapshot.forEach(function(doc) {
    //       // doc.data() is never undefined for pagination doc snapshots
    //       // console.log(doc.id, ' => ', doc.data())
    //       const item = state.default
    //       item = doc.data()
    //       item.id = doc.id
    //       items.push(item)
    //     })
    //     commit(SET_ITEMS, items)
    //   }).catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    // },
    pagination({ commit, state }, { search, pagination }) {
      const items = []
      const obj = {
        search: [],
        orderBy: [],
        limit: 5
      }
      if (search) {
        obj.search.push('name', '>=', search)
        obj.search.push('name', '<=', search)
        // cll = cll.where('name', '==', 'lang 0')
      }
      if (pagination.sortBy) {
        obj.orderBy.push('name', pagination.descending ? 'desc' : 'asc')
        // cll = cll.orderBy('name', pagination.descending ? 'desc' : 'asc')
      }
      if (pagination.rowsPerPage) {
        obj.limit = 5
        // cll = cll.limit(5)
      }
      console.log(obj)
      if (obj.search.length > 0)
        state.cll
          .where(obj.search[0], obj.search[1], obj.search[2])
          .orderBy(obj.orderBy[0], obj.orderBy[1])
          .limit(obj.limit)
          .get().then(pagination => {
            pagination.forEach(function (doc) {
              let item = state.default
              item = doc.data()
              item.id = doc.id
              items.push(item)
            })
          })
      else
        state.cll
          .orderBy(obj.orderBy[0], obj.orderBy[1])
          .limit(obj.limit)
          .get().then(pagination => {
            pagination.forEach(function (doc) {
              let item = state.default
              item = doc.data()
              item.id = doc.id
              items.push(item)
            })
          })
      commit(SET_ITEMS, items)
    },
    select({ commit, state, rootGetters, rootState }, loading = false) {
      // Loading
      if (loading) rootState.$loading = true
      // http
      const first = FBStore.collection(collection).orderBy('created_at', 'asc')
      const x = first.get()
        .then(docs => {
          const items = []
          docs.forEach(function (doc) {
            // console.log(doc.id, ' => ', doc.data())
            let item = state.default
            item = doc.data()
            item.id = doc.id
            items.push(item)
          })
          commit(SET_ITEMS, items)
        })
        .catch((error) => { commit(SET_CATCH, error, { root: true }) })
        .finally(() => {
          state.isGetFirst = false
          if (loading) rootState.$loading = false
        })
    },
    async insert({ commit, state, rootGetters, rootState }, loading = false) {
      // Loading
      if (loading) rootState.$loading = true
      // http
      // item.created = { by: 'Admin', at: new Date() }
      // items.push(state.item)
      // for (let index = 0; index < 1000; index++) {
      state.item.created_by = rootState.$user.username
      state.item.created_at = timestamp
      return FBStore.collection(collection).add(state.item).then(doc => {
        state.item.id = doc.id
        commit(PUSH_ITEMS, state.item)
        commit(SET_MESSAGE, { text: rootGetters.languages('success.add'), color: 'success' }, { root: true })
      }).catch(error => {
        commit(SET_CATCH, error, { root: true })
      }).finally(() => {
        commit(SET_ITEM, state.default)
        if (loading) rootState.$loading = false
      })
      // }
    },
    update({ commit, state, rootGetters, rootState }, loading = false) {
      // Loading
      if (loading) rootState.$loading = true
      // http
      state.item.updated_by = rootState.$user.username
      state.item.updated_at = timestamp
      let _item = { ...state.item }
      delete _item.id
      FBStore.collection(collection).doc(state.item.id).set(_item).then(doc => {
        commit(UPDATE_ITEMS, state.item)
        commit(SET_MESSAGE, { text: rootGetters.languages('success.update'), color: 'success' }, { root: true })
      }).catch(error => {
        commit(SET_CATCH, error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loading = false
      })
    },
    delete({ commit, state, rootGetters, rootState }, loading = false) {
      //const item = Object.assign({}, state.item)
      state.item.deleted_by = rootState.$user.username
      state.item.deleted_at = timestamp
      state.item.flag === 1 ? 0 : 1
      FBStore.collection(collection).doc(state.item.id).update({ flag: state.item.flag }).then(doc => {
        commit(UPDATE_ITEMS, state.item)
        commit(SET_MESSAGE, { text: rootGetters.languages('success.delete'), color: 'success' }, { root: true })
      }).catch(error => {
        commit(SET_CATCH, error, { root: true })
      }).finally(() => {
        commit(SET_ITEM, state.default)
        if (loading) rootState.$loading = false
      })
    },
    remove({ commit, state, rootGetters, rootState }, loading = false) {
      //const item = Object.assign({}, state.item)
      FBStore.collection(collection).doc(state.item.id).delete().then(doc => {
        commit(REMOVE_ITEMS, state.item)
        commit(SET_MESSAGE, { text: rootGetters.languages('success.delete'), color: 'success' }, { root: true })
      })
        .catch(error => {
          commit(SET_CATCH, error, { root: true })
        }).finally(() => {
          commit(SET_ITEM, state.default)
          if (loading) rootState.$loading = false
        })
    },
    exist_code({ commit, state, rootGetters, rootState }, loading = false) {
      // const item = Object.assign({}, state.item)
      // return FBStore.collection(collection).where('code', '==', item.code).get()
      //   .then(snap => {
      //     return snap.docs.length > 0 ? true : false
      //   }).catch(error => {
      //     commit(SET_CATCH, error, { root: true })
      //   }).finally(() => {
      //     if (loading) rootState.$loading = false
      //   })
      const promise = new Promise(function (resolve, reject) {
        resolve(state.items.findIndex(x => x.code.toLowerCase() === state.item.code.toLowerCase()) < 0 ? false : true)
        reject(Error('Error'))
      })
      console.log(storageAuth.GetUid())
      return promise.catch(error => {
        commit(SET_CATCH, error, { root: true })
      }).finally(() => {
        if (loading) rootState.$loading = false
      })
    },
    item({ commit }, item) {
      commit(SET_ITEM, item)
    }
  }
}
