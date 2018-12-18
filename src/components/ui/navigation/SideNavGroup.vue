<template>
  <div class="side-nav-group">
    <div class="side-nav-group__name">{{ name }}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SideNavGroup',

  props: {
    name: String
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
.side-nav-group {
  color: $color-grey-3;
  &__name {
    margin-bottom: 10px;
    padding: 0 20px;
    font-weight: 300;
    font-size: 13px;
  }
}
</style>
