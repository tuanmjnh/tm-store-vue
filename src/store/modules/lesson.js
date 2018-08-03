import * as axios from '@/utils/axios-config'
import * as types from '../mutation-type'
const controller = 'lesson/'
export default {
  namespaced: true,
  state: {
    data: [],
    selected: {},
    default: {
      lesson_id: 0,
      lesson_code: '',
      lesson_name: '',
      lesson_description: '',
      lesson_image: '',
      lesson_content: '',
      file_upload: '',
      type_file_upload: '',
      exercises: '',
      for_teacher: false,
      for_student: false,
      login_student: false,
      free: false,
      login_member: false,
      create_date: new Date(),
      create_by: '',
      last_update: new Date(),
      update_by: '',
      status: 1
    }
  },
  getters: {
    getAll(state) {
      return state.data
    },
    getById: state => id => {
      return state.data.find(data => data.lesson_id === id)
    },
    getByStatus: state => status => {
      return state.data.filter(data => data.status === status)
    }
  },
  actions: {
    async select({ commit }, query) {
      await axios.mle
        .get(controller + query)
        .then(function(res) {
          if (res.status === 200) commit(types.SET_DATA, res.data.data)
          commit(types.SET_MESSAGE, res, { root: true })
        })
        .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) })
    },
    async insert({ commit, state }, data) {
      await axios.mle
        .post(controller, data)
        .then(function(res) {
          if (res.status === 200) {
            commit(types.PUSH_DATA, res.data.data)
            commit(types.SET_SELECTED, state.default)
          }
          commit(types.SET_MESSAGE, res, { root: true })
        })
        .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) })
    },
    async update({ commit }, data) {
      await axios.mle
        .put(controller + data.lesson_id, data)
        .then(function(res) {
          if (res.status === 200) data.data = res.data
          commit(types.SET_MESSAGE, res, { root: true })
        })
        .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) })
    },
    async delete({ commit, state }, data) {
      var _data = []
      data.forEach(i => { _data.push({ lesson_id: i.selected.lesson_id, status: i.status }) });
      await axios.mle
        .put(controller + this.state._action.delete, data)
        .then(function(res) {
          if (res.status === 200) {
            data.forEach(i => { i.selected.status = i.status });
            commit(types.SET_SELECTED, state.default)
          }
          commit(types.SET_MESSAGE, res, { root: true })
        })
        .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) })
    },
    async selected({ commit, state }, data) {
      if (data) commit(types.SET_SELECTED, data)
      else commit(types.SET_SELECTED, state.default)
    },
    async updateq({ commit }, data) {
      await axios.mle
        .put(controller + this.state._action.quick_edit, data)
        .then(function(res) { commit(types.SET_MESSAGE, res, { root: true }) })
        .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) })
    }
  },
  mutations: {
    [types.SET_DATA](state, data) {
      state.data = data
    },
    [types.SET_SELECTED](state, selected) {
      state.selected = selected
    },
    [types.PUSH_DATA](state, item) {
      state.data.push(item)
    }
  }
}
