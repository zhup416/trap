<template>
  <div class="app-container">
    <el-button :span="4" type="primary" @click="addProfession">添加职称</el-button>
    <el-row style="margin: 30px 0">
      <el-col :span="8">
        <el-form ref="upForm" :model="upForm" label-width="80px">
          <el-form-item label="升级条件">
            <el-radio-group v-model="upForm.type">
              <el-radio ref="radio" label="0">报单数</el-radio>
              <el-radio ref="radio" label="1">销售额</el-radio>
            </el-radio-group>
            <el-button class="btnSave" size="small" type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-input :span="8" v-model="professionName" placeholder="请输入职称名称"></el-input>
      </el-col>
      <el-col :span="6" :offset="1">
        <el-button :span="4" icon="el-icon-search" type="primary" @click="getProfessionList">搜索</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="professionList"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="职称名称" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人数" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.peopleNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="升级条件" min-width="150" align="center">
        <template slot-scope="scope">
          <span v-if="upForm.type == 0">报单数</span>
          <span v-else>销售额</span>
          <span>指定范围为{{scope.row.min_order_num}}-{{scope.row.max_order_num}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editProfession(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-delete"
            @click="professionDel(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageInfo.curPage"
      :limit.sync="pageInfo.pageSize"
      @pagination="getProfessionList"
    />
    <div class="components-container">
      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogTableVisible"
        :title="dragTitle"
        @dragDialog="handleDrag"
        @close="closeDialog"
      >
        <el-form ref="addForm" :model="addForm" label-width="80px">
          <el-form-item label="职称名称">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="升级范围">
            <el-input type="number" v-model="addForm.min" style="width: 45%"></el-input>
            <span>--</span>
            <el-input type="number" v-model="addForm.max" style="width: 45%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              v-if="dragTitle === '添加职称'"
              @click.native="saveProfession('add')"
            >添加</el-button>
            <el-button type="primary" v-else @click.native="saveProfession">保存</el-button>
            <el-button type="info" @click.native="closeDialog">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import Pagination from '@/components/Pagination'
import { setUpCondition, getProfessionList, delProfession, addProfessionTitle, editProfessionTitle } from '@/api/dingpc/professionManage'
export default {
  components: { Pagination },
  directives: { elDragDialog },
  name: 'index',
  created() {
    this.getProfessionList()
  },
  data() {
    return {
      loading: true,
      dragTitle: '添加职称',
      selectProfession: '',
      upForm: {
        type: ''
      },
      professionName: '',
      professionList: [],
      pageInfo: {
        curPage: 1,
        pageSize: 10
      },
      total: 0,
      dialogTableVisible: false,
      addForm: {
        name: '',
        min: 0,
        max: 0
      }
    }
  },
  methods: {
    onSubmit() {
      setUpCondition({ upCondition: this.upForm.type, companyId: 1 }).then(response => {
        if (response.code === 1) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
        }
      }).finally(() => {
      })
    },
    getProfessionList() {
      this.loading = true
      getProfessionList({
        curPage: this.pageInfo.curPage,
        pageSize: this.pageInfo.pageSize,
        profession_title: this.professionName,
        companyId: 1
      }).then(response => {
        if (response.code === 1) {
          this.professionList = response.data.profession
          this.$set(this.upForm, 'type', response.data.type.code + '')
          this.total = response.data.count
        }
      }).finally(() => {
        this.loading = false
      })
    },
    editProfession(index, row) {
      this.dragTitle = '编辑职称'
      this.dialogTableVisible = true
      this.addForm.name = row.name
      this.addForm.min = row.min_order_num
      this.addForm.max = row.max_order_num
      this.selectProfession = row.id
    },
    professionDel(index, row) {
      this.$confirm('是否删除职称： ' + row.name + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delProfession({ professionId: row.id }).then(response => {
          if (response.code === 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            for (let i = 0, len = this.professionList.length; i < len; i++) {
              if (this.professionList[i].id === row.id) {
                this.professionList.splice(i, 1)
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
      this.getProfessionList()
    },
    addProfession() {
      this.dialogTableVisible = true
      this.dragTitle = '添加职称'
    },
    saveProfession(type) {
      if (type === 'add') {
        addProfessionTitle({
          professionTitle: this.addForm.name,
          min_order_num: this.addForm.min,
          max_order_num: this.addForm.max,
          companyId: 1
        }).then(response => {
          if (response.code === 1) {
            this.getProfessionList()
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
        editProfessionTitle({
          professionTitle: this.addForm.name,
          min_order_num: this.addForm.min,
          max_order_num: this.addForm.max,
          professionId: this.selectProfession,
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
      this.dialogTableVisible = false
      this.addForm.name = ''
      this.addForm.min = ''
      this.addForm.max = ''
      this.selectProfession = ''
    }
  }
}
</script>

<style scoped>
.btnSave {
  margin-left: 20px;
}
</style>
