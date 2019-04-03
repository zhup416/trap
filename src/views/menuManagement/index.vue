<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" @click="addMenu(undefined,{pk:0})" type="primary" icon="el-icon-edit">添加菜单</el-button>
        </div>
        <tree-table :columns="columns" :tree-structure="true" :data-source="menuList" :handleAdd="addMenu" :handleEdit="editMenu" :handleDelete="deleteMenu" v-loading="loading"></tree-table>
        <div>
            <el-dialog :title="dialogType === 'create' ? '添加菜单':'编辑菜单'" :visible.sync="dialogFormVisible" @close="dataInit">
                <el-form :model="menuForm" v-loading="formLoading">
                    <el-form-item label="上级" label-width="120px">
                        <el-cascader
                            :options="menuOptions"
                            :props="props"
                            @change="handleChange"
                            :show-all-levels="false"
                            change-on-select
                            :value="selectCascader">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="名称" label-width="120px">
                        <el-input v-model="menuForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="应用" label-width="120px">
                        <el-input v-model="menuForm.app"></el-input>
                    </el-form-item>
                    <el-form-item label="控制器" label-width="120px">
                        <el-input v-model="menuForm.controller"></el-input>
                    </el-form-item>
                    <el-form-item label="方法" label-width="120px">
                        <el-input v-model="menuForm.action"></el-input>
                    </el-form-item>
                    <el-form-item label="参数" label-width="120px">
                        <el-input v-model="menuForm.param"></el-input>
                    </el-form-item>
                    <el-form-item label="图标" label-width="120px">
                        <el-input v-model="menuForm.icon"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" label-width="120px">
                        <el-input v-model="menuForm.remark"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" label-width="120px">
                        <el-select v-model="menuForm.status" placeholder="请选择活动区域">
                            <el-option
                                v-for="item in statusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型" label-width="120px">
                        <el-select v-model="menuForm.type" placeholder="请选择活动区域">
                            <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button v-if="dialogType==='create'" type="primary" @click="addMenuPost" v-loading="confirm_loading">确 定</el-button>
                    <el-button v-else type="primary" @click="editMenuPost" v-loading="confirm_loading">保 存</el-button>
                </div>
            </el-dialog>
        </div>
    </div>

</template>
<script>
    import TreeTable from '@/components/TreeTable'
    import { getMenuList, addMenu, editMenu, addMenuPost, editMenuPost, deleteMenu } from '@/api/admin/menu'
    export default {
      components: {
        TreeTable
      },
      name: 'index',
      data() {
        return {
          loading: false,
          columns: [
            {
              text: 'ID',
              dataIndex: 'pk',
              width: 130
            },
            {
              text: '菜单名称',
              dataIndex: 'name'
            },
            {
              text: '操作',
              dataIndex: 'url'
            },
            {
              text: '状态',
              dataIndex: 'display_txt',
              width: 120
            }
          ],
          dialogFormVisible: false,
          confirm_loading: false,
          formLoading: false,
          menuList: [],
          dialogType: '',
          statusOptions: [{
            value: '1',
            label: '在左侧菜单显示'
          }, {
            value: '0',
            label: '在左侧菜单隐藏'
          }],
          typeOptions: [{
            value: '2',
            label: '有界面可访问菜单'
          }, {
            value: '1',
            label: '无界面可访问菜单'
          }, {
            value: '0',
            label: '只作为菜单'
          }],
          props: {
            label: 'name',
            value: 'pk',
            children: 'children'
          },
          selectCascader: [],
          menuOptions: [],
          menuForm: {
            id: undefined,
            parent_id: '',
            name: '',
            app: '',
            controller: '',
            action: '',
            param: '',
            icon: '',
            remark: '',
            status: '1',
            type: '2'
          }
        }
      },
      created() {
        this.getMenuList()
      },
      methods: {
        getMenuList() {
          this.loading = true
          getMenuList().then(response => {
            this.delLoadingInit(response.data.menuList)
            this.menuList = response.data.menuList
          }).finally(() => {
            this.loading = false
          })
        },
        addMenu: function(index, row) {
          this.formLoading = true
          this.dialogFormVisible = true
          this.dialogType = 'create'
          addMenu(row.pk).then(response => {
            this.menuOptions = response.data.menus
            this.selectCascader = response.data.selectList
            this.menuForm.parent_id = row.pk
            console.log(this.menuList.parent_id)
          }).finally(() => {
            this.formLoading = false
          })
        },
        editMenu(index, row) {
          this.formLoading = true
          this.dialogType = 'edit'
          this.dialogFormVisible = true
          editMenu(row.pk).then(response => {
            this.dataInit(response.data.data_info)
            this.menuOptions = response.data.menus
            this.selectCascader = response.data.selectList
          }).finally(() => {
            this.formLoading = false
          })
        },
        addMenuPost() {
          this.confirm_loading = true
          console.log(this.menuForm)
          addMenuPost(this.menuForm).then(response => {
            this.dialogFormVisible = false
            this.$message.success(response.msg)
            this.getMenuList()
          }).finally(() => {
            this.confirm_loading = false
          })
        },
        editMenuPost() {
          this.confirm_loading = true
          editMenuPost(this.menuForm).then(response => {
            this.dialogFormVisible = false
            this.$message.success(response.msg)
            this.getMenuList()
          }).finally(() => {
            this.confirm_loading = false
          })
        },
        deleteMenu(index, row) {
          this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            row.del_loading = true
            deleteMenu(row.pk).then(response => {
              this.$message.success(response.msg)
              this.getMenuList()
            }).finally(() => {
              row.del_loading = false
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        },
        handleChange(val) {
          this.menuForm.parent_id = val[val.length - 1]
        },
        dataInit(data) {
          if (data) {
            this.menuForm.id = data.id
            this.menuForm.name = data.name
            this.menuForm.parent_id = data.parent_id
            this.menuForm.app = data.app
            this.menuForm.controller = data.controller
            this.menuForm.action = data.action
            this.menuForm.param = data.param
            this.menuForm.icon = data.icon
            this.menuForm.remark = data.remark
            this.menuForm.status = data.status + ''
            this.menuForm.type = data.type + ''
          } else {
            this.menuForm.id = undefined
            this.menuForm.name = ''
            this.menuForm.parent_id = 0
            this.menuForm.app = ''
            this.menuForm.controller = ''
            this.menuForm.action = ''
            this.menuForm.param = ''
            this.menuForm.icon = ''
            this.menuForm.remark = ''
            this.menuForm.status = '1'
            this.menuForm.type = '2'
          }
        },
        delLoadingInit(data) {
          var that = this
          data.forEach(function(o, i) {
            o.del_loading = false
            if (o.children) {
              o.children = that.delLoadingInit(o.children)
            }
          })
          return data
        }
      }
    }
</script>

<style scoped>

</style>