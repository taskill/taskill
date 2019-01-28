<template>
  <div class="side-nav-group">
    <div class="side-nav-group__name">
      {{ name }}
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SideNavGroup',

  props: {
    name: {
      type: String,
      default: undefined
    }
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
  + .side-nav-group {
     margin-top: 20px;
  }
  &__name {
    margin-bottom: 10px;
    padding: 0 20px;
    font-weight: 300;
    font-size: 13px;
  }
}
</style>
