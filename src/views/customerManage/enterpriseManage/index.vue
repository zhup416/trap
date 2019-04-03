<template>
  <div class="app-container">
    <div class="all-data">
      <el-row>
        <el-col :span="8" class="data-li li1">客户总人数：{{allData.customerNum}}</el-col>
        <el-col :span="8" class="data-li li2">客户报单总数：{{allData.customerOrderNum}}</el-col>
        <el-col :span="8" class="data-li li3">累计消费总额：{{allData.salesMoney}}</el-col>
      </el-row>
    </div>

    <div class="filter-container">
      <el-card class="box-card" shadow="hover" style="margin: 15px 0 5px;">
        <el-row>
          <el-col :span="8" class="search-li">
            <span>客户信息：</span>
            <el-input v-model="searchInput" placeholder="请输入客户姓名或手机号" style="width: 60%"></el-input>
          </el-col>
          <el-col :span="8" class="search-li">
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
            ></el-cascader>
          </el-col>
          <el-col :span="8" class="search-li">
            <span>所属网点：</span>
            <el-select v-model="netSpotId" clearable placeholder="请选择">
              <el-option
                v-for="item in netData"
                :key="item.id"
                :label="item.net_spot_name"
                :value="item.id"
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
            <el-button type="primary" @click.native="search">搜索</el-button>
            <el-button class="addBtn" type="primary" @click="dialogTableVisible = true">新建企业客户</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="people-list">
      <el-table
        v-loading="loading"
        :data="customerList"
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
        <el-table-column label="公司名称" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.company_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户姓名" width="100px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.customer_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="180px" align="center">
          <template slot-scope="scope">
            <el-tag
              type="success"
              v-for="item in scope.row.tag"
              :key="item.id"
              style="margin-right: 5px;"
            >{{item.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="130" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属城市" min-width="150" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.province}}</span>-
            <span>{{scope.row.city}}</span>-
            <span>{{scope.row.area}}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属网点" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.net_spot_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属展业员" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="累计订单数" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.order.orders }}</span>
          </template>
        </el-table-column>
        <el-table-column label="累计消费金额" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.order.prices }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="180"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <router-link
              :to="{path:'/customerManage/customerDetail/customerDetail', query:{customerId:scope.row.id}}"
            >
              <el-button size="mini" type="success">详情</el-button>
            </router-link>
            <el-button size="mini" type="danger" @click="customerDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageInfo.curPage"
        :limit.sync="pageInfo.pageSize"
        @pagination="getPersonalCustomerData"
      />
    </div>
    <div class="components-container">
      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogTableVisible"
        :before-close="closeDialog"
        title="新增企业客户"
        @dragDialog="handleDrag"
      >
        <el-form ref="form" :model="customerForm" label-width="100px">
          <el-form-item label="企业名称">
            <el-input v-model="customerForm.companyName" placeholder="请输入企业名称"></el-input>
          </el-form-item>
          <el-form-item label="客户姓名">
            <el-input v-model="customerForm.name" placeholder="请输入客户姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input type="number" v-model="customerForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="所属展业员">
            <el-select
              v-model="customerForm.salesPerson"
              style="width: 100%"
              placeholder="请选择"
              @change="selectPerson(customerForm.salesPerson)"
            >
              <el-option
                v-for="item in personList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.num }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="所属网点">
            <el-input v-model="customerForm.netSpot" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所在城市">
            <el-input v-model="customerForm.city" :disabled="true"></el-input>
          </el-form-item>-->
          <el-form-item label="标签">
            <el-select
              multiple
              v-model="customerForm.selectTag"
              placeholder="请选择"
              style="width: 100%"
            >
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
          <el-form-item>
            <el-button @click="dialogTableVisible = false">取消</el-button>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as city from '../../../utils/city-data'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import Pagination from '@/components/Pagination'
