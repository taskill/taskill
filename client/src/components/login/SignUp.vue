<template>
  <div class="sing-up">
    <h2>Sign up</h2>
    <ElForm>
      <ElFormItem label="Email">
        <ElInput />
      </ElFormItem>
      <ElFormItem label="Password">
        <ElInput />
      </ElFormItem>
      <ElFormItem>
        <ElButton
          type="primary"
          style="width:100%;"
        >
          Sign up
        </ElButton>
      </ElFormItem>
    </ElForm>
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
