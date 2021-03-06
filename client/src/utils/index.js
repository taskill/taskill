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
export const toAcronym = (string, maxLetter) => {
  const arr = string.split(' ')
  let acronym = ''

  arr.forEach((item, index) => {
    acronym += arr[index].charAt(0).toUpperCase()
  })

  return acronym.slice(0, maxLetter)
}
/**
 * Get contrast color by YIQ model
 * @param {string} hex - HEX color
 * @see https://ru.wikipedia.org/wiki/YIQ
 */
export const contrast = hex => {
  if (!hex) return console.error('HEX color is required')

  hex = hex.replace(/#/, '')

  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  return yiq >= 180 ? 'dark' : 'light'
}
/**
 * Throttle - промежуток времени в котором будет
 * вызван один раз callback
 * @param {function} cb - callback
 * @param {number} limit - промежуток времени в котором будет
 * вызван один раз callback
 */
export const throttle = (cb, limit) => {
  let wait = false
  return function () {
    if (!wait) {
      cb.call()
      wait = true
      setTimeout(function () {
        wait = false
      }, limit)
    }
  }
}
/**
 * Debounce - время ожидания после которого будет вызван callback
 * @param {function} cb - callback
 * @param {number} wait - время ожидания после которого будет вызван callback
 */
export const debounce = (cb, wait) => {
  let timeout
  return function (...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => cb.apply(context, args), wait)
  }
}
