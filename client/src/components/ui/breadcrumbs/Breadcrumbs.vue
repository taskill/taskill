<template>
  <div class="breadcrumbs">
    <router-link
      v-for="i in breadcrumbs"
      :key="i.name"
      :to="i.link"
    >
      {{ i.name }}
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumbs',

  computed: {
    breadcrumbs () {
      return this.$route.meta.breadcrumbs || []
    }
  }
}
</script>

<style lang="scss">
.breadcrumbs {
  margin-bottom: 10px;
  a {
    font-size: 12px;
    color: $color-grey-2;
    &:last-of-type {
      &::after {
        content: '';
      }
    }
    &::after {
      content: "/"
    }
  }
}
</style>
