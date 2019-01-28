<template>
  <div class="side-menu-wrapper">
    <transition name="slide-to-left">
      <div
        v-if="show"
        class="side-menu"
      >
        <div class="side-menu__body">
          <div
            class="side-menu__close"
            @click="$emit('close')"
          >
            <svg-icon name="arrow-left" />
          </div>
          <side-nav>
            <side-nav-group name="Create a new">
              <side-nav-item
                v-for="i in navigation.sideMenu"
                :key="i.name"
                :name="i.name"
                :icon="true"
                :icon-name="i.icon"
                :to="i.path"
                @click="$emit('close')"
              />
            </side-nav-group>
          </side-nav>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="show"
        class="overlay"
        @click="$emit('close')"
      />
    </transition>
  </div>
</template>

<script>
import navigation from '@/navigation'
import { SvgIcon, SideNav, SideNavItem, SideNavGroup } from '@/components/ui'

export default {
  name: 'SideMenu',

  components: {
    SideNav,
    SideNavItem,
    SideNavGroup,
    SvgIcon
  },

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      navigation
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
