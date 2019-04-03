<template>
  <div class="app-container">
    <el-tabs v-model="tabName" type="border-card" v-loading="loading">
      <el-tab-pane label="基本信息" name="first">
        <el-form ref="form" :model="customerForm" label-width="350px">
          <el-form-item v-if="customerForm.customer_type === 1" label="企业名称：">
            <span>{{customerForm.company_name}}</span>
          </el-form-item>
          <el-form-item label="联系人姓名：">
            <span>{{customerForm.customer_name}}</span>
          </el-form-item>
          <el-form-item label="联系电话：">
            <span>{{customerForm.phone}}</span>
          </el-form-item>
          <el-form-item label="所属展业员：">
            <el-select
              v-model="customerForm.salesPersonId"
              placeholder="请选择"
              @change="peopleChange"
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
          <el-form-item label="所属网点：">
            <el-input v-model="customerForm.net_spot_name" disabled="disabled" style="width: 15%"></el-input>
          </el-form-item>
          <el-form-item label="所在城市：">
            <el-input v-model="customerForm.province" disabled="disabled" style="width: 15%"></el-input>
            <el-input v-model="customerForm.city" disabled="disabled" style="width: 15%"></el-input>
            <el-input v-model="customerForm.area" disabled="disabled" style="width: 15%"></el-input>
          </el-form-item>
          <el-form-item label="标签：">
            <el-select multiple v-model="customerForm.tag" placeholder="请选择" style="width: 50%">
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
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="交易信息" name="second">
        <el-form ref="form" :model="customerForm" label-width="150px">
          <el-form-item label="成交单数">
            <span>{{orderNum}}</span>
          </el-form-item>
          <el-form-item label="成交金额">
            <span>{{orderPrice}}</span>
          </el-form-item>
        </el-form>
        <div class="block">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in customerOrder"
              :key="index"
              :color="index === 0?'blue':'#ccc'"
              :timestamp="item.create_time"
              placement="top"
            >
              <el-card>
                <h2 v-if="item.order_status === 0">审核中</h2>
                <h2 v-if="item.order_status === 1">已出单</h2>
                <h2 v-if="item.order_status === 2">未通过</h2>
                <p style="color: #cccccc;">购买了{{item.name}}</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item :timestamp="createTime" placement="top">
              <el-card>
                <h4>客户创建</h4>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
      <div style="text-align: center">
        <el-button round style="margin: 20px;width: 100px" @click="handleCancel">取消</el-button>
        <el-button type="primary" round style="margin: 20px;width: 100px" @click="handleUpdate">保存</el-button>
      </div>
    </el-tabs>
  </div>
</template>

<script>
import { getCustomerTag, getCustomerInfo, getAllPerson, customerRecord, saveCustomerBase } from '@/api/dingpc/customerManage'
export default {
  name: 'index',
  created() {
    this.$nextTick(() => {
      this.getCustomerInfo()
    })
    this.getAllPerson()
    this.getCustomerTag()
    this.customerRecord()
  },
  data() {
    return {
      tabName: 'first',
      index: '1',
      loading: true,
      customerId: this.$route.query.customerId,
      personList: [],
      customerForm: {
        customer_type: 0
      },
      groupTag: [],
      customerOrder: [],
      createTime: '',
      orderNum: 0,
      orderPrice: 0
    }
  },
  methods: {
    getCustomerInfo() {
      getCustomerInfo({ customerId: this.customerId }).then(response => {
        if (response.data) {
          this.customerForm = response.data
          this.loading = false
        }
      })
    },
    getCustomerTag() {
      getCustomerTag({ companyId: 1, viewId: 4 }).then(response => {
        if (response.code === 1) {
          this.groupTag = response.data
        }
      })
    },
    getAllPerson() {
      getAllPerson({
        id: 1
      }).then(response => {
        if (response.data) {
          this.personList = response.data
        }
      })
    },
    // 展业员select改变
    peopleChange() {
      console.log(this.customerForm.salesPersonId)
      // getNetCity({
      //   user_id: this.customerForm.salesPersonId
      // }).then(response => {
      //   if (response.code === 1) {
      //     this.customerForm.net_spot_name = response.data.net_spot_name
      //     this.customerForm.province = response.data.province
      //     this.customerForm.city = response.data.city
      //     this.customerForm.area = response.data.area
      //   }
      // }).finally(() => {

      // })
    },
    // 获取客户记录
    customerRecord() {
      customerRecord({
        customerId: this.customerId
      }).then(response => {
        if (response.code === 1) {
          this.customerOrder = response.data.order
          this.orderNum = response.data.orderCount
          this.createTime = response.data.create_time
          this.orderPrice = response.data.price
        }
      })
    },
    handleUpdate() {
      var params = {
        customerId: this.customerForm.id,
        id: this.customerForm.salesPersonId,
        tags: this.customerForm.tag
      }

      saveCustomerBase(params).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        if (this.customerForm.customer_type === 0) {
          this.$router.push({ name: 'personalManage' })
        } else if (this.customerForm.customer_type === 1) {
          this.$router.push({ name: 'enterpriseManage' })
        }
      })
    },
    handleCancel() {
      if (this.customerForm.customer_type === 0) {
        this.$router.push({ name: 'personalManage' })
      } else if (this.customerForm.customer_type === 1) {
        this.$router.push({ name: 'enterpriseManage' })
      }
    }
  }
}
</script>

<style scoped>
</style>
