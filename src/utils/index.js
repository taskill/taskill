import qs from 'qs'

/**
 * Generator full url with query
 * @param {string} url - url
 * @param {string} query - query
 */
export const queryToUrl = (url, query) => {
  url = url + '/?' + qs.stringify(query, { arrayFormat: 'repeat' })
  return url
}
