<template>
    <div class="app-container">

        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入用户名" v-model="listQuery.user_login">
            </el-input>
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入邮箱" v-model="listQuery.user_email">
            </el-input>
            <el-button class="filter-item" type="info" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="danger" icon="clearcache" @click="handleClear">清空</el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-edit"   @click="handleCreate" v-btn-permission="110">管理员添加</el-button>
        </div>

        <el-table :data="list" border fit highlight-current-row style="width: 100%" v-loading="loading">

            <el-table-column align="center" label="ID" width="65px"
                             element-loading-text="请给我点时间！">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column width="180" align="center" label="用户名">
                <template slot-scope="scope">
                    <span>{{scope.row.user_login}}</span>
                </template>
            </el-table-column>

            <el-table-column width="150" align="center" label="最后登录IP">
                <template slot-scope="scope">
                    <span>{{scope.row.last_login_ip}}</span>
                </template>
            </el-table-column>

            <el-table-column width="150" align="center" label="最后登录时间">
                <template slot-scope="scope">
                    <span>{{scope.row.last_login_time | parseLastLoginTime}}</span>
                </template>
            </el-table-column>

            <el-table-column min-width="150px" align="center" label="邮箱">
                <template slot-scope="scope">
                    <span>{{scope.row.user_email}}</span>
                </template>
            </el-table-column>

            <el-table-column width="85px" align="center" label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.user_status.code | statusFilter">{{scope.row.user_status.desc}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="260">
                <template slot-scope="scope">
                    <div v-if="scope.row.id > 1">
                        <el-button size="mini" type="primary"   @click="handleEdit(scope.row)" v-btn-permission="112">编辑</el-button>
                        <el-button size="mini" type="success"  @click="handleAdminDelete(scope.$index,scope.row.id,scope.row,list)"  :loading="scope.row.del_loading" v-btn-permission="116">删除</el-button>
                        <el-button v-if="scope.row.user_status.code > 0" size="mini" type="info" @click="handleBan(scope.row)" :loading="scope.row.ban_loading" v-btn-permission="117">拉黑</el-button>
                        <el-button v-else size="mini" type="info" @click="handleCancelBan(scope.row)" :loading="scope.row.ban_loading" v-btn-permission="118">启用</el-button>
                    </div>
                    <div v-else>
                        <el-button size="mini" type="primary"  disabled>编辑</el-button>
                        <el-button size="mini" type="success"  disabled>删除</el-button>
                        <el-button size="mini" type="info" disabled>拉黑</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
                           :page-size="listQuery.limit" layout="prev, pager, next" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="dialogStatus === 'create' ? '添加管理员':'编辑管理员'" :visible.sync="dialogFormVisible" @close="handleClose" >
            <!-- 禁止360浏览器自动回填 -->
            <div style="width: 0; height: 0;overflow: hidden">
                <input type="text" id="360text" name="360text">
                <input type="password" id="360password" name="360password">
            </div>
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="90px"  v-loading="formLoading" style='width: 550px; margin-left:50px;'>
                <el-form-item label="用户名" prop="user_login">
                    <el-input v-model="temp.user_login"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="user_pass">
                    <el-input v-model="temp.user_pass" type="password" placeholder="******" ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="user_email">
                    <el-input v-model="temp.user_email"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role_id">
                    <el-checkbox-group v-model="temp.role_id">
                        <el-checkbox v-for="role in roles" :label="role.id" :key="role.id">{{role.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" v-btn-permission="111">确认</el-button>
                <el-button v-else type="primary" @click="editData" v-btn-permission="113">确认</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
  import { index, roles, addPost, edit, editPost, delete_, ban, cancelBan } from '@/api/admin/User'
  import { parseTime } from '@/utils/index'

  export default {
    data() {
      return {
        list: null,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          user_login: undefined,
          user_email: undefined
        },
        loading: false,
        dialogFormVisible: false,
        temp: {
          id: undefined,
          user_login: '',
          user_pass: '',
          user_email: '',
          role_id: []
        },
        rules: {
          user_login: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
          user_email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
          role_id: [{ type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }]
        },
        dialogStatus: 'create',
        formLoading: false,
        roles: []
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: 'success',
          0: 'danger',
          2: 'info'
        }
        return statusMap[status]
      },
      parseLastLoginTime(time) {
        if (time > 0) {
          return parseTime(time, '{y}-{m}-{d} {h}:{i}')
        } else {
          return '该用户还没登陆过'
        }
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
            o.ban_loading = false
          })
          // 必须先渲染数据再复制，否则无法生效
          this.list = response.data.items
          this.total = response.data.total
        }).finally(() => {
          this.loading = false
        })
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          user_login: '',
          user_pass: '',
          user_email: '',
          role_id: []
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleClear() {
        this.listQuery = {
          page: 1,
          limit: 10,
          user_login: undefined,
          user_email: undefined
        }
      },
      handleCreate() {
        this.formLoading = true
        this.dialogStatus = 'create'
        this.rules.user_pass = [{ required: true, message: '密码不能为空', trigger: 'blur' }]
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          roles().then(response => {
            this.roles = response.data
          }).catch((error) => {
            console.info(error)
          }).finally(() => {
            this.formLoading = false
          })
        })
      },
      handleClose() {
        this.resetTemp()
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.formLoading = true
            addPost(this.temp).then(response => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data,
                type: 'success',
                duration: 2000
              })
            }).catch((error) => {
              console.info(error)
            }).finally(() => {
              this.formLoading = false
            })
          }
        })
      },
      handleEdit(row) {
        this.formLoading = true
        this.dialogStatus = 'edit'
        this.rules.user_pass = []
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          this.temp.id = row.id
          this.temp.user_login = row.user_login
          this.temp.user_pass = ''
          this.temp.user_email = row.user_email
          edit(row.id).then(response => {
            this.roles = response.data.roles
            this.temp.role_id = response.data.role_ids
          }).catch((error) => {
            console.info(error)
          }).finally(() => {
            this.formLoading = false
          })
        })
      },
      editData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.formLoading = true
            editPost(this.temp).then(response => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data,
                type: 'success',
                duration: 2000
              })
            }).catch((error) => {
              console.info(error)
            }).finally(() => {
              this.formLoading = false
            })
          }
        })
      },
      handleAdminDelete(index, id, row, list) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row['del_loading'] = true
          delete_(id).then(response => {
            list.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleBan(row) {
        this.$confirm('您确定要拉黑此用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row['ban_loading'] = true
          ban(row.id).then(response => {
            this.getList()
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      handleCancelBan(row) {
        this.$confirm('您确定要启用此用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row['ban_loading'] = true
          cancelBan(row.id).then(response => {
            this.getList()
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
