<template>
  <div class="app-container">
    <el-button type="primary" style="margin: 20px" @click="handleBack">添加展业员</el-button>
    <el-table
      v-loading="loading"
      :data="personData"
      stripe
      style="width: 100%"
      border
      fit
      highlight-current-row
    >
      <el-table-column prop="id" label="序号" align="center" width="65"></el-table-column>
      <el-table-column prop="nickname" label="姓名" align="center" width="100"></el-table-column>
      <el-table-column prop="mobile" label="手机号" align="center" min-width="90"></el-table-column>
      <el-table-column prop="sex.desc" label="性别" align="center" width="90"></el-table-column>
      <el-table-column prop="age" label="年龄" align="center" width="70"></el-table-column>
      <el-table-column label="所属城市" min-width="150" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.province">
            <span>{{scope.row.province}}</span>-
            <span>{{scope.row.city}}</span>-
            <span>{{scope.row.area}}</span>
          </span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="net_spot_name" label="所属网点" align="center" width="110"></el-table-column>
      <el-table-column prop="profession_name" label="职称" align="center" width="110"></el-table-column>
      <el-table-column prop="order_num" label="总报单数 " align="center" width="100"></el-table-column>
      <el-table-column prop="order_price" label="总销售额" align="center" width="100"></el-table-column>
      <el-table-column prop="balance" label="余额" align="center" width="100"></el-table-column>
      <el-table-column prop="integral" label="积分" align="center" width="90"></el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status.code === 0">{{scope.row.status.desc}}</el-tag>
          <el-tag type="info" v-else>{{scope.row.status.desc}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageInfo.page"
      :limit.sync="pageInfo.limit"
      @pagination="getPeoson"
    />
    <el-dialog title="添加展业员" :visible.sync="dialogFormVisible">
      <el-form
        :model="netForm"
        label-position="left"
        label-width="100px"
        style="width: 70%; margin-left:50px;"
      >
        <el-form-item label="选择展业员：">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="netSpotIdArr" @change="handleCheckedCitiesChange">
            <el-checkbox
              v-for="item in allNetSpot"
              :label="item.user_id"
              :key="item.user_id"
            >{{item.nickname}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { searchPerson, addSalesPerson, setSalesPerson } from '@/api/dingpc/SalesPerson'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  name: 'index',
  data() {
    return {
      loading: true,
      pageInfo: {
        page: 1,
        limit: 10,
        netSpotId: undefined
      },
      total: 0,
      netForm: {
        num: undefined
      },
      netSpotIdArr: [],
      allNetSpot: [],
      dialogFormVisible: false,
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: ['上海', '北京', '广州', '深圳'],
      isIndeterminate: true,
      personData: null
    }
  },
  created() {
    this.pageInfo.netSpotId = this.$route.query.netSpot_id
    if (this.pageInfo.netSpotId) {
      this.getPeoson()
    } else {
      this.$message.error('错了哦，请从列表选择设置展业员')
      this.$router.push({ name: 'netSpotIndex' })
    }
  },
  methods: {
    getPeoson() {
      this.loading = true
      searchPerson(this.pageInfo).then(res => {
        this.loading = false
        this.personData = res.data.items
        this.total = res.data.total
      })
    },
    handleDrag() { },
    handleCheckAllChange(val) {
      var idArr = []
      this.allNetSpot.forEach(item => {
        idArr.push(item.user_id)
      })
      this.netSpotIdArr = val ? idArr : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      var checkedCount = value.length
      this.checkAll = checkedCount === this.allNetSpot.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allNetSpot.length
    },
    handleBack() {
      addSalesPerson({ requestType: 1 }).then(res => {
        this.dialogFormVisible = true
        this.allNetSpot = res.data
      })
    },
    onSubmit() {
      var params = {
        userId: this.netSpotIdArr,
        netSpotId: this.pageInfo.netSpotId
      }
      setSalesPerson(params).then(res => {
        this.getPeoson()
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: res.msg,
          duration: '1500'
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
