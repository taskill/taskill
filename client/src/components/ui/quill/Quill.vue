<template>
  <div :id="id" />
</template>

<script>
import Quill from 'quill'
import hljs from 'highlight.js'
import 'quill/dist/quill.snow.css'
import 'highlight.js/styles/tomorrow-night-eighties.css'

export default {
  name: 'Quill',

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    options: {
      type: Object,
      default: () => {}
    },
    value: {
      type: String,
      default: undefined
    }
  },

  data () {
    return {
      id: `editor-${this._uid}`,
      quill: {},
      htmlContent: ''
    }
  },

  watch: {
    /**
     * Update content
     */
    value (newVal, oldVal) {
      if (newVal && newVal !== this.htmlContent) {
        this.htmlContent = newVal
        this.quill.clipboard.dangerouslyPasteHTML(newVal)
        this.quill.blur()
      } else if (!newVal) {
        this.quill.setText('')
      }
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    /**
     * Init quill
     */
    init () {
      const icons = Quill.import('ui/icons')
      icons['code'] = '<i class="icon-code" aria-hidden="true"></i>'

      const defaultOptions = {
        modules: {
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          },
          toolbar: [
            [{ header: [3, false] }],
            ['bold', 'italic', 'underline'],
            ['blockquote', 'code', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link']
          ]
        },
        theme: 'snow'
      }
      const options = Object.assign(defaultOptions, this.options)

      var fontSizeStyle = Quill.import('attributors/style/size')
      fontSizeStyle.whitelist = ['24px']
      Quill.register(fontSizeStyle, true)

      this.quill = new Quill(`#${this.id}`, options)

      this.quill.on('editor-change', () => {
        this.htmlContent = document.querySelector(
          `#${this.id} .ql-editor`
        ).innerHTML
        this.$emit('input', this.htmlContent)
      })

      // Set initial content
      if (this.value) {
        this.quill.clipboard.dangerouslyPasteHTML(this.value)
        this.quill.blur()
      }
    }
  }
}
</script>
<style lang="scss">
.ql-container {
  &.ql-snow {
    border-color: #d8dce5;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}

.ql-toolbar {
  &.ql-snow {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-color: #d8dce5;
    padding: 2px;
  }
}
.ql-size-24 {
  font-size: 24px;
}

.ql-editor {
  height: 200px;
  font-size: 14px;
}

.el-form {
  .ql-picker-label {
    &:before {
      position: relative;
      top: -6px;
    }
  }
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  font-size: 1.5em !important;
  content: 'Heading';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: 'Heading';
}

.ql-snow .ql-editor h3 {
  font-size: 1.5em;
}
.ql-syntax {
  background-color: #273238;
  padding: 10px;
  border-radius: 3px;
  color: #f8f8f2;
}

.ql-snow .ql-editor pre.ql-syntax {
  background-color: #273238;
}

.ql-snow .ql-tooltip {
  z-index: 10;
}
</style>
