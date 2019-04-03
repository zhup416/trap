<template>
  <div class="app-container">
    <el-button :span="4" type="primary" @click="addClassifyBtn">添加分类</el-button>
    <el-row style="margin: 30px 0">
      <el-col :span="6">
        <el-input :span="8" v-model="classifyName" placeholder="请输入分类名称"></el-input>
      </el-col>
      <el-col :span="6" :offset="1">
        <el-button :span="4" icon="el-icon-search" type="primary" @click="getClassify">搜索</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading"
              :data="classifyList"
              stripe
              style="width: 100%">
      <el-table-column
        type="index"
        :index="indexMethod"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="classify_name"
        label="分类名称">
      </el-table-column>
      <el-table-column
        prop="classify_level"
        label="层级">
      </el-table-column>
      <el-table-column
        prop="parent_name"
        label="上级分类">
      </el-table-column>
      <el-table-column
        prop="productCount"
        label="产品数量">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="classifyEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="classifyDel(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center">
      <el-col class="pageBox" style="margin: 30px 0" :span="6">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="pageInfo.curPage"
          :page-size="pageInfo.pageSize"
          layout="prev, pager, next"
          :total="pageInfo.total">
        </el-pagination>
      </el-col>
    </el-row>
    <div class="components-container">
      <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" :title="dragTitle" @dragDialog="handleDrag" @close='closeDialog'>
        <el-form ref="addForm" :model="addForm" label-width="80px">
          <el-form-item label="分类名称">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="上级分类">
            <el-cascader
              :options="classifyOptions"
              v-model="addForm.classifyOptions"
              change-on-select
              clearable
            ></el-cascader>
            <p style="font-size: 12px;margin-top: 0">最多成为第三级,如果设置为第二级, 只选择第一级即可</p>
          </el-form-item>
          <el-form-item label="分类图标">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="http://www.szb.com:8080/dingpc/product/upLoader"
              :file-list="addForm.fileList"
              :limit="1"
              list-type="picture">
              <el-button size="small" type="primary">上传图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件和一张图片，且不超过500kb，图片建议上传80*80的像素</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-if="dragTitle === '添加分类'" @click.native="saveClassify('add')">添加</el-button>
            <el-button type="primary" v-else @click.native="saveClassify">保存</el-button>
            <el-button type="info" @click.native="closeDialog">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import { getClassifyList, delClassify, getClassifyLevel, addClassify } from '@/api/dingpc/ProductManage'
  export default {
    directives: { elDragDialog },
    name: 'index',
    created() {
      this.getClassify()
      this.getClassifyLevel()
    },
    data() {
      return {
        loading: true,
        dragTitle: '添加分类',
        selectProfession: '',
        classifyName: '',
        classifyList: [],
        pageInfo: {
          curPage: 1,
          pageSize: 5,
          total: 10
        },
        dialogTableVisible: false,
        addForm: {
          name: '',
          classifyOptions: [],
          fileList: []
        },
        classifyOptions: []
      }
    },
    methods: {
      indexMethod(index) {
        return (this.pageInfo.curPage - 1) * this.pageInfo.pageSize + (index + 1)
      },
      getClassify() {
        this.loading = true
        getClassifyList({
          page: this.pageInfo.curPage,
          limit: this.pageInfo.pageSize,
          search: this.classifyName,
          companyId: 1
        }).then(response => {
          if (response.code === 1) {
            this.classifyList = response.data.list
            this.pageInfo.total = response.data.total
            console.log(this.classifyList)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      classifyEdit(index, row) {
        this.dragTitle = '编辑分类'
        this.dialogTableVisible = true
        this.addForm.name = row.classify_name
        this.addForm.min = row.classifyOptions
        this.addForm.max = row.max_order_num
        this.selectProfession = row.id
      },
      classifyDel(index, row) {
        this.$confirm('是否删除分类： ' + row.classify_name + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delClassify({ classify_id: row.id }).then(response => {
            if (response.code === 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              for (let i = 0, len = this.classifyList.length; i < len; i++) {
                if (this.classifyList[i].id === row.id) {
                  this.classifyList.splice(i, 1)
                }
              }
            }
          }).finally(() => {
          })
        }).catch(() => {
        })
      },
      handleCurrentChange(val) {
        this.loading = true
        this.pageInfo.curPage = val
        this.getClassify()
      },
      getClassifyLevel() {
        getClassifyLevel({
          companyId: 1
        }).then(response => {
          if (response.code === 1) {
            this.classifyOptions = response.data
          }
        }).finally(() => {
        })
      },
      addClassifyBtn() {
        this.dialogTableVisible = true
        this.dragTitle = '添加分类'
      },
      saveClassify(type) {
        console.log(this.addForm.classifyOptions)
        console.log(this.addForm.fileList)
        if (type === 'add') {
          addClassify({
            classifyName: this.addForm.name,
            parentId: this.addForm.classifyOptions,
            classifyIcon: this.addForm.fileList,
            companyId: 1
          }).then(response => {
            if (response.code === 1) {
              this.getClassify()
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.dialogTableVisible = false
            }
          }).finally(() => {
            this.loading = false
          })
        } else {
          addClassify({
            classifyName: this.addForm.name,
            parentId: this.addForm.classifyOptions,
            classifyIcon: this.addForm.fileList,
            companyId: 1
          }).then(response => {
            if (response.code === 1) {
              this.getProfessionList()
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.dialogTableVisible = false
            }
          }).finally(() => {
            this.loading = false
          })
        }
      },
      handleDrag() {
      },
      closeDialog() {
        this.addForm.name = ''
        this.addForm.classifyOptions = []
        this.addForm.fileList = []
        this.dialogTableVisible = false
      }
    }
  }
</script>

<style scoped>
  .btnSave{
    margin-left: 20px;
  }
</style>
