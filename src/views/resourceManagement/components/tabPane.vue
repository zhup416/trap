<template>
    <div>
        <el-table :data="list" border fit highlight-current-row style="width: 100%" v-loading="loading">

            <el-table-column align="center" label="ID" width="65px"
                             element-loading-text="请给我点时间！">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column width="180" align="center" label="用户">
                <template slot-scope="scope">
                    <span>用户ID:{{scope.row.user_id}} {{scope.row.user_login}} {{scope.row.user_nickname}}</span>
                </template>
            </el-table-column>

            <el-table-column width="100px" align="center" label="文件大小">
                <template slot-scope="scope">
                    <span>{{Math.round(scope.row.file_size/1024)}}KB</span>
                </template>
            </el-table-column>

            <el-table-column min-width="110px" align="center" label="文件名">
                <template slot-scope="scope">
                    <span>{{scope.row.filename}}</span>
                </template>
            </el-table-column>

            <el-table-column width="65px" align="center" label="图像">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleImageDialog(scope.row.file_path_url)">
                        <svg-icon icon-class="picture" class-name="image"/>
                    </el-button>
                </template>
            </el-table-column>

            <el-table-column align="center" label="文件路径" min-width="300px">
                <template slot-scope="scope">
                    <span>{{scope.row.file_path}}</span>
                    <span style="color: red">{{scope.row.lost_status}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" class-name="status-col" label="状态" width="75">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status.code | statusFilter">{{scope.row.status.desc}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button size="small" type="danger"
                               @click="handleDeleteData(scope.$index,scope.row.id,scope.row,list)"
                               :loading="scope.row.del_loading">删除
                    </el-button>
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
    import { index, delete_ } from '@/api/user/AdminAsset'

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
        handleImageDialog(url) {
          this.$alert(
            `<div class="picImg" style="width: 100%;text-align: center;"><img src="${url}" style="max-width: 100%;max-height: 60vh"></div>`,
            {
              dangerouslyUseHTMLString: true,
              closeOnClickModal: true,
              showConfirmButton: false
            }
          )
        },
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
        handleDeleteData(index, id, row, list) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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

<style scoped>

</style>
