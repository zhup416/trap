<template>
    <div class="app-container">

        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入用户ID" v-model="listQuery.uid">
            </el-input>
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名/昵称/邮箱/手机" v-model="listQuery.keyword">
            </el-input>
            <el-button class="filter-item" type="info" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="danger" icon="clearcache" @click="handleClear">清空</el-button>
        </div>

        <el-table :data="list" border fit highlight-current-row style="width: 100%" v-loading="loading">

            <el-table-column align="center" label="ID" width="55px"
                             element-loading-text="请给我点时间！">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column width="150" align="center" label="用户名">
                <template slot-scope="scope">
                    <span>{{scope.row | userFilter}}</span>
                </template>
            </el-table-column>

            <el-table-column width="150" align="center" label="昵称">
                <template slot-scope="scope">
                    <span>{{scope.row | nickNameFilter}}</span>
                </template>
            </el-table-column>

            <el-table-column min-width="150px" align="center" label="邮箱">
                <template slot-scope="scope">
                    <span>{{scope.row.user_email}}</span>
                </template>
            </el-table-column>

            <el-table-column min-width="120px" align="center" label="手机">
                <template slot-scope="scope">
                    <span>{{scope.row.mobile}}</span>
                </template>
            </el-table-column>

            <el-table-column min-width="140px" align="center" label="注册时间">
                <template slot-scope="scope">
                    <span>{{scope.row.create_time | parseLastLoginTime}}</span>
                </template>
            </el-table-column>

            <el-table-column min-width="140px" align="center" label="最后登录时间">
                <template slot-scope="scope">
                    <span>{{scope.row.last_login_time | parseLastLoginTime}}</span>
                </template>
            </el-table-column>

            <el-table-column width="100px" align="center" label="最后登录IP">
                <template slot-scope="scope">
                    <span>{{scope.row.last_login_ip }}</span>
                </template>
            </el-table-column>

            <el-table-column width="85px" align="center" label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.user_status.code | statusFilter">{{scope.row.user_status.desc}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="85">
                <template slot-scope="scope">
                    <div v-if="scope.row.id > 1">
                        <el-button v-if="scope.row.user_status.code > 0" size="mini" type="info" @click="handleBan(scope.row)" :loading="scope.row.ban_loading" v-btn-permission="154">拉黑</el-button>
                        <el-button v-else size="mini" type="info" @click="handleCancelBan(scope.row)" :loading="scope.row.ban_loading" v-btn-permission="155">启用</el-button>
                    </div>
                    <div v-else>
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
    </div>
</template>
<script>
  import { index, cancelBan, ban } from '@/api/user/AdminIndex'
  import { parseTime } from '@/utils/index'

  export default {
    data() {
      return {
        list: null,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          uid: undefined,
          keyword: undefined
        },
        loading: false
      }
    },
    filters: {
      userFilter(row) {
        return row.user_login ? row.user_login : (row.mobile ? row.mobile : '第三方用户')
      },
      nickNameFilter(row) {
        return row.user_nickname ? row.user_nickname : '未填写'
      },
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
          this.list = response.data.items
          this.total = response.data.total
        }).finally(() => {
          this.loading = false
        })
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
          uid: undefined,
          keyword: undefined
        }
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
