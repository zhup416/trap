<template>
    <div class="app-container">

        <el-table :data="list" border fit highlight-current-row style="width: 100%" v-loading="loading">

            <el-table-column align="center" label="ID" width="55px"
                             element-loading-text="请给我点时间！">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column width="150" align="center" label="来源">
                <template slot-scope="scope">
                    <span>{{scope.third_party }}</span>
                </template>
            </el-table-column>

            <el-table-column width="150" align="center" label="头像">
                <template slot-scope="scope">
                    <span>{{scope.avatar }}</span>
                </template>
            </el-table-column>

            <el-table-column min-width="150px" align="center" label="昵称">
                <template slot-scope="scope">
                    <span>{{scope.row.user_nickname}}</span>
                </template>
            </el-table-column>

            <el-table-column min-width="140px" align="center" label="首次登录时间">
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

            <el-table-column width="100px" align="center" label="登录次数">
                <template slot-scope="scope">
                    <span>{{scope.row.login_times }}</span>
                </template>
            </el-table-column>

            <el-table-column width="85px" align="center" label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.user_status.code | statusFilter">{{scope.row.user_status.desc}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="85">
                <template slot-scope="scope">
                    <el-button size="mini" type="success"  @click="handleDelete(scope.$index,scope.row.id,scope.row,list)"  :loading="scope.row.del_loading" v-btn-permission="157">删除</el-button>
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
  import { index, delete_ } from '@/api/user/AdminOauth'
  import { parseTime } from '@/utils/index'

  export default {
    data() {
      return {
        list: null,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10
        },
        loading: false
      }
    },
    filters: {
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
          })
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
      handleRoleDelete(index, id, row, list) {
        this.$confirm('此操作将永久删除该第三方用户, 是否继续?', '提示', {
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
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
