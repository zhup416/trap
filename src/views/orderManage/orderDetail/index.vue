<template>
  <div class="app-container">
    <div style="box-shadow: 0 0 10px #E0E0DD;padding: 50px 0;border-radius: 10px">
        <el-steps :active="2" :align-center="true" finish-status="success">
          <el-step title="生成订单"  description="2019/03/01 18:00:00"></el-step>
          <el-step title="待审核"></el-step>
          <el-step title="财务审核"></el-step>
        </el-steps>
    </div>
    <el-row style="margin: 20px 0;">
      <el-col :span="11">
        <el-card class="box-card">
          <div slot="header">
            <span>订单信息</span>
          </div>
          <el-form ref="form" :model="form" label-width="150px">
            <el-form-item label="订单号：">
              <span>123</span>
            </el-form-item>
            <el-form-item label="客户信息：">
              <span>123</span>
            </el-form-item>
            <el-form-item label="销售员：">
              <span>123</span>
            </el-form-item>
            <el-form-item label="订单类型：">
              <span>123</span>
            </el-form-item>
            <el-form-item label="到期时间：">
              <span>123</span>
            </el-form-item>
            <el-form-item label="业绩管理：">
              <span>123</span>
            </el-form-item>
            <el-form-item label="所属网点：">
              <span>123</span>
            </el-form-item>
            <el-form-item label="报单时间：">
              <span>123</span>
            </el-form-item>
          </el-form>
        </el-card>`
      </el-col>
      <el-col :span="12" offset="1">
        <el-card class="box-card" style="height: 561px">
          <h2>订单状态：待审核</h2>
          <p>订单还未审核</p>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col><h2>产品信息</h2></el-col>
      <el-table
        :data="tableData6"
        :summary-method="getSummaries"
        show-summary
        style="width: 100%; margin-top: 20px">
        <el-table-column
          prop="id"
          label="产品图片"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="产品名称">
        </el-table-column>
        <el-table-column
          prop="amount1"
          label="单价">
        </el-table-column>
        <el-table-column
          prop="amount2"
          label="数量">
        </el-table-column>
        <el-table-column
          prop="amount3"
          label="规格属性">
        </el-table-column>
      </el-table>
    </el-row>
    <el-row style="margin-bottom: 50px">
      <h2>审核信息</h2>
      <el-card class="box-card" style="width: 35%">
        <el-form ref="form" :model="form" label-width="90px">
          <el-form-item label="审核意见：">
            <el-radio-group v-model="radio2">
              <el-radio :label="3">同意</el-radio>
              <el-radio :label="6">不同意</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              :rows="4"
              style="width: 400px"
              placeholder="请输入内容"
              v-model="textarea">
            </el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button>返回列表</el-button>
          <el-button type="primary">提交审核</el-button>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        tableData6: [{
          id: '12987122',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        }, {
          id: '12987123',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        }, {
          id: '12987124',
          name: '王小虎',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        }, {
          id: '12987125',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        }, {
          id: '12987126',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        }]
      }
    },
    methods: {
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += ' 元'
          } else {
            sums[index] = 'N/A'
          }
        })
        return sums
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
