<template>
  <div class="main">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'Main',

  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
.main {
  padding: 20px 30px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow-y: auto;
}
</style>
