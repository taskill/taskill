<template>
  <div class="default-theme">
    <AppSidebar />
    <AppMain />
  </div>
</template>

<script>
import AppSidebar from './parts/Sidebar'
import AppMain from './parts/Main'

export default {
  components: {
    AppSidebar,
    AppMain
  }
}

</script>

<style lang="scss">
.default-theme {
  display: grid;
  grid-template-columns: $sidebar-width 1fr;
  height: 100vh;
}
</style>
