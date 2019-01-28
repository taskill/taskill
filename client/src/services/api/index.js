import http from './config'
import { queryToUrl } from '../../utils'

// User
export const signIn = body => {
  let url = '/users/signin'
  return http.post(url, body)
}

export const signUp = body => {
  let url = '/users/signup'
  return http.post(url, body)
}

export const getUserById = params => {
  let id = params.id
  let url = `/users/${id}`
  return http.get(url)
}
// Project
/**
 * Список проектов
 */
export const getProjects = query => {
  let url = '/projects'
  if (query) url = queryToUrl(url, query)
  return http.get(url)
}
/**
 * Список избранных проектов
 */
export const getFavoriteProjects = query => {
  let url = '/projects/favorite'
  if (query) url = queryToUrl(url, query)
  return http.get(url)
}
/**
 * Создание проекта
 */
export const createProject = body => {
  let url = '/projects'
  return http.post(url, body)
}
/**
 * Обновление проекта
 */
export const updateProjectById = (params, body) => {
  let projectId = params.id
  let url = `/projects/${projectId}`
  return http.put(url, body)
}

/**
 * Переключение проекта в избранное
 */
export const toggleProjectFavorite = (params, body) => {
  let projectId = params.id
  let url = `/projects/${projectId}/favorite`
  return http.post(url, body)
}
