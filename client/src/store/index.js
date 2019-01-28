import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import project from './modules/project'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    project
  }
})
