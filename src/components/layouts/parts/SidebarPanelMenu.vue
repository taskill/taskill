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
    }
  }
}
</script>

<style lang="scss">
.side-menu {
  width: $sidebar-width;
  display: flex;
  position: fixed;
  overflow-y: scroll;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 1000;
  align-items: center;
  &__body {
    display: flex;
    align-items: center;
    width: 100%;
  }
  &__close {
    margin: 0 10px 0 30px;
    width: 35px;
    height: 35px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    &:hover {
      background-color: $color-grey;
      svg {
        fill: #000;
      }
    }
    svg {
      fill: $color-grey-3;
    }
  }
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
