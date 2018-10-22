import Vue from 'vue'
import { FormatDate, PathToFileName } from './helpers'
const urlParser = document.createElement('a')

export function domain(url) {
  urlParser.href = url
  return urlParser.hostname
}
export function count(arr) {
  return arr.length
}
export function prettyDate(date) {
  var a = new Date(date)
  return a.toDateString()
}
export function pluralize(time, label) {
  if (time === 1) return time + label
  return time + label + 's'
}
export function capitalize(val) {
  if (!val) return ''
  val = val.toString()
  return val.charAt(0).toUpperCase() + val.slice(1)
}
// Import Install and register helper items
Vue.filter('count', count)
Vue.filter('domain', domain)
Vue.filter('prettyDate', prettyDate)
Vue.filter('pluralize', pluralize)
Vue.filter('capitalize', capitalize)
Vue.filter('formatDate', FormatDate)
Vue.filter('pathToFileName', PathToFileName)