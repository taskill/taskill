<template>
  <nav class="side-nav">
    <slot />
  </nav>
</template>

<script>
export default {
  name: 'SidebarNav',

  props: {
    nav: {
      type: Array,
      default: () => []
    },
    icon: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
.side-nav {
  width: 100%;
}
</style>
