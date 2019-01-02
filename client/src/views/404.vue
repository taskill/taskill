<template>
  <div class="wrap">
    <div class="error error--404">
      <div class="error__emoji">{{ random }}</div>
      <div class="error__text">Page not found</div>
      <br>Don't worry its ok, just go
      <router-link to="/">home</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      emoji: ['\\(o_o)/', '(·_·)', '(^-^*)', '(≥o≤)', '(;-;)', 'ʕ•ᴥ•ʔ', 'ಥ﹏ಥ']
    }
  },

  computed: {
    random () {
      let rnd = Math.floor(Math.random() * this.emoji.length)
      return this.emoji[rnd]
    }
  }
}
</script>
<style lang="scss">
.wrap {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
}

.error {
  &--404 {
    text-align: center;
  }
  &__emoji {
    font-family: $font-mono;
    font-size: 120px;
    margin-bottom: 15px;
  }
  &__text {
    font-weight: 300;
  }
}
</style>
