<template>
    <div @click='click'>
      <svg-icon class-name='clearcache-icon' icon-class="clearcache" />
    </div>
</template>

<script>
import { clearCache } from '@/api/admin/Setting'

export default {
  name: 'ClearCache',
  methods: {
    click() {
      clearCache().then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>
.clearcache-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px!important;
}
</style>


