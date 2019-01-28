<template>
  <ul
    v-if="!loading"
    class="favorite-projects"
  >
    <template v-if="projectsFavorite.length > 0">
      <li
        v-for="i in projectsFavorite"
        :key="i._id"
        class="favorite-projects__item"
      >
        <span
          :class="contrast(i.favoriteColor) === 'dark' ? 'acronym--dark': 'acronym--light'"
          class="acronym"
          :style="{'background-color': i.favoriteColor}"
        >
          {{ toAcronym(i.title, 2) }}
        </span>
        {{ i.title }}
      </li>
    </template>
    <span
      v-else
      class="desc"
    >
      You don't have any favorite projects yet
    </span>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
import { toAcronym, contrast } from '@/utils'

export default {
  name: 'FavoriteProjects',

  data () {
    return {
      loading: false
    }
  },

  computed: {
    ...mapGetters(['projectsFavorite'])
  },

  async created () {
    this.loading = true
    await this.$store.dispatch('getFavoriteProjects')
    this.loading = false
  },

  methods: {
    toAcronym (s, n) {
      return toAcronym(s, n)
    },
    contrast (hex) {
      return contrast(hex)
    }
  }
}
</script>

<style lang="scss">
.favorite-projects {
  margin: 0;
  padding: 0;
  &__item {
    padding: 2px 20px;
    list-style: none;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: $color-grey-light;
    }
  }
}
.acronym {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 30px;
  height: 30px;
  width: 30px;
  margin-right: 10px;
  border-radius: 3px;
  letter-spacing: 1px;
  font-size: 12px;
  font-weight: 500;
  &--light {
    color: #fff;
  }
  &--dark {
    color: $color-text;
  }
}
</style>
