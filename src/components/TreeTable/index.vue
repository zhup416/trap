<template>
  <el-table
      :data="data"
      border
      style="width: 100%"
      :row-style="showTr">
    <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :width="column.width" :label="column.text">
      <template slot-scope="scope">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
        <span v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
          <i v-if="scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
        </span>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        {{scope.row[column.dataIndex]}}
      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="treeType === 'normal'" width="300">
      <template slot-scope="scope">
        <el-button
            size="mini"
            type="success"
            @click="handleAddMenu(scope.$index, scope.row)">添加子菜单
        </el-button>

        <el-button
            size="mini"
            type="default"
            @click="handleEditMenu(scope.$index, scope.row)">编辑
        </el-button>

        <el-button
            size="mini"
            type="danger"
            @click="handleDeleteMenu(scope.$index, scope.row)"
            :loading="scope.row.del_loading">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
  <script>
    import Utils from './utils/index'
    //  import Vue from 'vue'
    export default {
      name: 'treeTable',
      props: {
        // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
        treeStructure: {
          type: Boolean,
          default: function() {
            return false
          }
        },
        // 这是相应的字段展示
        columns: {
          type: Array,
          default: function() {
            return []
          }
        },
        // 这是数据源
        dataSource: {
          type: Array,
          default: function() {
            return []
          }
        },
        // 父组件传来的方法
        handleAdd: {
          type: Function
        },
        // 父组件传来的方法
        handleEdit: {
          type: Function
        },
        // 父组件传来的方法
        handleDelete: {
          type: Function
        },
        // 这个是是否展示操作列
        treeType: {
          type: String,
          default: function() {
            return 'normal'
          }
        },
        // 是否默认展开所有树
        defaultExpandAll: {
          type: Boolean,
          default: function() {
            return false
          }
        }
      },
      data() {
        return {}
      },
      computed: {
        // 格式化数据源
        data: function() {
          const me = this
          if (me.treeStructure) {
            const data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
            return data
          }
          return me.dataSource
        }
      },
      methods: {
        // 显示行
        showTr: function(rowObject) {
          const row = rowObject.row
          const show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
          row._show = show
          return show ? '' : 'display:none;'
        },
        // 展开下级
        toggle: function(trIndex) {
          const me = this
          const record = me.data[trIndex]
          record._expanded = !record._expanded
        },
        // 显示层级关系的空格和图标
        spaceIconShow(index) {
          const me = this
          if (me.treeStructure && index === 0) {
            return true
          }
          return false
        },
        // 点击展开和关闭的时候，图标的切换
        toggleIconShow(index, record) {
          const me = this
          if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
            return true
          }
          return false
        },
        handleAddMenu(index, row) {
          this.handleAdd(index, row)
        },
        handleEditMenu(index, row) {
          this.handleEdit(index, row)
        },
        handleDeleteMenu(index, row) {
          this.handleDelete(index, row)
        }
      }
    }
  </script>
  <style scoped>
    .ms-tree-space{
      position: relative;
      top: 1px;
      display: inline-block;
      font-family: 'Glyphicons Halflings';
      font-style: normal;
      font-weight: 400;
      line-height: 1;
      width: 18px;
      height: 14px;
    }
    .ms-tree-space::before{content: ""}
    table td{
      line-height: 26px;
    }
  </style>