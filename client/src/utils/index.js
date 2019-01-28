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
/**
 * Convert a string to a slug
 * @param {string} string - string
 * @returns {string} sluggified string
 */
export const sluggify = (s) => {
  return s
    .toLowerCase()
    .trim()
    .replace(/:.*:/g, '')
    .replace(/ +$/g, '')
    .replace(/(&amp;| & )/g, '-and-')
    .replace(/&(.+?);/g, '')
    .replace(/[\s\W-]+/g, '-')
}
/**
 * Acronym generator
 * @param {string} string - string to acronym
 * @param {number} maxLetter - max letter acronym
 */
