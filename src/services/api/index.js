import http from './config'

export const signIn = body => {
  let url = '/users/signin'
  return http.post(url, body)
}

export const getUserById = params => {
  let id = params.id
  let url = `/users/${id}`
  return http.get(url)
}
