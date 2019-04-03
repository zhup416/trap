<template>
  <div class="resourceManagement-container">
    <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' :name="item.key">
        <keep-alive>
          <tab-pane v-if='activeName==item.key' :type='item.key'></tab-pane>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import tabPane from './components/tabPane'

  export default {
    name: 'resourceManagement',
    components: { tabPane },
    data() {
      return {
        tabMapOptions: [
          { label: '资源列表', key: 'resource-list' }
        ],
        activeName: 'resource-list'
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .resourceManagement-container{
    margin: 20px;
  }
</style>