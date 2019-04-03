<template>
  <div class="app-container">
    <div class="all-data">
      <el-row>
        <el-col :span="8" class="data-li li1">待审核单数：{{allData.orderNum}}</el-col>
        <el-col :span="8" class="data-li li2">待审核销售额：{{allData.orderSalesNum}}</el-col>
      </el-row>
    </div>
    <div class="filter-container">
      <el-card class="box-card" shadow="hover" style="margin: 15px 0 5px;">
        <el-row>
          <el-col :span="6" class="search-li">
            <span>产品信息：</span>
            <el-input v-model="pageInfo.product" placeholder="请输入产品名称或编号" style="width: 60%"></el-input>
          </el-col>
          <el-col :span="6" class="search-li">
            <span>客户信息：</span>
            <el-input v-model="pageInfo.customer" placeholder="请输入客户姓名或手机号" style="width: 60%"></el-input>
          </el-col>
          <el-col :span="6" class="search-li">
            <span>销售区域：</span>
            <el-select v-model="pageInfo.area" clearable placeholder="请选择">
              <el-option
                v-for="item in areaData"
                :key="item.id"
                :label="item.net_spot_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col :span="6" class="search-li">
            <span>展业员信息：</span>
            <el-input v-model="pageInfo.person" placeholder="请输入展业员姓名、编号或手机号" style="width: 60%"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click.native="search">搜索</el-button>
            <el-button class="addBtn" type="primary" @click="handleCreat">创建订单</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="handleDerived">导出</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <div class="people-list">
      <el-table
        v-loading="loading"
        :data="orderList"
        border
        fit
        stripe
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="单号" prop="id" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.order_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报单时间" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="网点" width="100px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.net_spot_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售员" width="130" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户" min-width="150" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.order_type == 0">新增</span>
            <span v-else>续费</span>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="购买数量" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.product_num }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总价" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.order.order_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">
            <span>待审核</span>
          </template>
        </el-table-column>
        <el-table-column label="到期时间" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.order.expire_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业绩关联" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.order.order_price }}</span>
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
              :to="{path:'/orderManage/orderDetail/orderDetail', query:{orderId:scope.row.id}}"
            >
              <el-button size="mini" type="success">详情</el-button>
            </router-link>
            <el-button size="mini" type="danger" @click="orderDel">删除</el-button>
            <el-button size="mini" type="primary">审核</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageInfo.curPage"
        :limit.sync="pageInfo.pageSize"
        @pagination="getOrderData"
      />
    </div>
    <div class="components-container">
      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogTableVisible"
        :before-close="closeDialog"
        title="创建订单"
        @dragDialog="handleDrag"
      >
        <el-form ref="form" :model="orderForm" label-width="100px">
          <el-form-item label="订单号：">
            <el-input v-model="orderForm.order_num" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="选择产品：">
            <!-- <el-input v-model="orderForm.product"></el-input> -->
            <el-select v-model="orderForm.productId" placeholder="请选择">
              <el-option
                v-for="item in allProduct"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="选择规格：">
            <el-input v-model="orderForm.product"></el-input>
          </el-form-item>-->
          <el-form-item label="选择客户：">
            <el-select v-model="orderForm.person" placeholder="请选择">
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
          <el-form-item label="购买数量：">
            <el-input-number v-model="orderForm.buyNum" :min="1" :max="10000"></el-input-number>
          </el-form-item>
          <el-form-item label="服务期限：">
            <el-date-picker
              v-model="orderForm.serveTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="类型：">
            <el-radio-group v-model="orderForm.type">
              <el-radio :label="0">新增</el-radio>
              <el-radio :label="1">续费</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="合计：">
            <span>123</span>
          </el-form-item>
          <el-form-item>
            <el-button @click="dialogTableVisible = false">取消</el-button>
            <el-button type="primary" @click="onSubmit">提交订单</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as city from '../../../utils/city-data'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import { getOrderList, getOrderNum, showAllProduct } from '@/api/dingpc/UnAuditedOrder'
export default {
  components: { Pagination },
  directives: { elDragDialog },
  name: 'index',
  data() {
    return {
      loading: true,
      dialogTableVisible: false,
      allData: {
        orderNum: 0,
        orderSalesNum: 0
      },
      allProduct: [],
      orderList: [],
      areaData: [],
      pageInfo: {
        curPage: 1,
        pageSize: 10,
        product: undefined,
        customer: undefined,
        person: undefined,
        area: undefined,
        companyId: 1
      },
      total: 0,
      orderForm: {
        buyNum: 1
      },
      personList: [],
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
          this.total = response.data.total
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
    },
    handleCreat() {
      getOrderNum().then(res => {
        this.dialogTableVisible = true
        this.orderForm.order_num = res.data
        this.getAllProduct()
      })
    },
    getAllProduct() {
      showAllProduct().then(res => {
        this.allProduct = res.data
      })
    },
    handleDerived() {
      console.log('待开发')
    },
    closeDialog() {
      this.dialogTableVisible = false
    },
    handleDrag() {
      // this.$refs.select.blur()
    },
    onSubmit() {
      console.log(this.orderForm)
    }
  },
  created() {
    this.getOrderData()
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
