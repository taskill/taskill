<template>
  <div class="side-menu-wrapper">
    <transition name="slide-to-left">
      <div class="side-menu" v-if="show">
        <div class="side-menu__body"></div>
      </div>
    </transition>
    <transition name="fade">
      <div class="overlay" v-if="show" @click="$emit('close')"></div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SideMenu',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'left'
    }
  },

  data () {
    return {

    }
  },

  computed: {
    setPosition () {
      let position

      if (this.position === 'left') position = 'left: 0'
      if (this.position === 'right') position = 'right: 0'

      return position
    }

  }
}
</script>

<style lang="scss">
.side-menu {
  width: $sidebar-width;
  position: fixed;
  overflow-y: scroll;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 1000;
}
.overlay {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