import { getPersonalCustomerData, delCustomer, getSubTag, getSalesPerson, getNetCity, getCustomerTag, addCustomer } from '@/api/dingpc/customerManage'
import { getNetSpot } from '@/api/dingpc/SalesPerson'
export default {
  components: { Pagination },
  directives: { elDragDialog },
  name: 'index',
  data() {
    return {
      loading: true,
      allData: {
        customerNum: 0,
        customerOrderNum: 0,
        salesMoney: 0
      },
      customerList: [],
      pageInfo: {
        curPage: 1,
        pageSize: 10
      },
      total: 0,
      cityData: city.cityInfo,
      selectedOptions: [],
      netCityOption: [],
      searchInput: '',
      netData: [],
      professionData: [],
      netPersonName: '',
      tagList: [],
      sProvince: '',
      sCity: '',
      sArea: '',
      sTag: '',
      dialogTableVisible: false,
      customerForm: {
        name: '',
        phone: '',
        salesPerson: '',
        city: '',
        selectTag: [],
        netSpot: '',
        companyName: ''
      },
      personList: [],
      groupTag: [],
      netSpotId: ''
    }
  },
  methods: {
    getPersonalCustomerData() {
      this.loading = true
      getPersonalCustomerData({
        companyId: 1,
        page: this.pageInfo.curPage,
        limit: this.pageInfo.pageSize,
        tags: this.sTag,
        customerName: this.searchInput,
        province: this.sProvince,
        city: this.sCity,
        area: this.sArea,
        net_spot: this.netSpotId,
        customerType: 1
      }).then(response => {
        if (response.code === 1) {
          this.allData.customerNum = response.data.customerCount
          this.allData.customerOrderNum = response.data.customerOrder
          this.allData.salesMoney = response.data.customerPrice
          this.customerList = response.data.customerList
          this.total = response.data.count
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getNet() {
      getNetSpot().then(response => {
        if (response.code === 1) {
          this.netData = response.data
        }
      })
    },
    indexMethod(index) {
      return (this.pageInfo.curPage - 1) * this.pageInfo.pageSize + (index + 1)
    },
    getSubTag() {
      getSubTag({ companyId: 1, viewId: 4 }).then(response => {
        if (response.code === 1) {
          for (let i = 0, len = response.data.length; i < len; i++) {
            this.tagList.push({
              tagName: response.data[i].name,
              val: response.data[i].id,
              checked: false
            })
          }
        }
      }).finally(() => {

      })
    },
    getPersonList() {
      getSalesPerson({ companyId: 1 }).then(response => {
        if (response.code === 1) {
          this.personList = response.data
        }
      }).finally(() => {

      })
    },
    selectPerson(id) {
      getNetCity({ user_id: id }).then(response => {
        if (response.code === 1) {
          this.customerForm.city = response.data.province + '/' + response.data.city + '/' + response.data.area
          this.customerForm.netSpot = response.data.net_spot_name
        }
      }).finally(() => {

      })
    },
    getCustomerTag() {
      getCustomerTag({ companyId: 1, viewId: 4 }).then(response => {
        if (response.code === 1) {
          this.groupTag = response.data
        }
      }).finally(() => {

      })
    },
    cityChange(value) {
      this.sProvince = this.$refs['cascaderAddr'].currentLabels[0] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[0]
      this.sCity = this.$refs['cascaderAddr'].currentLabels[1] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[1]
      this.sArea = this.$refs['cascaderAddr'].currentLabels[2] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[2]
    },
    toggleTag(index) {
      this.tagList[index].checked = !this.tagList[index].checked
      this.sTag = ''
      for (let i = 0, len = this.tagList.length; i < len; i++) {
        if (this.tagList[i].checked) {
          this.sTag += this.tagList[i].val + ','
        }
      }
      this.sTag = this.sTag.substr(0, this.sTag.length - 1)
    },
    handleCurrentChange(val) {
      this.loading = true
      this.pageInfo.curPage = val
      this.getPersonalCustomerData()
    },
    search() {
      this.loading = true
      this.pageInfo.curPage = 1
      this.getPersonalCustomerData()
    },
    customerDel(index, row) {
      this.$confirm('是否删除 ' + row.customer_name + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCustomer({ customerId: row.id }).then(response => {
          if (response.code === 1) {
            for (let i = 0, len = this.customerList.length; i < len; i++) {
              if (this.customerList[i].id === row.id) {
                this.customerList.splice(i, 1)
              }
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        }).finally(() => {
        })
      }).catch(() => {
      })
    },
    handleDrag() {
      // this.$refs.select.blur()
    },
    closeDialog() {
      this.dialogTableVisible = false
      this.customerForm.name = ''
      this.customerForm.phone = ''
      this.customerForm.salesPerson = ''
      this.customerForm.city = ''
      this.customerForm.selectTag = []
      this.customerForm.netSpot = ''
    },
    onSubmit() {
      addCustomer({
        companyName: this.customerForm.companyName,
        customerName: this.customerForm.name,
        phone: this.customerForm.phone,
        id: this.customerForm.salesPerson,
        tagId: this.customerForm.selectTag.toString()
      }).then(response => {
        if (response.code === 1) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getPersonalCustomerData()
          this.dialogTableVisible = false
        }
      }).finally(() => {
      })
    }
  },
  created() {
    this.getPersonalCustomerData()
    this.getNet()
    this.getSubTag()
    this.getPersonList()
    this.getCustomerTag()
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
