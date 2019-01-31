<template>
  <div class="search">
    <el-input
      v-model="query"
      :style="{width: width + 'px'}"
      placeholder="Search"
      suffix-icon="el-icon-search"
      @input="search"
      @focus="toggleWidth(true)"
      @blur="toggleWidth(false)"
    />
  </div>
</template>

<script>
import { Input } from 'element-ui'
import { debounce } from '@/utils'

export default {
  name: 'Search',

  components: {
    ElInput: Input
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    method: {
      type: Function,
      default: () => null
    },
    debounce: {
      type: Number,
      default: 500
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },

  data () {
    return {
      query: '',
      width: 100
    }
  },

  computed: {
    search () {
      return debounce(this.method, this.debounce)
    }
  },

  watch: {
    query (v) {
      this.$emit('input', this.query)
    }
  },

  methods: {
    toggleWidth (bool) {
      if (bool) {
        this.width = 300
      } else {
        setTimeout(() => {
          this.width = 100
        }, 300)
      }
    }
  }
}
</script>

<style lang="scss">
.search {
  .el-input {
    transition: all 0.3s
  }
}
</style>
