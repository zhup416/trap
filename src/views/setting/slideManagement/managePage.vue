<template>
    <div style="height: 750px;overflow-y: auto">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit" v-btn-permission="84">添加幻灯片页面</el-button>
        </div>
        <el-table
                :data="slideItemList"
                border
                style="width: 100%"
                v-loading="loading">
            <el-table-column
                    prop="id"
                    label="ID"
                    width="50px">
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="幻灯片标题">
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="描述">
            </el-table-column>
            <el-table-column
                    prop="url"
                    label="链接">
            </el-table-column>
            <el-table-column
                    prop="url"
                    label="图片">
            </el-table-column>
            <el-table-column
                    prop="status.desc"
                    label="状态">
            </el-table-column>
            <el-table-column label="操作" width="250px">
                <template slot-scope="scope">
                    <el-button
                            type="success"
                            size="mini"
                            @click="handleEdit(scope.row)" v-btn-permission="86">编辑</el-button>
                    <el-button
                            type="danger"
                            size="mini"
                            :loading="scope.row.del_loading"
                            @click="handleDelete(scope.$index,scope.row.id,scope.row,slideItemList)"  v-btn-permission="88">删除</el-button>
                    <el-button
                            v-if="scope.row.status.code == 0"
                            type="primary"
                            size="mini"
                            :loading="scope.row.ban_loading"
                            @click="handleCancelBan(scope.row)" v-btn-permission="90">显示</el-button>
                    <el-button
                            v-else
                            type="primary"
                            size="mini"
                            :loading="scope.row.ban_loading"
                            @click="handleBan(scope.row)" v-btn-permission="89">隐藏</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialogStatus == 'create' ? '添加幻灯片页面':'编辑幻灯片页面'" :visible.sync="dialogFormVisible" :modal="false">
            <el-form :model="slideItemInfo" :rules="rules" ref="slideItemForm" label-width="100px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="slideItemInfo.title"></el-input>
                </el-form-item>
                <el-form-item label="链接" prop="url">
                    <el-input v-model="slideItemInfo.url"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="slideItemInfo.description"></el-input>
                </el-form-item>
                <el-form-item label="幻灯片内容" prop="content">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="slideItemInfo.content"></el-input>
                </el-form-item>
                <el-form-item label="缩略图" prop="image">
                    <image-list-uploader
                            :file-list="slideItemInfo.image_display"
                            :limit=1
                            @on-success="handleUploadSuccess"
                            @before-upload="beforeImageUpload"
                            @on-remove="handleRemoveImage"
                    ></image-list-uploader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="confirm_loading" v-btn-permission="85">确认</el-button>
                <el-button v-else type="primary" @click="editData" :loading="confirm_loading" v-btn-permission="87">确认</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
  import { slideItemList, slideItemAddPost, slideItemEditPost, slideItemDeletePost, slideItemBanPost, slideItemCancelBanPost } from '@/api/admin/Setting'
  import imageListUploader from '@/components/Uploader/imageListUploader'

  export default {
    components: { imageListUploader },
    data() {
      return {
        slideItemList: [],
        loading: false,
        confirm_loading: false,
        dialogFormVisible: false,
        dialogStatus: '',
        slideItemInfo: {
          id: undefined,
          slide_id: 0,
          title: '',
          url: '',
          description: '',
          content: '',
          image: '',
          image_display: [
          ]
        },
        rules: {
          title: [
            { required: true, message: '幻灯片名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    props: {
      slide_id: {
        type: Number,
        default: 0
      }
    },
    methods: {
      getSlideItemList() {
        this.loading = true
        slideItemList(this.slide_id).then(response => {
          response.data.items.forEach(function(o, i) {
            o.del_loading = false
            o.ban_loading = false
          })
          this.slideItemList = response.data.items
        }).finally(() => {
          this.loading = false
        })
      },
      handleCreate() {
        this.dialogStatus = 'create'
        this.resetSlideItemInfo()
        this.dialogFormVisible = true
      },
      handleEdit(row) {
        this.dialogStatus = 'edit'
        this.slideItemInfo.id = row.id
        this.slideItemInfo.slide_id = this.slide_id
        this.slideItemInfo.title = row.title
        this.slideItemInfo.url = row.url
        this.slideItemInfo.description = row.description
        this.slideItemInfo.content = row.content
        this.slideItemInfo.image_display = row.image_url
        this.slideItemInfo.image = row.image
        this.dialogFormVisible = true
      },
      handleDelete(index, id, row, list) {
        this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'waring'
        }).then(() => {
          row['del_loading'] = true
          slideItemDeletePost(row.id).then(response => {
            this.getSlideItemList()
            this.$message.success(response.msg)
          }).finally(() => {
            row['del_loading'] = false
          })
        }).catch(() => {
          this.$message('已取消')
        })
      },
      handleBan(row) {
        this.$confirm('确定隐藏此幻灯片吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'waring'
        }).then(() => {
          row['ban_loading'] = true
          slideItemBanPost(row.id).then(response => {
            this.getSlideItemList()
            this.$message.success(response.msg)
          }).finally(() => {
            row['ban_loading'] = false
          })
        }).catch(() => {
          this.$message('已取消')
        })
      },
      handleCancelBan(row) {
        this.$confirm('确定显示此幻灯片吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'waring'
        }).then(() => {
          row['ban_loading'] = true
          slideItemCancelBanPost(row.id).then(response => {
            this.getSlideItemList()
            this.$message.success(response.msg)
          }).finally(() => {
            row['ban_loading'] = false
          })
        }).catch(() => {
          this.$message('已取消')
        })
      },
      createData() {
        this.$refs['slideItemForm'].validate((valid) => {
          if (valid) {
            this.confirm_loading = true
            slideItemAddPost(this.slideItemInfo).then(response => {
              this.getSlideItemList()
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
        this.$refs['slideItemForm'].validate((valid) => {
          if (valid) {
            this.confirm_loading = true
            slideItemEditPost(this.slideItemInfo).then(response => {
              this.getSlideItemList()
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
      resetSlideItemInfo() {
        this.slideItemInfo = {
          id: undefined,
          slide_id: this.slide_id,
          title: '',
          url: '',
          description: '',
          content: '',
          image: '',
          image_display: []
        }
      },
      handleUploadSuccess(response, file, fileList) {
        this.slideItemInfo.image = response.data.filepath
      },
      beforeImageUpload(file) {
        let isIMAGE = false
        if (file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/png') {
          isIMAGE = true
        }
        if (!isIMAGE) {
          this.$message.error('上传文件只能是图片格式!')
        }
        return isIMAGE
      },
      handleRemoveImage(file, fileList) {
        this.slideItemInfo.image = ''
      }
    }
  }
</script>