<template>
    <div class="app-container">
        <el-table
                :data="pluginList"
                border
                style="width: 100%"
                v-loading="loading">
            <el-table-column
                    prop="title"
                    label="插件名称">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="插件标识">
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="描述">
            </el-table-column>
            <el-table-column
                    prop="author"
                    label="作者">
            </el-table-column>
            <el-table-column
                    label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button
                            v-if="scope.row.status === 3"
                            type="success"
                            size="mini"
                            @click="pluginInstall(scope.row.name)">安装</el-button>
                    <el-button
                            v-else
                            type="success"
                            size="mini"
                            @click="pluginUninstall(scope.row.id)">卸载</el-button>
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
    import { pluginList, pluginInstall, pluginUninstall } from '@/api/admin/Setting'
    export default {
      data() {
        return {
          loading: true,
          slideId: '',
          dialogStatus: '',
          pluginList: [],
          total: 0,
          listQuery: {
            page: 1,
            limit: 10
          }
        }
      },
      filters: {
        statusFilter(status) {
          const statusMap = {
            0: '禁用',
            1: '开启',
            3: '未安装'
          }
          return statusMap[status]
        }
      },
      created() {
        this.getpluginList()
      },
      methods: {
        getpluginList() {
          this.loading = true
          pluginList(this.listQuery).then(response => {
            this.pluginList = Object.values(response.data.items)
            this.total = response.data.total
          }).finally(() => {
            this.loading = false
          })
        },
        handleCurrentChange(current_page) {
          this.listQuery.page = current_page
          this.getpluginList()
        },
        pluginInstall(name) {
          pluginInstall(name).then(response => {
            this.$message.success(response.msg)
            this.getpluginList()
          })
        },
        pluginUninstall(id) {
          pluginUninstall(id).then(response => {
            this.$message.success(response.msg)
            this.getpluginList()
          })
        }
      }
    }
</script>