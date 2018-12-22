import { signIn, getUserById } from '../../services/api'
import auth from '../../services/auth'
import router from '../../router'

export default {
  state: {
    user: {}
  },
  getters: {
    user: state => state.user
  },
  mutations: {
    SET_USER (state, user) {
      state.user = user
    }
  },
  actions: {
    /**
     * Sign in
     * @param {string} email - user email
     * @param {string} password - user password
     * @param {object} vm - vue instance
     */
    async signIn ({ commit }, payload) {
      try {
        const res = await signIn({
          email: payload.email,
          password: payload.password
        })
        auth.setLocalStorage(res.data)
        router.push('/')
      } catch (err) {
        payload.vm.$notify.error({
          title: 'Error',
          message: 'Invalid Login or password'
        })
      }
    },
    /**
     * Fetch user by id and commit to state
     * @param {string} id - user id
     */
    async getUserById ({ commit }, payload) {
      if (payload.id) {
        const id = payload.id
        try {
          const res = await getUserById({ id })
          commit('SET_USER', res.data.data)
        } catch (err) {}
      } else {
        console.warn('Parameter `id` is required')
      }
    }
  }
}
