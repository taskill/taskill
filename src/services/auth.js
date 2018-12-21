export default {
  /**
   * Set user data to localstorage
   * @param {object} data - User data
   */
  setLocalStorage (data) {
    window.localStorage.setItem('user', JSON.stringify(data))
  },
  /**
   * Clear data localstorage
   */
  destroyLocalStorage () {
    window.localStorage.removeItem('user')
  },
  /**
   * Get user data from localstorage
   */
  getUser () {
    const data = JSON.parse(window.localStorage.getItem('user'))
    return data.data
  },
  /**
   * Check if user is authorized
   */
  isAuth () {
    const data = JSON.parse(window.localStorage.getItem('user'))
    return !!data
  }
}
