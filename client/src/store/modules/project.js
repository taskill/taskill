import {
  createProject,
  getProjects,
  toggleProjectFavorite,
  getFavoriteProjects
} from '../../services/api'

export default {
  state: {
    project: '',
    projects: '',
    projectsFavorite: ''
  },
  getters: {
    projects: state => state.projects,
    projectsFavorite: state => state.projectsFavorite
  },
  mutations: {
    SET_PROJECTS (state, projects) {
      state.projects = projects
    },
    SET_FAVORITE_PROJECTS (state, projects) {
      state.projectsFavorite = projects
    }
  },
  actions: {
    /**
     * Получение списка проектов
     */
    async getProjects ({ commit }, payload) {
      let query = {}

      if (payload) query = payload.query

      const res = await getProjects(query)
      commit('SET_PROJECTS', res.data.data)
    },
    /**
     * Получение списка избранных проектов
     */
    async getFavoriteProjects ({ state, commit, dispatch, rootState }) {
      const res = await getFavoriteProjects()
      commit('SET_FAVORITE_PROJECTS', res.data.data)
    },
    /**
     * Создание проекта
     */
    async createProject ({ dispatch, rootState }, payload) {
      if (!payload) return
      if (!payload.body) throw new Error('body is required')

      const body = payload.body

      try {
        const res = await createProject(body)
        // Запросить новые данные по юзеру, так как у него после добавления
        // проекта появилась новая запись в passport
        await dispatch('getUserById', { id: rootState.user.user._id }, { root: true })
        payload.vm.$notify({
          title: 'Success',
          message: 'Project successfully created',
          type: 'success'
        })
        return res
      } catch (err) {
        console.error(err)
      }
    },
    /**
     * Переключатель для избранного проекта
     */
    async toggleProjectFavorite ({ dispatch, rootState }, payload) {
      if (!payload) return
      if (!payload.id) throw new Error('id is required')

      const params = { id: payload.id }
      const body = payload.body

      try {
        await toggleProjectFavorite(params, body)
        // Запросить новые данные по юзеру
        await dispatch('getUserById', { id: rootState.user.user._id }, { root: true })
        // Запросить новый список избранных проектов
        await dispatch('getFavoriteProjects')
      } catch (err) {
        console.error(err)
      }
    }
  }
}
