<template>
  <div class="top-bar">
    <div class="top-bar__header">
      <div class="top-bar__header-col-1">
        <div class="top-bar__title">
          {{ $route.meta.title }}
        </div>
      </div>
      <div class="top-bar__header-col-2 text-right">
        <el-tooltip
          effect="dark"
          :content="settingsTooltip"
          placement="bottom-end"
          :open-delay="700"
        >
          <router-link
            v-if="settings"
            :to="settingsPath"
          >
            <svg-icon name="cog" />
          </router-link>
        </el-tooltip>
      </div>
      <div class="top-bar__breadcrumbs">
        <breadcrumbs />
      </div>
      <div class="top-bar__description">
        {{ $route.meta.description }}
      </div>
    </div>
    <div
      v-if="$slots.middle"
      class="top-bar__middle"
    >
      <slot name="middle" />
    </div>
    <div class="top-bar__bottom">
      <div class="top-bar__bottom-col-1">
        <slot name="bottom-left" />
      </div>
      <div class="top-bar__bottom-col-2 text-right">
        <slot name="bottom-right" />
      </div>
    </div>
  </div>
</template>

<script>
import { SvgIcon, Breadcrumbs } from '@/components/ui'
import { Tooltip } from 'element-ui'

export default {
  name: 'TopBar',

  components: {
    Breadcrumbs,
    SvgIcon,
    ElTooltip: Tooltip
  },

  props: {
    settings: {
      type: Boolean,
      default: false
    },
    settingsPath: {
      type: String,
      default: ''
    },
    settingsTooltip: {
      type: String,
      default: ''
    }
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
.top-bar {
  margin-bottom: 30px;
  &__header {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin-bottom: 20px;
    &-col-1, &-col-2 {
      flex-grow: 1;
    }
  }
  &__middle {
    margin: 20px 0;
  }
  &__bottom {
    display: flex;
    align-items: center;
    &-col-1, &-col-2 {
      flex-grow: 1;
    }
  }
  &__title {
    font-size: 24px;
  }
  &__description {
    color: $color-text;
  }
  &__description, &__breadcrumbs {
    width: 100%;
    flex-grow: 1
  }
}
</style>
