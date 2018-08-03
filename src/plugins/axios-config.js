import axios from 'axios'
var host = 'http://localhost:8000/'
// var host = 'http://mle.dominet.com.vn/'
// var host = 'http://localhost/mle/'
var api = 'api/'
const mle = axios.create({
  host: host,
  api: api,
  baseURL: host + api,
  // timeout: 1000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('user-token') || ''}`,
    Author: localStorage.getItem('user-auth') || '',
    Remember: true
  }
})

// another api service
// const amazonApi = axios.create({
//   baseURL: 'https://amazon-domain.com/api/',
//   timeout: 2000,
//   headers: {
//     'X-Custom-Header': 'CustomHeader2'
//   }
// });

export { mle }
