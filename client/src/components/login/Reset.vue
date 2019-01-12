<template>
  <div class="reset">
    <h2>Reset password</h2>
    <ElForm>
      <ElFormItem label="Email">
        <ElInput />
      </ElFormItem>
      <ElFormItem>
        <ElButton
          type="primary"
          style="width:100%;"
        >
          Reset password
        </ElButton>
      </ElFormItem>
    </ElForm>
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
