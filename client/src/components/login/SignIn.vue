<template>
  <div class="sign-in">
    <h2>Sign in</h2>
    <ElForm>
      <ElFormItem label="Email">
        <ElInput v-model="email" />
      </ElFormItem>
      <ElFormItem>
        <template name="label">
          Password
          <RouterLink to="/reset">
            forgot?
          </RouterLink>
        </template>
        <ElInput
          v-model="password"
          type="password"
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton
          type="primary"
          style="width:100%;"
          @click="signIn"
        >
          Sign in
        </ElButton>
      </ElFormItem>
    </ElForm>
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
      email: undefined,
      password: undefined
    }
  },

  methods: {
    signIn () {
      const email = this.email
      const password = this.password
      this.$store.dispatch('signIn', { email, password, vm: this })
    }
  }
}
</script>

<style lang="scss"></style>
