<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit" v-btn-permission="78">添加幻灯片</el-button>
        </div>
        <el-table
                :data="slideList"
                border
                style="width: 100%"
                v-loading="loading">
            <el-table-column
                    prop="id"
                    label="ID"
                    width="50px">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="备注">
            </el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button
                            type="success"
                            size="mini"
                            @click="handleEdit(scope.row)"
                            v-btn-permission="80">编辑</el-button>
                    <el-button
                            type="primary"
                            size="mini"
                            @click="handleManagePage(scope.row)" v-btn-permission="83">管理页面</el-button>
                    <el-button
                            type="danger"
                            size="mini"
                            :loading="scope.row.del_loading"
                            @click="handleDelete(scope.$index,scope.row.id,scope.row,slideList)" v-btn-permission="82">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-container">
            <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
                           :page-size="listQuery.limit" layout="prev, pager, next" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="dialogStatus == 'create' ? '添加幻灯片':'编辑幻灯片'" :visible.sync="dialogFormVisible">
                <el-form :model="slideInfo" :rules="rules" ref="form" label-width="100px">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="slideInfo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="slideInfo.remark"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="confirm_loading" v-btn-permission="79">确认</el-button>
                    <el-button v-else type="primary" @click="editData" :loading="confirm_loading" v-btn-permission="81">确认</el-button>
                </div>
        </el-dialog>

        <el-dialog :title="manageTitle" :visible.sync="manageDialog" width="80%" top="50px" @open="managePageOpen">
            <manage-page :slide_id="slideId" ref="managePage"></manage-page>
        </el-dialog>
    </div>
</template>

<script>
    import { slideList, slideAddPost, slideEditPost, slideDeletePost } from '@/api/admin/Setting'
    import managePage from './managePage'
    export default {
      components: { managePage },
      data() {
        return {
          loading: true,
          confirm_loading: false,
          dialogFormVisible: false,
          manageTitle: '',
          manageDialog: false,
          slideId: '',
          dialogStatus: '',
          slideList: [],
          total: 0,
          listQuery: {
            page: 1,
            limit: 10
          },
          slideInfo: {
            id: undefined,
            name: '',
            remark: ''
          },
          rules: {
            name: [
              { required: true, message: '幻灯片名称不能为空', trigger: 'blur' }
            ]
          }
        }
      },
      created() {
        this.getSlideList()
      },
      methods: {
        getSlideList() {
          this.loading = true
          slideList(this.listQuery).then(response => {
            console.log(typeof response.data.items)
            response.data.items.forEach(function(o, i) {
              o.del_loading = false
            })
            this.slideList = response.data.items
            this.total = response.data.total
          }).finally(() => {
            this.loading = false
          })
        },
        handleCreate() {
          this.dialogStatus = 'create'
          this.dialogFormVisible = true
          this.resetSlideInfo()
        },
        handleEdit(row) {
          this.dialogStatus = 'edit'
          this.dialogFormVisible = true
          this.slideInfo.id = row.id
          this.slideInfo.name = row.name
          this.slideInfo.remark = row.remark
          this.$nextTick(() => {
            this.$refs['form'].clearValidate()
          })
        },
        handleManagePage(row) {
          this.manageTitle = '管理' + row.name + '页面'
          this.slideId = row.id
          console.log(this.slideId)
          this.manageDialog = true
        },
        managePageOpen() {
          console.log(this.slideId)
          this.$nextTick(() => {
            this.$refs.managePage.getSlideItemList()
          })
        },
        handleDelete(index, id, row, list) {
          this.$confirm('此操作将删除该幻灯片，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            row['del_loading'] = true
            slideDeletePost(row.id).then(response => {
              if (list.length === 1 && this.listQuery.page > 1) {
                this.listQuery.page--
              }
              this.getSlideList()
              this.$message.success(response.msg)
            }).finally(() => {
              row['del_loading'] = false
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        },
        createData() {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.confirm_loading = true
              slideAddPost(this.slideInfo).then(response => {
                this.getSlideList()
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.msg,
                  type: 'success',
                  duration: 2000
                })
              }).finally(() => {
                this.confirm_loading = false
              })
            }
          })
        },
        editData() {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.confirm_loading = true
              slideEditPost(this.slideInfo).then(response => {
                this.getSlideList()
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.msg,
                  type: 'success',
                  duration: 2000
                })
              }).finally(() => {
                this.confirm_loading = false
              })
            }
          })
        },
        resetSlideInfo() {
          this.slideInfo = {
            id: undefined,
            name: '',
            remark: ''
          }
        },
        handleCurrentChange(current_page) {
          this.listQuery.page = current_page
          this.getSlideList()
        }
      }
    }
</script>