<template>
  <div class="app-container">

    <div class="searchBox">
      <el-row>
        <el-col :span="6" class="search-li">
          <span>标签名：</span>
          <el-input v-model="productInput" placeholder="请输入标签名" style="width: 60%"></el-input>
        </el-col>
        <el-col :span="6" class="search-li">
          <span>应用场景：</span>
          <el-select v-model="netValue" placeholder="请选择">
            <el-option
              v-for="item in netData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="search-li">
          <span>状态：</span>
          <el-select v-model="netValue" placeholder="请选择">
            <el-option
              v-for="item in netData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click.native="search">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <router-link :to="'/tagManage/addTag/addTag'">
      <el-button type="primary">添加标签组</el-button>
    </router-link>
    <div class="people-list" v-loading="loading">
      <el-table
        :data="orderList"
        stripe
        style="width: 100%;">
        <el-table-column
          prop="order_num"
          width="150"
          label="标签ID">
        </el-table-column>
        <el-table-column
          prop="net_spot_name"
          label="标签组名称">
        </el-table-column>
        <el-table-column
          prop="name"
          label="应用场景">
        </el-table-column>
        <el-table-column
          prop="customer_name"
          label="状态">
        </el-table-column>
        <el-table-column
          width="300px"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
            >删除</el-button>
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
