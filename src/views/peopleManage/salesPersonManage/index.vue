<template>
  <div class="app-container">
    <div class="all-data">
      <el-row>
        <el-col :span="8" class="data-li li1">总展业员人数：{{allData.allUsers}}</el-col>
        <el-col :span="8" class="data-li li2">师傅人数：{{allData.master}}</el-col>
        <el-col :span="8" class="data-li li3">普通展业员人数：{{allData.user}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="data-li li4">余额总额：{{allData.balance}}</el-col>
        <el-col :span="8" class="data-li li5">积分总额：{{allData.integral}}</el-col>
        <el-col :span="8" class="data-li li6">累计佣金总额：100</el-col>
      </el-row>
    </div>
    <div class="filter-container">
      <el-card class="box-card" shadow="hover" style="margin: 15px 0 5px;">
        <el-row>
          <el-col :span="6" class="search-li">
            <span>员工信息：</span>
            <el-input v-model="listQuery.userInfo" placeholder="请输入员工姓名、编号或手机号" style="width: 60%"></el-input>
          </el-col>
          <el-col :span="6" class="search-li">
            <span>所属城市：</span>
            <el-cascader
              expand-trigger="click"
              ref="cascaderAddr"
              :options="cityData"
              v-model="selectedOptions"
              change-on-select
              clearable
              filterable
              @change="cityChange"
              style="width: 65%;"
            ></el-cascader>
          </el-col>
          <el-col :span="6" class="search-li">
            <span>所属网点：</span>
            <el-select v-model="listQuery.net_spot" clearable placeholder="请选择">
              <el-option
                v-for="item in netData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6" class="search-li">
            <span>职称：</span>
            <el-select v-model="listQuery.profession" clearable placeholder="请选择">
              <el-option
                v-for="item in professionData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="tag-row">
          <el-col :span="18">
            <span>标签：</span>
            <el-tag
              v-for="(item, index) in tagList"
              :val="item.id"
              :key="index"
              class="tag-list"
              :type="item.checked?'':'info'"
              @click.native="toggleTag(index)"
            >{{item.tagName}}</el-tag>
          </el-col>
          <el-col :span="6">
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >搜索</el-button>
            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-refresh"
              @click="synchronizationDing"
            >同步钉钉人员</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" prop="id" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="65" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" width="65" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属城市" min-width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.province}}</span>-
          <span>{{scope.row.city}}</span>-
          <span>{{scope.row.area}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属网点" align="center" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.net_spot_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职称" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.profession_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总报单数" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.order_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总销售额" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.order_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.integral }}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计佣金" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.commision }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.status.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.curPage"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dialogForm"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="员工编号" prop="num">
          <el-input type="number" v-model="dialogForm.num"></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input type="number" v-model="dialogForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="dialogForm.sex.code">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input type="number" v-model="dialogForm.age"></el-input>
        </el-form-item>
        <el-form-item label="所属网点" prop="net_spot_name">
          <el-select v-model="dialogForm.net_spot_name" placeholder="请选择网点" @change="netSpotChange">
            <el-option
              v-for="item in netData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在城市">
          <el-input
            placeholder="省"
            v-model="dialogForm.province"
            :disabled="true"
            style="width: 25%"
          ></el-input>
          <el-input placeholder="市" v-model="dialogForm.city" :disabled="true" style="width: 25%"></el-input>
          <el-input placeholder="区" v-model="dialogForm.area" :disabled="true" style="width: 25%"></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="profession">
          <el-input
            placeholder="请选择"
            v-model="dialogForm.profession_name"
            :disabled="true"
            style="width: 25%"
          ></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="selectTag">
          <el-select multiple v-model="dialogForm.tag" placeholder="请选择" style="width: 100%">
            <el-option-group v-for="group in groupTag" :key="group.name" :label="group.name">
              <el-option
                v-for="item in group.tag"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dialogForm.status.code">
            <el-radio :label="0">在职</el-radio>
            <el-radio :label="1">离职</el-radio>
          </el-radio-group>
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
import * as city from '../../../utils/city-data'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import Pagination from '@/components/Pagination'
import _ from 'lodash'
import { getUserData, getNetSpot, getProfession, getTag, searchPerson, getNetCity, getPeopleTag, addSalesPerson, editSalesPerson } from '@/api/dingpc/SalesPerson'

