<template>
  <div class="reset">
    <h2>Reset password</h2>
    <el-form>
      <el-form-item label="Email">
        <el-input></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;">Reset password</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Form, FormItem, Button, Input } from 'element-ui'

export default {
  name: 'Reset',

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
