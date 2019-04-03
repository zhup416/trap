<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit" v-btn-permission="49">添加角色</el-button>
        </div>
        <el-table :data="list" border fit highlight-current-row style="width: 100%" v-loading="loading">

            <el-table-column align="center" label="ID" width="65px"
                             element-loading-text="请给我点时间！">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column width="180" align="center" label="角色名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>

            <el-table-column min-width="300px" align="center" label="角色描述">
                <template slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                </template>
            </el-table-column>

            <el-table-column width="85px" align="center" label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status.code | statusFilter">{{scope.row.status.desc}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="260">
                <template slot-scope="scope">
                    <div v-if="scope.row.id>1">
                        <el-button size="mini" type="primary" @click="authorize(scope.row.id)"  v-btn-permission="54">权限设置</el-button>
                        <el-button size="mini" type="success" @click="handleEdit(scope.row)"  v-btn-permission="51">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleRoleDelete(scope.$index,scope.row.id,scope.row,list)" :loading="scope.row.del_loading" v-btn-permission="53">删除</el-button>
                    </div>
                    <div v-else>
                        <el-button size="mini" type="primary" disabled >权限设置</el-button>
                        <el-button size="mini" type="success" disabled >编辑</el-button>
                        <el-button size="mini" type="danger" disabled>删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
                           :page-size="listQuery.limit" layout="prev, pager, next" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="dialogStatus == 'create' ? '添加角色':'编辑角色'" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="90px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="temp.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="temp.remark">
                    </el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="temp.status">
                        <el-radio label='1'>开启</el-radio>
                        <el-radio label='0'>禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" v-btn-permission="50">确认</el-button>
                <el-button v-else type="primary" @click="editData" v-btn-permission="52">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="权限设置" :visible.sync="dialogAuthorizeVisible" >
            <div style="height: 50vh;overflow-y: auto">
                <el-tree  ref="authorizeTree"
                        :data="authorizeData"
                        show-checkbox
                        node-key="id"
                        :default-checked-keys="checkedKeys"
                        :props="defaultProps"
                        highlight-current
                        :check-strictly=true
                        @check="handleCheck"
                        v-loading="authorizeLoading">
                </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAuthorizeVisible = false">取消</el-button>
                <el-button type="primary" @click="editAuthorize"  v-btn-permission="55">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import { index, delete_, roleAddPost, roleEditPost, authorizeGet, authorizePost } from '@/api/admin/Rbac'

  export default {
    data() {
      return {
        list: null,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10
        },
        loading: false,
        authorizeLoading: false,
        dialogFormVisible: false,
        dialogAuthorizeVisible: false,
        dialogStatus: '',
        temp: {
          id: undefined,
          name: '',
          remark: '',
          status: '0'
        },
        rules: {
          name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
        },
        authorizeData: null,
        checkedKeys: null,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        currentRoleId: 0
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: 'success',
          0: 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.loading = true
        index(this.listQuery).then(response => {
          response.data.items.forEach(function(o, i) {
            o.del_loading = false
          })
          // 必须先渲染数据再复制，否则无法生效
          this.list = response.data.items
          this.total = response.data.total
          this.loading = false
        })
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleRoleDelete(index, id, row, list) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row['del_loading'] = true
          delete_(id).then(response => {
            if (list.length === 1 && this.listQuery.page > 1) {
              this.listQuery.page--
            }
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).finally(() => {
            row['del_loading'] = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          name: '',
          remark: '',
          status: '0'
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            roleAddPost(this.temp).then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleEdit(row) {
        this.temp.id = row.id
        this.temp.name = row.name
        this.temp.remark = row.remark
        this.temp.status = row.status.code
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      editData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            roleEditPost(this.temp).then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      authorize(id) {
        this.currentRoleId = id
        this.dialogAuthorizeVisible = true
        this.authorizeLoading = true
        this.$nextTick(() => {
          this.$refs['authorizeTree'].setCheckedKeys([])
        })
        authorizeGet(id).then(response => {
          this.authorizeData = response.data.category
          this.checkedKeys = response.data.checkedKeys
          this.authorizeLoading = false
        })
      },
      editAuthorize() {
        const postData = {}
        postData.roleId = this.currentRoleId
        postData.menuId = this.$refs['authorizeTree'].getCheckedKeys()
        authorizePost(postData).then(response => {
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 2000
          })
        }).catch((error) => {
          console.info(error)
        }).finally(() => {
          this.dialogAuthorizeVisible = false
        })
      },
      handleCheck(data) {
        const node = this.$refs['authorizeTree'].getNode(data)
        function setAllParent(node, _this) {
          if (node.data.parent_id > 0) {
            _this.$refs['authorizeTree'].setChecked(node.data.parent_id, true, false)
            setAllParent(node.parent, _this)
          }
        }
        function setAllChildren(node, _this, checked) {
          if (Array.isArray(node.childNodes) && node.childNodes.length > 0) {
            for (let i = 0; i < node.childNodes.length; i++) {
              _this.$refs['authorizeTree'].setChecked(node.childNodes[i].data.id, checked, false)
              if (node.childNodes[i].childNodes) {
                setAllChildren(node.childNodes[i], _this, checked)
              }
            }
          }
        }
        if (node.checked) {
          setAllParent(node, this)
        }
        const checked = node.checked
        setAllChildren(node, this, checked)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
