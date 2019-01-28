import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Loading, Message, MessageBox, Notification } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import 'nprogress/nprogress.css'
import './assets/scss/style.scss'

Vue.config.productionTip = false
Vue.use(Loading.directive)
locale.use(lang)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.prototype.$ELEMENT = { size: 'small' }

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
