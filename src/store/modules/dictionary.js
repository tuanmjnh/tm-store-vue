import { FBStore, timestamp, docChanges } from '@/plugins/firebaseInit';
const collection = 'dictionary';
export default {
  namespaced: true,
  state: {
    items: [],
    item: {
      code: 'vi-VN',
      value: {}
    },
    selected: [],
    dialog: false,
    isGetFirst: true,
    default: {
      value: {}
    }
  },
  getters: {
    getAll(state) {
      return FBStore.collection(collection)
        .get()
        .then(qss => {
          qss.forEach(doc => {
            const item = doc.data();
            item.id = doc.id;
            state.items.push(item);
          });
        });
    },
    getAllId(state) {
      return state.items;
    },
    getById: state => id => {
      return state.items.find(x => x.id === id);
    },
    getByFlag: state => flag => {
      return state.items.filter(x => x.flag === flag);
    },
    getFilter: state => pagination => {
      let items = state.items;
      if (pagination.flag >= 0) {
        items = items.filter(function(row) {
          return row['flag'] == pagination.flag;
        });
      }
      if (pagination.search) {
        items = items.filter(function(row) {
          return Object.keys(row).some(function(key) {
            return (
              String(row[key])
                .toLowerCase()
                .indexOf(pagination.search) > -1
            );
          });
        });
      }
      return items;
    }
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items;
    },
    SET_ITEM(state, item) {
      if (item) state.item = { ...item };
      else state.item.value = {};
    },
    PUSH_ITEMS(state, item) {
      state.items.push(item);
    },
    UPDATE_ITEMS(state, item) {
      state.items.update(item, 'id');
    },
    REMOVE_ITEMS(state, item) {
      state.items.remove(item, 'id');
    },
    SET_VALUES(state, values) {
      state.values = { ...values };
    }
  },
  actions: {
    init({ state }) {
      docChanges({
        items: state.items,
        collections: FBStore.collection(collection).orderBy('code', 'asc')
        // .startAfter((page - 1) * rowsPerPage)
        // .limit(rowsPerPage)
      });
    },
    select({ commit, state }) {
      const first = FBStore.collection(collection).orderBy('created_at', 'asc');
      const x = first.get().then(pagination => {
        const items = [];
        pagination.forEach(function(doc) {
          let item = state.default;
          item = doc.data();
          item.id = doc.id;
          items.push(item);
        });
        commit('SET_ITEMS', items);
      });
    },
    async insert({ commit, state }) {
      const item = Object.assign({}, state.item);
      item.created_by = 'Admin';
      item.created_at = timestamp;
      return FBStore.collection(collection)
        .add(state.item)
        .then(docRef => {
          item.id = docRef.id;
          commit('PUSH_ITEMS', item);
          commit(
            'SET_MESSAGE',
            { text: 'Cập nhật thành công', color: 'success' },
            { root: true }
          );
        })
        .then(() => {
          commit('SET_ITEM', state.default);
        })
        .catch(error => {
          commit('SET_CATCH', error, { root: true });
        });
    },
    update({ commit, state }) {
      const item = Object.assign({}, state.item);
      item.updated_by = 'Admin';
      item.updated_at = timestamp;
      FBStore.collection(collection)
        .doc(item.id)
        .set(item)
        .then(docRef => {
          commit('UPDATE_ITEMS', item);
          commit(
            'SET_MESSAGE',
            { text: 'Cập nhật thành công', color: 'success' },
            { root: true }
          );
        })
        .catch(error => {
          commit('SET_CATCH', error, { root: true });
        });
    },
    delete({ commit, state }) {
      const item = Object.assign({}, state.item);
      item.deleted_by = 'Admin';
      item.deleted_at = timestamp;
      FBStore.collection(collection)
        .doc(item.id)
        .update({ flag: item.flag === 1 ? 0 : 1 })
        .then(docRef => {
          item.flag = item.flag === 1 ? 0 : 1;
          commit('UPDATE_ITEMS', item);
          commit(
            'SET_MESSAGE',
            { text: 'Xóa bản ghi thành công!', color: 'success' },
            { root: true }
          );
        })
        .then(() => {
          commit('SET_ITEM', state.default);
        })
        .catch(error => {
          commit('SET_CATCH', error, { root: true });
        });
    },
    remove({ commit, state }) {
      const item = Object.assign({}, state.item);
      FBStore.collection(collection)
        .doc(item.id)
        .delete()
        .then(docRef => {
          commit('REMOVE_ITEMS', item);
          commit(
            'SET_MESSAGE',
            { text: 'Xóa hoàn toàn bản ghi thành công!', color: 'success' },
            { root: true }
          );
        })
        .then(() => {
          commit('SET_ITEM', state.default);
        })
        .catch(error => {
          commit('SET_CATCH', error, { root: true });
        });
    }
  }
};
