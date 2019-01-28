<template>
  <div class="project-create">
    <el-form
      class="form-900"
      label-width="120px"
    >
      <el-form-item label="Title">
        <el-input
          v-model="project.title"
          @input="toSlug"
        />
      </el-form-item>
      <el-form-item label="Key">
        <el-input v-model="keyUpper" />
      </el-form-item>
      <el-form-item label="Path">
        <el-input
          v-model="project.slug"
          :readonly="true"
        >
          <!-- TODO: add path (origin) + username -->
          <template slot="prepend">
            path
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="Summary">
        <el-input
          v-model="project.summary"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="Description">
        <quill v-model="project.description" />
      </el-form-item>
      <el-form-item label="Color in sidebar">
        <div class="random-color">
          <el-color-picker v-model="project.favoriteColor" />
          <el-button
            type="text"
            @click="randomColor"
          >
            random color
          </el-button>
        </div>
      </el-form-item>
      <el-form-item class="text-right">
        <el-button @click="$router.go(-1)">
          Cancel
        </el-button>
        <el-button
          type="success"
          @click="createProject"
        >
          Create project
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Form, FormItem, Input, ColorPicker, Button } from 'element-ui'
import { Quill } from '@/components/ui'
import { sluggify } from '@/helpers/utils'
import randomcolor from 'randomcolor'

export default {
  name: 'ProjectCreate',

  components: {
    ElForm: Form,
    ElFormItem: FormItem,
    ElInput: Input,
    ElColorPicker: ColorPicker,
    ElButton: Button,
    Quill
  },

  data () {
    return {
      project: {
        title: '',
        key: '',
        slug: '',
        summary: '',
        description: '',
        favoriteColor: ''
      }
    }
  },

  computed: {
    keyUpper: {
      get () {
        return this.project.key
      },
      set (v) {
        this.project.key = v.toUpperCase()
      }
    }
  },

  watch: {
    name (v) {
      if (!v) this.project.slug = ''
    }
  },

  created () {
    this.randomColor()
  },

  methods: {
    async createProject () {
      const body = { ...this.project }

      await this.$store.dispatch('createProject', { body, vm: this })
      this.$router.push('/projects')
    },
    randomColor () {
      this.project.favoriteColor = randomcolor()
    },
    toSlug () {
      if (this.project.title) this.project.slug = sluggify(this.project.title)
    }
  }
}
</script>

<style lang="scss">
.random-color {
  display: flex;
  font-size: 12px;
  color: $color-grey-3;
  button {
    margin-left: 5px;
    color: $color-grey-2;
  }
}
</style>
