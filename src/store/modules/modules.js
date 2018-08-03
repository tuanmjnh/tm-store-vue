import * as types from '../mutation-type'
var modulesData = [{
    id: 'class',
    name: 'Quản lý lớp học',
    view: false,
    update: false,
    delete: false,
    order: 1
  },
  {
    id: 'lesson',
    name: 'Quản lý bài học',
    view: false,
    update: false,
    delete: false,
    order: 2
  },
  {
    id: 'exercises',
    name: 'Quản lý bài tập',
    view: false,
    update: false,
    delete: false,
    order: 3
  },
  {
    id: 'question',
    name: 'Quản lý câu hỏi',
    view: false,
    update: false,
    delete: false,
    order: 4
  },
  {
    id: 'role_staff',
    name: 'QLTK - Giảng viên',
    view: false,
    update: false,
    delete: false,
    order: 5
  },
  {
    id: 'role_monitor',
    name: 'QLTK - Giám sát',
    view: false,
    update: false,
    delete: false,
    order: 6
  },
  {
    id: 'role_student',
    name: 'QLTK - Học viên',
    view: false,
    update: false,
    delete: false,
    order: 7
  },
  {
    id: 'posts',
    name: 'Bài viết',
    view: false,
    update: false,
    delete: false,
    order: 8
  },
  {
    id: 'ads',
    name: 'Quảng cáo',
    view: false,
    update: false,
    delete: false,
    order: 9
  },
  {
    id: 'system_configuration',
    name: 'Hệ thống - Cấu hình',
    view: false,
    update: false,
    delete: false,
    order: 10
  },
  {
    id: 'system_log',
    name: 'Hệ thống - log',
    view: false,
    update: false,
    delete: false,
    order: 11
  }
]
export default {
  namespaced: true,
  state: {
    data: modulesData
  },
  getters: {
    data(state, order) {
      return state.data.slice().sort(function(a, b) {
        a = a['order']
        b = b['order']
        return (a === b ? 0 : a > b ? 1 : -1) * (order ? order : 1)
      })
    }
  },
  actions: {
    async select({ commit }, data) {
      if (data) commit(types.SET_DATA, data)
      else {
        modulesData.forEach(i => {
          i.view = false
          i.update = false
          i.delete = false
        })
        commit(types.SET_DATA, modulesData)
      }
    }
  },
  mutations: {
    [types.SET_DATA](state, data) {
      state.data = data
    }
  }
}
