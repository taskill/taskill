<template>
  <div class="sing-up">
    <h2>Sign up</h2>
    <el-form>
      <el-form-item label="Email">
        <el-input />
      </el-form-item>
      <el-form-item label="Password">
        <el-input />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width:100%;"
        >
          Sign up
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Form, FormItem, Button, Input } from 'element-ui'

export default {
  name: 'SignUp',

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
