import Vue from 'vue'
import store from '@/store'
import * as moment from 'moment'
// define a mixin object
var mixin = {
  data: function() {
    return {
      get global() {}
    }
  },
  beforeCreate: function() {},
  created: function() {},
  watch: {},
  computed: {},
  methods: {
    wait(ms) {
      return x => {
        return new Promise(resolve => setTimeout(() => resolve(x), ms))
      }
    },
    newDate(format = 'DD/MM/YYYY hh:mm:ss') {
      if (format === 'full') return moment().format()
      if (format === 'datetime') return moment().format('DD/MM/YYYY hh:mm:ss')
      if (format === 'date') return moment().format('DD/MM/YYYY')
      if (format === 'time') return moment().format('hh:mm:ss')
      else return moment().format(format)
    },
    FormatDate(val, format = 'DD/MM/YYYY hh:mm') {
      if (!val) return ''
      if (typeof val === 'object' && val.constructor.name === 'Timestamp')
        return moment(val.toDate()).format(format)
      else
        return moment(val).format(format)
    },
    FixEditor($this) {
      $this.$refs.modalCRUD.$el.children[0].children[0].children[0].children[0].removeAttribute('tabindex')
    },
    // ShowNotify(group = 'appNotify') {
    //   this.$notify({
    //     group: group,
    //     type: store.state._message.type,
    //     text: store.state._message.text
    //   })
    // },
    FilesToString(files, chars = ',') {
      var rs = ''
      if (!files) return rs
      if (files.length < 1) return rs
      rs = chars
      files.forEach(x => {
        rs += x.url + chars
      })
      return rs
    },
    StringToFiles(str, chars = ',') {
      var rs = []
      if (!str) return rs
      this.trim(str, chars)
        .split(',')
        .forEach(x => {
          rs.push({
            url: x,
            name: this.StringToName(x),
            extension: this.getExtension(x)
          })
        })
      return rs
    },
    StringToName(str) {
      var x = str.split('/')
      x = x[x.length - 1].split('.')[0]
      return x
    },
    FilesToHtml(files, str = '') {
      files.forEach(x => {
        if (this.isImage(x.url)) str += `<p><img src='${x.url}' class='img-fluid' title='${x.name}'></p>`
        else str += `<p><a href='${x.url}'>${x.name}</a></p>`
      })
      return str
    },
    trimLeft(str, chars = ' ') {
      if (!str) return ''
      return str.replace(new RegExp('^[' + chars + ']+'), '')
    },
    trimRight(str, chars = ' ') {
      if (!str) return ''
      return str.replace(new RegExp('[' + chars + ']+$'), '')
    },
    trim(str, chars = ' ') {
      if (!str) return ''
      return this.trimRight(this.trimLeft(str, chars), chars)
    },
    isImage(str) {
      if (!str) return false
      return /\.(gif|jpg|jpeg|tiff|png)$/i.test(str.toLowerCase())
    },
    isAudio(str) {
      if (!str) return false
      return /\.(mp3|wav|wave|ogg|m4a|3ga|4mp|aa3)$/i.test(str.toLowerCase())
    },
    isVideo(str) {
      if (!str) return false
      return /\.(3g2|3gp|3gp2|3gpp|3gpp2|amv|flv|gom|mp4|mov|mpe|mpeg|mpg||kmv|mkv|wvm|wmv)$/i.test(str.toLowerCase())
    },
    getExtension(str, dot) {
      if (!str) return ''
      var re = /(?:\.([^.]+))?$/;
      return (dot ? '.' : '') + re.exec(str)[1];
    },
    ObjectToQuery(obj) {
      var rs = '?'
      if (!obj) return rs
      Object.keys(obj).forEach(function(key, index) {
        if (typeof obj[key] === 'object') {
          if (obj[key].name) rs += `${obj[key].name}=${obj[key].value}&`
        } else {
          if (obj[key].toString().length > 0) rs += `${key}=${obj[key]}&`
        }
      })
      return rs.substr(0, rs.length - 1)
    },
    ConvertObject(data, ignore = 'id', removeNull = true) {
      var obj = {}
      if (!data) return obj
      if (ignore) {
        Object.keys(data).forEach(function(key, index) {
          if (key !== ignore) {
            if (data[key]) {
              obj[key] = data[key]
            } else {
              if (!removeNull) obj[key] = null
            }
          }
        })
      } else {
        Object.keys(data).forEach(function(key, index) {
          if (data[key]) {
            obj[key] = data[key]
          } else {
            if (!removeNull) obj[key] = null
          }
        })
      }
      return obj
    },
    ObjectToFormData(obj, formData) {
      if (!formData) formData = new FormData()
      if (!obj) return formData
      Object.keys(obj).forEach(function(key, index) {
        formData.append(key, obj[key])
      })
      return formData
    }
  }
}
Vue.mixin(mixin)
export default mixin
