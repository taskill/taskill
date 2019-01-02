import axios from 'axios'

const http = axios.create({
  baseURL: process.env.VUE_APP_SERVER_API,
  withCredentials: true,
  headers: {
    Accept: 'application/json'
  }
})

http.interceptors.request.use(
  request => {
    const user = JSON.parse(window.localStorage.getItem('user'))

    if (user !== null) {
      request.headers.Authorization = user.token
    }

    return request
  },
  error => {
    console.error('[DEV Response]', error.response)
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  response => {
    if (process.env.NODE_ENV === 'development') {
      if (!response.data.success) {
        console.error('[DEV Response]', response.data)
      } else {
        console.log('[DEV Response]', response.data)
      }
    }

    return response
  },
  error => {
    console.error('[DEV Response]', error.response)
    return Promise.reject(error)
  }
)

export default http
