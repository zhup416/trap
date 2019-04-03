<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card" shadow="hover" style="margin: 15px 0 5px;">
        <el-row>
          <el-col :span="8" class="search-li">
            <span>公司名称：</span>
            <el-input v-model="pageInfo.companyName" placeholder="请输入公司名称" style="width: 60%"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click.native="search">搜索</el-button>
            <el-button class="addBtn" type="primary" @click="handleCreate">创建产品</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="people-list">
      <el-table
        v-loading="loading"
        :data="companyList"
        border
        fit
        stripe
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" prop="id" align="center" width="65">
          <template slot-scope="scope">
            <span>{{ scope.row.companyId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司编号" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.companyNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司名称" min-width="180px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.companyName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="150"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="success">编辑</el-button>
            <el-button size="mini" type="danger" @click="productDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageInfo.curPage"
        :limit.sync="pageInfo.pageSize"
        @pagination="getCompanyData"
      />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        :model="company"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="公司id：" prop="companyId">
          <el-input type="number" v-model="company.companyId"/>
        </el-form-item>
        <el-form-item label="公司名称：" prop="companyName">
          <el-input v-model="company.companyName"/>
        </el-form-item>
        <el-form-item label="公司编号：" prop="companyNum">
          <el-input v-model="company.companyNum"/>
        </el-form-item>
        <el-form-item label="钉钉企业id：" prop="corpId">
          <el-input v-model="company.corpId"/>
        </el-form-item>
        <el-form-item label="钉钉应用键：" prop="appKey">
          <el-input v-model="company.appKey"/>
        </el-form-item>
        <el-form-item label="钉钉应用秘钥：" prop="appSecret">
          <el-input v-model="company.appSecret"/>
        </el-form-item>
        <el-form-item label="钉钉应用id：" prop="agentId">
          <el-input v-model="company.agentId"/>
        </el-form-item>
        <el-form-item label="权限角色id：" prop="roleId">
          <el-input type="number" v-model="company.roleId"/>
        </el-form-item>
        <el-form-item label="权限名称：" prop="roleName">
          <el-input v-model="company.roleName"/>
        </el-form-item>
        <el-form-item label="公司管理员登录名：" prop="loginName">
          <el-input v-model="company.loginName"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { companyList, companyEdit, companyAdd, companyDel } from '@/api/dingpc/NetSpot'
export default {
  components: { Pagination },
  name: 'index',
  data() {
    return {
      loading: true,
      dialogFormVisible: false,
      companyList: [],
      textMap: {
        update: '编辑',
        create: '创建'
      },
      company: {
        companyId: undefined,
        companyName: undefined,
        companyNum: undefined,
        corpId: undefined,
        appKey: undefined,
        appSecret: undefined,
        agentId: undefined,
        roleName: undefined,
        roleId: undefined,
        loginName: undefined
      },
      dialogStatus: '',
      pageInfo: {
        curPage: 1,
        pageSize: 10,
        companyName: undefined
      },
      total: 0
    }
  },
  methods: {
    getCompanyData() {
      this.loading = true
      companyList(this.pageInfo).then(response => {
        if (response.data) {
          this.loading = false
          this.companyList = response.data.items
          this.total = response.data.total
        }
      })
    },
    handleCurrentChange(val) {
      this.loading = true
      this.pageInfo.curPage = val
      this.getCompanyData()
    },
    search() {
      this.pageInfo.curPage = 1
      this.getCompanyData()
    },
    resetTemp() {
      this.company = {
        companyId: undefined,
        companyName: undefined,
        companyNum: undefined,
        corpId: undefined,
        appKey: undefined,
        appSecret: undefined,
        agentId: undefined,
        roleName: undefined,
        roleId: undefined,
        loginName: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      companyAdd(this.temp).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      const tempData = Object.assign({}, this.temp)
      companyEdit(tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    productDel(index, row) {
      this.$confirm('是否删除 ' + row.name + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        companyDel({ product_id: row.id }).then(response => {
          if (response.code === 1) {
            for (let i = 0, len = this.productList.length; i < len; i++) {
              if (this.productList[i].id === row.id) {
                this.productList.splice(i, 1)
              }
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      })
    }
  },
  created() {
    this.getCompanyData()
  }
}
</script>

<style scoped>
.all-data {
  margin: 0 auto;
}
.all-data .data-li {
  text-align: center;
  line-height: 3em;
  color: black;
}
.li1 {
  background: #f0f0ee;
}
.li2 {
  background: #fafafa;
}
.li3 {
  background: #f0f0ee;
}
.tag-row {
  margin-top: 30px;
}
.tag-list {
  cursor: pointer;
  margin: 0 5px;
}
.addBtn {
  margin-left: 10px;
}
</style>
