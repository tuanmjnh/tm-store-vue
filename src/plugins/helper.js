import * as moment from 'moment'
export function convertObject(data, ignore = 'id', removeNull = true) {
  var obj = {}
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
}
export function objToQuery(obj) {
  var rs = ''
  Object.keys(obj).forEach(function(key, index) {
    if (typeof obj[key] === 'object') {
      if (obj[key].name) rs += `${obj[key].name}=${obj[key].value}&`
    } else {
      if (obj[key].toString().length > 0) rs += `${key}=${obj[key]}&`
    }
  })
  return rs.substr(0, rs.length - 1)
}
export function objToFormData(obj, formData) {
  if (!formData) formData = new FormData()
  Object.keys(obj).forEach(function(key, index) {
    formData.append(key, obj[key])
  })
  return formData
}
export function attachToImg(obj, charlist, api) {
  var rs = []
  if (obj) {
    obj = obj
      .replace(new RegExp('^[' + charlist + ']+'), '')
      .replace(new RegExp('[' + charlist + ']+$'), '')
    obj.split(',').forEach(element => {
      rs.push({
        id: '',
        name: element,
        url: element
      })
    })
  }
  return rs
}
export function objToImg(obj, api) {
  var _data = []
  obj.forEach(element => {
    _data.push({
      id: '',
      name: element.name,
      url: element.url
    })
  })
  return _data
}
export function newDate(format = 'DD/MM/YYYY hh:mm:ss') {
  if (format === 'full') return moment().format()
  if (format === 'datetime') return moment().format('DD/MM/YYYY hh:mm:ss')
  if (format === 'date') return moment().format('DD/MM/YYYY')
  if (format === 'time') return moment().format('hh:mm:ss')
  else return moment().format(format)
}
// Check type files
export function isImage(filename) {
  return /\.(gif|jpg|jpeg|tiff|png)$/i.test(filename)
}
// utils to delay promise
export function wait(ms) {
  return x => {
    return new Promise(resolve => setTimeout(() => resolve(x), ms))
  }
}
// Trim
export function trimLeft(str, charlist) {
  if (charlist === undefined) charlist = ' '
  return str.replace(new RegExp('^[' + charlist + ']+'), '')
}
export function trimRight(str, charlist) {
  if (charlist === undefined) charlist = ' '
  return str.replace(new RegExp('[' + charlist + ']+$'), '')
}

export function trim(str, charlist) {
  return str
    .replace(new RegExp('^[' + charlist + ']+'), '')
    .replace(new RegExp('[' + charlist + ']+$'), '')
}
