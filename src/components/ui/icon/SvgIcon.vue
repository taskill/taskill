<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
    v-html="icon"
  ></svg>
</template>

<script>
import icons from './icons.js'

export default {
  name: 'SvgIcon',

  props: {
    name: String,
    width: {
      type: [String, Number],
      default: 24
    },
    height: {
      type: [String, Number],
      default: 24
    }
  },

  computed: {
    icon () {
      if (icons[this.name]) {
        return icons[this.name]
      } else {
        console.error('Name of icon is not correct')
        return undefined
      }
    }
  }
}
</script>

<style lang="scss">
</style>
