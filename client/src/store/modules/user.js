import { signIn, signUp, getUserById } from '../../services/api'
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
     * Sign up and if success sign in
     * @param {string} name - name
     * @param {string} username - username
     * @param {string} email - user email
     * @param {string} password - user password
     * @param {object} vm - vue instance
     */
    async signUp ({ dispatch }, payload) {
      try {
        await signUp({
          name: payload.name,
          username: payload.username,
          email: payload.email,
          password: payload.password
        })
        payload.vm.$notify.success({
          title: 'Success',
          message: 'Congratulations with the registration'
        })
        dispatch('signIn', { email: payload.email, password: payload.password })
      } catch (err) {
        console.warn(err)
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
        throw new Error('Parameter `id` is required')
      }
    }
  }
}
