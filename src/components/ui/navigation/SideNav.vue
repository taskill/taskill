<template>
  <nav class="side-nav">
    <slot></slot>
  </nav>
</template>

<script>
export default {
  name: 'SidebarNav',

  props: {
    nav: Array,
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
