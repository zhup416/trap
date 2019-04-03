<template>
    <div @click="$router.push('/menuManagement/menuManagement')">
      <svg-icon class-name='backgroundmenu-icon' icon-class="list" />
    </div>
</template>

<script>
export default {
  name: 'BackgroundMenu'
}
</script>

<style scoped>
.backgroundmenu-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px!important;
  color: #ffffff;
}
</style>


