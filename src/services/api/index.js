import http from './config'

export const signIn = body => {
  let url = '/users/signin'
  return http.post(url, body)
}
