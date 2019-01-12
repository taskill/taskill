<template>
  <div class="login">
    <div class="login__inner">
      <div class="logo">
        <LogoFull />
      </div>
      <div class="login__form">
        <SignIn v-if="$route.path === '/signin'" />
        <SignUp v-if="$route.path === '/signup'" />
        <Reset v-if="$route.path === '/reset'" />
      </div>
      <div class="login__sub">
        <span v-if="$route.path === '/signin'">
          Not a member?
          <RouterLink to="/signup">
            Sign up now
          </RouterLink>
        </span>
        <span v-if="$route.path === '/signup'">
          Have a account?
          <RouterLink to="/signin">
            Sign in
          </RouterLink>
        </span>
        <span v-if="$route.path === '/reset'">
          <RouterLink to="/signin">
            Back to login
          </RouterLink>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import SignIn from '@/components/login/SignIn'
import SignUp from '@/components/login/SignUp'
import Reset from '@/components/login/Reset'
import LogoFull from '@/assets/images/taskill-logo-full-o.svg'

export default {
  name: '',

  components: {
    SignIn,
    SignUp,
    Reset,
    LogoFull
  },

  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
.login {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  &__form {
    @include panel-box-shadow();
    width: 400px;
    padding: 20px 40px;
    border-radius: 3px;
    h2 {
      text-align: center;
      color: $color-grey-3;
      font-weight: 300;
    }
    .el-form-item {
      margin-bottom: 0;
      &:last-of-type {
        margin: 30px 0;
      }
    }
  }
  &__sub {
    text-align: center;
    margin-top: 15px;
    color: $color-grey-3;
  }
  .logo {
    text-align: center;
    margin-bottom: 20px;
    svg {
      width: 60px;
    }
  }
}
</style>
