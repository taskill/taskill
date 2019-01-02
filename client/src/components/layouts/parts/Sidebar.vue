<template>
  <div class="sidebar">
    <div class="sidebar__inner">
      <div class="logo">
        <taskill-logo-text/>
      </div>
    </div>
    <div class="sidebar__panel">
      <div class="item">
        <div class="logo">
          <taskill-logo/>
        </div>
      </div>
      <div class="item">
        <div class="add-new" @click="toggleSideMenu">
          <svg-icon name="plus"/>
        </div>
      </div>
      <div class="item">
        <div class="user-profile"></div>
      </div>
    </div>
    <sidebar-panel-menu :show="showSideMenu" @close="toggleSideMenu"/>
  </div>
</template>

<script>
import SidebarPanelMenu from './SidebarPanelMenu.vue'
import TaskillLogo from '@/assets/images/taskill-logo-icon-o.svg'
import TaskillLogoText from '@/assets/images/taskill-logo-text.svg'
import { SvgIcon } from '@/components/ui'

export default {
  name: 'Sidebar',

  components: {
    SidebarPanelMenu,
    TaskillLogo,
    TaskillLogoText,
    SvgIcon
  },

  data () {
    return {
      showSideMenu: false
    }
  },

  methods: {
    toggleSideMenu () {
      this.showSideMenu = !this.showSideMenu
    }
  }
}
</script>

<style lang="scss">
.sidebar {
  display: flex;
  @include panel-box-shadow();
  &__inner {
    margin-left: 50px;
    width: 100%;
    .logo {
      width: 85px;
      margin: 0 auto;
      padding: 10px 0 20px 0;
    }
  }
  &__panel {
    position: fixed;
    width: 50px;
    height: 100vh;
    @include panel-box-shadow();
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: center;
    .logo {
      margin-top: 10px;
      width: 30px;
      height: 30px;
    }
    .add-new {
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      cursor: pointer;
      &:hover {
        background-color: $color-green;
        svg {
          fill: #fff;
        }
      }
    }
    .user-profile {
      width: 35px;
      height: 35px;
      border-radius: 100%;
      background: $color-grey;
      margin-bottom: 10px;
    }
  }
}
</style>
