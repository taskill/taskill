<template>
  <div class="top-bar">
    <div class="top-bar__title">
      {{ $route.meta.title }}
    </div>
    <div class="top-bar__description">
      {{ $route.meta.description }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopBar',

  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
.top-bar {
  margin-bottom: 30px;
  &__title {
    font-size: 24px;
  }
  &__description {
    color: $color-grey-2;
  }
}
</style>
