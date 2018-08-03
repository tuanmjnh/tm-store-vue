import * as axios from '@/utils/axios-config'
import * as types from '../mutation-type'
const controller = 'question/'
export default {
  namespaced: true,
  state: {
    data: [],
    dataSub: [],
    selected: {},
    default: {
      question_id: 0,
      lessonId: '1',
      question_name: '',
      question_description: '',
      question_content: '',
      question_image: '',
      file_upload: '',
      type_file_upload: '',
      question_sub: '',
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
      return state.data.find(data => data.question_id === id)
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
    async selectSub({ commit, state }, query) {
      await axios.mle
        .get(controller + `selectSub?id=${state.selected.question_id}`)
        .then(function(res) {
          if (res.status === 200) commit('SET_DATA_SUB', res.data.data)
          commit(types.SET_MESSAGE, res, { root: true })
        })
        .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) })
    },
    async insert({ commit, state }) {
      await axios.mle
        .post(controller, { question: state.selected, question_sub: state.dataSub })
        .then(function(res) {
          if (res.status === 200) {
            commit(types.PUSH_DATA, res.data.data)
            commit(types.SET_SELECTED, state.default)
            commit('SET_DATA_SUB', [])
          }
          commit(types.SET_MESSAGE, res, { root: true })
        })
        .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) })
    },
    async update({ commit, state }) {
      await axios.mle
        .put(controller + state.selected.question_id, { question: state.selected, question_sub: state.dataSub })
        .then(function(res) {
          // if (res.status === 200) data.data = res.data
          commit(types.SET_MESSAGE, res, { root: true })
        })
        .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) })
    },
    async delete({ commit, state }, data) {
      var _data = []
      data.forEach(i => { _data.push({ question_id: i.selected.question_id, status: i.status }) });
      await axios.mle
        .put(controller + this.state._action.delete, _data)
        .then(function(res) {
          if (res.status === 200) {
            data.forEach(i => { i.selected.status = i.status });
            commit(types.SET_SELECTED, state.default)
          }
          commit(types.SET_MESSAGE, res, { root: true })
        })
        .catch(function(error) { commit(types.AXIOS_CATCH, error, { root: true }) })
    },
    async dataSub({ commit, state }, data) {
      if (data) commit('SET_DATA_SUB', data)
      else commit('SET_DATA_SUB', [])
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
    SET_DATA_SUB(state, data) {
      state.dataSub = data
    },
    [types.SET_SELECTED](state, selected) {
      state.selected = selected
    },
    [types.PUSH_DATA](state, item) {
      state.data.push(item)
    }
  }
}
