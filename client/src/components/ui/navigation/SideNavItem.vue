<template>
  <router-link
    class="side-nav__item"
    :to="to"
  >
    <span
      class="side-nav__item-inner"
      @click="$emit('click')"
    >
      <svg-icon
        v-if="icon"
        :name="iconName"
      />
      {{ name }}
    </span>
  </router-link>
</template>

<script>
import SvgIcon from '@/components/ui/icon/SvgIcon'

export default {
  name: 'SideNavItem',

  components: {
    SvgIcon
  },

  props: {
    icon: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: undefined
    },
    to: {
      type: String,
      default: undefined
    },
    iconName: {
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
.side-nav__item {
  display: block;
  text-decoration: none;
  &.active {
    background-color: $color-grey-light;
    &:hover {
      background-color: $color-grey;
    }
  }
  &:hover {
    background-color: $color-grey-light;
  }
  &-inner {
    list-style: none;
    display: flex;
    align-items: center;
    color: #000;
    font-weight: 500;
    padding: 5px 20px;
    line-height: 30px;
  }

  svg {
    width: 18px;
    margin-right: 10px;
    fill: $color-grey-3;
  }
}
</style>