export default {
  name: 'SalesPerson',
  components: { Pagination },
  directives: { elDragDialog },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        curPage: 1,
        pageSize: 10,
        userInfo: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        net_spot: undefined,
        profession: undefined,
        tag: undefined,
        companyId: 1
      },
      allData: {
        balance: 0,
        integral: 0,
        master: 0,
        allUsers: 0,
        user: 0
      },
      dialogForm: {
        userId: '',
        num: '',
        name: '',
        phone: '',
        sex: '',
        age: '',
        netSpot: [],
        province: '',
        city: '',
        area: '',
        profession: '',
        status: '',
        selectTag: []
      },
      cityData: city.cityInfo,
      selectedOptions: [],
      searchInput: '',
      netData: [],
      professionData: [],
      netValue: '',
      professionValue: '',
      tagList: [],
      sProvince: '',
      sCity: '',
      sArea: '',
      sTag: '',
      groupTag: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getUserData()
    this.getNet()
    this.getProfession()
    this.getTag()
    this.getPeopleTag()
  },
  methods: {
    getList() {
      this.listLoading = true
      searchPerson(this.listQuery).then(res => {
        this.list = res.data.userList
        this.total = res.data.total
        this.listLoading = false
      })
    },
    cityChange(value) {
      this.listQuery.province = this.$refs['cascaderAddr'].currentLabels[0] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[0]
      this.listQuery.city = this.$refs['cascaderAddr'].currentLabels[1] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[1]
      this.listQuery.area = this.$refs['cascaderAddr'].currentLabels[2] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[2]
    },
    handleFilter() {
      this.listQuery.curPage = 1
      this.getList()
    },
    resetTemp() {
      this.dialogForm = {
        userId: '',
        num: '',
        name: '',
        phone: '',
        sex: '',
        age: '',
        netSpot: [],
        province: '',
        city: '',
        area: '',
        profession: '',
        status: '',
        selectTag: []
      }
    },
    synchronizationDing() {
      this.$notify({
        title: '警告',
        message: '该功能还未开发',
        type: 'warning',
        duration: 2000
      })
    },
    handleUpdate(row) {
      this.dialogForm = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      console.log(row)
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {}
          editSalesPerson(params).then(res => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleEdit(index, row) {
      this.dialogTitle = '编辑展业员'
      this.dialogTableVisible = true
      this.form.num = row.num
      this.form.userId = row.id
      this.form.name = row.name
      this.form.phone = row.phone
      this.form.sex = row.sex.code.toString()
      this.form.age = row.age
      this.form.status = row.status.code.toString()
      this.form.netSpot = row.net_spot_id
      this.form.province = row.province
      this.form.city = row.city
      this.form.area = row.area
      this.form.selectTag = row.tag
    },
    addSalesPerson() {
      this.dialogTitle = '添加展业员'
      this.dialogTableVisible = true
    },
    netSpotChange() {
      getNetCity({ netSpot: this.form.netSpot }).then(response => {
        if (response.code === 1) {
          this.form.province = response.data.province
          this.form.city = response.data.city
          this.form.area = response.data.area
        }
      }).finally(() => {
      })
    },
    toggleTag(index) {
      var tagList = this.tagList
      var tag = ''
      tagList[index].checked = !tagList[index].checked
      _.forEach(tagList, (item, index) => {
        if (item.checked) {
          tag += item.val + ','
        }
      })
      this.listQuery.tag = tag.substr(0, tag.length - 1)
    },
    indexMethod(index) {
      return (this.pageInfo.curPage - 1) * this.pageInfo.pageSize + (index + 1)
    },
    getUserData() {
      getUserData().then(response => {
        if (response.data) {
          var allData = response.data.allData
          this.allData = {
            balance: allData.allBalance,
            integral: allData.allIntegral,
            master: allData.allMaster,
            user: allData.ordinaryUser,
            allUsers: allData.allUsers
          }
          console.log('累计佣金总额')
          console.log('dingpc/sales_person/getUserList--500(城市)')
        }
      })
    },
    getNet() {
      getNetSpot().then(response => {
        if (response.data) {
          var data = response.data
          _.forEach(data, (item, index) => {
            var obj = {
              value: item.id,
              label: item.net_spot_name
            }
            this.netData.push(obj)
          })
        }
      })
    },
    getProfession() {
      getProfession().then(response => {
        if (response.data) {
          var data = response.data.profession
          _.forEach(data, (item, index) => {
            var obj = {
              value: item.id,
              label: item.name
            }
            this.professionData.push(obj)
          })
        }
      })
    },
    getTag() {
      getTag().then(response => {
        if (response.data) {
          var data = response.data.tag
          _.forEach(data, (item, index) => {
            var obj = {
              val: item.id,
              tagName: item.name,
              checked: false
            }
            this.tagList.push(obj)
          })
        }
      })
    },
    // 添加展业员-标签选择
    getPeopleTag() {
      getPeopleTag({
        companyId: 1,
        viewId: 2
      }).then(response => {
        if (response.code === 1) {
          this.groupTag = response.data
        }
      }).finally(() => {

      })
    },
    handleCurrentChange(val) {
      this.listLoading = true
      this.pageInfo.curPage = val
      searchPerson({
        'curPage': this.pageInfo.curPage,
        'pageSize': this.pageInfo.pageSize,
        'userInfo': this.searchInput,
        'province': this.sProvince,
        'city': this.sCity,
        'area': this.sArea,
        'net_spot': this.netValue,
        'profession': this.professionValue,
        'tag': this.sTag,
        'companyId': 1
      }).then(response => {
        if (response.data) {
          this.userList = response.data.userList
          this.pageInfo.total = response.data.total
        }
      }).finally(() => {
        this.listLoading = false
      })
    },
    addPeople() {
      addSalesPerson({
        num: this.form.num,
        name: this.form.name,
        phone: this.form.phone,
        sex: this.form.sex,
        age: this.form.age,
        net_spot_id: this.form.netSpot,
        // profession_title_id: this.form.profession,
        status: this.form.status,
        tag: this.form.selectTag.toString()
      }).then(response => {
        if (response.code === 1) {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.getUserData()
          this.dialogTableVisible = false
        } else {
          this.$message({
            type: 'success',
            message: response.msg
          })
        }
      }).finally(() => {
        this.listLoading = false
      })
    },
    editPeople() {
      editSalesPerson({
        num: this.form.num,
        name: this.form.name,
        phone: this.form.phone,
        sex: this.form.sex,
        age: this.form.age,
        net_spot_id: this.form.netSpot,
        // profession_title_id: this.form.profession,
        status: this.form.status,
        userId: this.form.userId,
        tag: this.form.selectTag.toString()
      }).then(response => {
        if (response.code === 1) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.getUserData()
          this.dialogTableVisible = false
        } else {
          this.$message({
            type: 'success',
            message: response.msg
          })
        }
      }).finally(() => {
        this.listLoading = false
      })
    }
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
.li4 {
  background: #fafafa;
}
.li5 {
  background: #f0f0ee;
}
.li6 {
  background: #fafafa;
}
.tag-row {
  margin-top: 30px;
}
.tag-list {
  cursor: pointer;
  margin: 0 5px;
}
</style>
