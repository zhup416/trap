<template>
  <div class="app-wrapper" :class="classObj">
    <div class="trdp-header">
     <div class="trdp-header-brand">
        <span>ThinkTRDP后台管理中心</span>
     </div>
     <div class="trdp-header-main">
         <right-menu></right-menu>
     </div>
    </div>
    <div class="trdp-main">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
      <sidebar class="sidebar-container"></sidebar>
      <div class="main-container">
        <navbar></navbar>
        <tags-view></tags-view>
        <app-main></app-main>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView, RightMenu } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    RightMenu
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
  .trdp-header {
      height: 50px;
      line-height: 50px;
      background: #1F2D3D;
  }
  .trdp-header-brand {
      float: left;
      width: 280px;
  }
  .trdp-header-brand > span {
      color: #ffffff;
      padding: 0 45px;
  }
  .trdp-header-main {
      float: right;
      width: calc(100% - 280px);
      height: 100%;
  }
  .trdp-main {
      position: relative;
      height: calc(100% - 50px);
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
