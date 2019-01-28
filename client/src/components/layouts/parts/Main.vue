<template>
  <div class="main">
    <top-bar />
    <router-view />
  </div>
</template>

<script>
import TopBar from './TopBar'

export default {
  name: 'Main',

  components: {
    TopBar
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
.main {
  padding: 20px 30px;
}
</style>
