import { SET_CATCH, SET_ITEMS, PUSH_ITEMS, UPDATE_ITEMS, REMOVE_ITEMS, SET_ITEM, SET_MESSAGE } from '../mutation-type'
import { FBStore, timestamp, docChanges } from '@/plugins/firebaseInit'
const collection = 'languages'
export default {
  namespaced: true,
  state: {
    items: [],
    item: {},
    selected: [],
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
      state.item = Object.assign({}, item)
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
          pagination.forEach(function(doc) {
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
          pagination.forEach(function(doc) {
            let item = state.default
            item = doc.data()
            item.id = doc.id
            items.push(item)
          })
        })
      commit(SET_ITEMS, items)
    },
    select({ commit, state }) {
      const first = FBStore.collection(collection).orderBy('created_at', 'asc')
      const x = first.get().then(pagination => {
        const items = []
        pagination.forEach(function(doc) {
          // doc.data() is never undefined for pagination doc snapshots
          // console.log(doc.id, ' => ', doc.data())
          let item = state.default
          item = doc.data()
          item.id = doc.id
          items.push(item)
        })
        commit(SET_ITEMS, items)
      })
      // first.get().then(paginationSnapshot => {
      //   // Get the last visible document
      //   const lastVisible = paginationSnapshot.docs[paginationSnapshot.docs.length - 1]
      //   // console.log('last', lastVisible);
      //   // Construct a new pagination starting at this document,
      //   // get the next 5 cities.
      //   const next = FBStore.collection(collection)
      //     .orderBy('name', 'asc')
      //     .startAfter(lastVisible)
      //     .limit(5)
      //   // console.log(next)
      //   next.get().then(pagination => {
      //     const items = []
      //     pagination.forEach(function(doc) {
      //       // doc.data() is never undefined for pagination doc snapshots
      //       // console.log(doc.id, ' => ', doc.data())
      //       const item = state.default
      //       item = doc.data()
      //       item.id = doc.id
      //       items.push(item)
      //     })
      //     console.log(items);
      //     commit(SET_ITEMS, items)
      //   })
      // }).catch(function(error) { commit(SET_CATCH, error, { root: true }) })
    },
    async insert({ commit, state }) {
      const item = Object.assign({}, state.item)
      // item.created = { by: 'Admin', at: new Date() }
      // items.push(state.item)
      // for (let index = 0; index < 1000; index++) {
      item.created_by = 'Admin'
      item.created_at = timestamp
      // item.name = 'lang ' + index
      return FBStore.collection(collection)
        .add(state.item)
        .then(docRef => {
          item.id = docRef.id
          commit(PUSH_ITEMS, item)
          commit(SET_MESSAGE, { text: 'Cập nhật thành công', color: 'success' }, { root: true })
        })
        .then(() => { commit(SET_ITEM, state.default) })
        .catch(error => { commit(SET_CATCH, error, { root: true }) })
      // }
    },
    update({ commit, state }) {
      const item = Object.assign({}, state.item)
      item.updated_by = 'Admin'
      item.updated_at = timestamp
      FBStore.collection(collection).doc(item.id).set(item)
        .then(docRef => {
          commit(UPDATE_ITEMS, item)
          commit(SET_MESSAGE, { text: 'Cập nhật thành công', color: 'success' }, { root: true })
        })
        .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    delete({ commit, state }) {
      const item = Object.assign({}, state.item)
      item.deleted_by = 'Admin'
      item.deleted_at = timestamp
      FBStore.collection(collection).doc(item.id)
        .update({ flag: item.flag === 1 ? 0 : 1 })
        .then(docRef => {
          item.flag = item.flag === 1 ? 0 : 1
          commit(UPDATE_ITEMS, item)
          commit(SET_MESSAGE, { text: 'Xóa bản ghi thành công!', color: 'success' }, { root: true })
        })
        .then(() => { commit(SET_ITEM, state.default) })
        .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    remove({ commit, state }) {
      const item = Object.assign({}, state.item)
      FBStore.collection(collection).doc(item.id).delete()
        .then(docRef => {
          commit(REMOVE_ITEMS, item)
          commit(SET_MESSAGE, { text: 'Xóa hoàn toàn bản ghi thành công!', color: 'success' }, { root: true })
        })
        .then(() => { commit(SET_ITEM, state.default) })
        .catch(error => { commit(SET_CATCH, error, { root: true }) })
    },
    item({ commit, state }, item) {
      if (item) commit(SET_ITEM, item)
      else commit(SET_ITEM, state.default)
    }
  }
}
