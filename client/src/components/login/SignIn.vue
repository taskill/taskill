<template>
  <div class="sign-in">
    <h2>Sign in</h2>
    <el-form size="default">
      <el-form-item label="Email">
        <el-input v-model="email" />
      </el-form-item>
      <el-form-item>
        <template name="label">
          Password
          <router-link to="/reset">
            forgot?
          </router-link>
        </template>
        <el-input
          v-model="password"
          type="password"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width:100%;"
          @click="signIn"
        >
          Sign in
        </el-button>
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
