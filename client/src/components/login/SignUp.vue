<template>
  <div class="sing-up">
    <h2>Sign up</h2>
    <el-form size="default">
      <el-form-item label="Name">
        <el-input v-model="name" />
      </el-form-item>
      <el-form-item label="Username">
        <el-input v-model="username" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="email" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input
          v-model="password"
          type="password"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width:100%;"
          @click="signUp"
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
      name: undefined,
      username: undefined,
      email: undefined,
      password: undefined
    }
  },

  methods: {
    signUp () {
      this.$store.dispatch('signUp', {
        name: this.name,
        username: this.username,
        email: this.email,
        password: this.password,
        vm: this
      })
    }
  }
}
</script>

<style lang="scss">
</style>
