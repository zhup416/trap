<template>
  <div class="app-container">
    <div class="all-data">
      <el-row>
        <el-col :span="8" class="data-li li1">应收款：{{allData.orderNum}}</el-col>
        <el-col :span="8" class="data-li li2">已收款：{{allData.orderSalesNum}}</el-col>
        <el-col :span="8" class="data-li li2">未收款：{{allData.orderSalesNum}}</el-col>
      </el-row>
    </div>

    <div class="searchBox">
      <el-row>
        <el-col :span="6" class="search-li">
          <el-input v-model="productInput" placeholder="请输入申请ID、员工ID、员工姓名、账号、账户搜索" style="width: 60%"></el-input>
        </el-col>
        <el-col :span="8" class="search-li">
            <span>申请时间：</span>
            <el-date-picker
              v-model="value7"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions2">
            </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click.native="search">搜索</el-button>
        </el-col>
      </el-row>
      <div class="btn" style="margin: 20px 0">
        <el-button-group>
          <el-button type="primary">待确认列表</el-button>
          <el-button type="info">已转账列表</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="people-list" v-loading="loading">
      <el-table
        :data="orderList"
        stripe
        style="width: 100%;">
        <el-table-column
          prop="order_num"
          width="150"
          label="申请ID">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="员工ID">
        </el-table-column>
        <el-table-column
          prop="net_spot_name"
          label="员工姓名">
        </el-table-column>
        <el-table-column
          prop="name"
          label="申请时间">
        </el-table-column>
        <el-table-column
          prop="customer_name"
          label="申请金额">
        </el-table-column>
        <el-table-column
          prop="order_type"
          label="银行名称">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="银行账号">
        </el-table-column>
        <el-table-column
          prop="product_num"
          label="银行账户">
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="状态">
        </el-table-column>
        <el-table-column
          width="300px"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
            >详情</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="orderDel"
            >审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center">
        <el-col class="pageBox" :span="6">
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
    </div>
  </div>

</template>

<script>
  import * as city from '../../../utils/city-data'
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import { getOrderList } from '@/api/dingpc/UnAuditedOrder'
  export default {
    directives: { elDragDialog },
    name: 'index',
    data() {
      return {
        loading: true,
        allData: {
          orderNum: 0,
          orderSalesNum: 0
        },
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        value7: '',
        orderList: [],
        pageInfo: {
          curPage: 1,
          pageSize: 5,
          total: 10
        },
        cityData: city.cityInfo,
        selectedOptions: [],
        productInput: '',
        customerInput: '',
        salesPersonInput: ''
      }
    },
    methods: {
      getOrderData() {
        this.loading = true
        getOrderList({
          companyId: 1,
          curPage: this.pageInfo.curPage,
          pageSize: this.pageInfo.pageSize,
          product: this.productInput,
          customer: this.customerInput,
          person: this.salesPersonInput
        }).then(response => {
          if (response.code === 1) {
            this.allData.orderNum = response.data.count
            this.allData.orderSalesNum = response.data.price
            this.orderList = response.data.show
            this.pageInfo.total = response.data.total
          }
        }).finally(() => {
          this.loading = false
        })
      },
      handleCurrentChange(val) {
        this.loading = true
        this.pageInfo.curPage = val
        this.getOrderData()
      },
      search() {
        this.loading = true
        this.pageInfo.curPage = 1
        this.getOrderData()
      },
      orderDel(index, row) {
        this.$confirm('是否删除 ' + row.name + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
        })
      }
    },
    created() {
      this.getOrderData()
    }
  }
</script>

<style scoped>
  .all-data{
    margin: 0 auto;

  }
  .all-data .data-li{
    text-align: center;
    line-height: 3em;
    color: black;
  }
  .li1{
    background: #F0F0EE;
  }
  .li2{
    background: #fafafa;
  }
  .li3{
    background: #F0F0EE;
  }
  .searchBox{
    padding: 10px;
    border: 1px solid #e1e1e1;
    box-shadow: 0 0 3px #ededee;
    margin: 20px 10px;
  }
  .tag-row{
    margin: 30px 0 20px 0;
  }
  .tag-list{
    cursor: pointer;
    margin: 0 5px;
  }
  .pageBox{
    margin: 30px;
  }
  .addBtn{
    margin: 10px 0 20px 0;
  }
</style>
