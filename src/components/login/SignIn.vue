<template>
  <div class="sign-in">
    <h2>Sign in</h2>
    <el-form>
      <el-form-item label="Email">
        <el-input></el-input>
      </el-form-item>
      <el-form-item>
        <template name="label">Password
          <router-link to="/reset">forgot?</router-link>
        </template>
        <el-input></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;">Sign in</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Form, FormItem, Button, Input } from 'element-ui'

export default {
  name: 'SignIn',

  components: {
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
</style>
