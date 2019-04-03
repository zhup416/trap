<template>
  <div class="app-container">
    <el-button type="primary" style="margin: 20px">设置展业员</el-button>
    <el-table :data="personData" stripe style="width: 100%">
      <el-table-column prop="date" label="序号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="address" label="手机号"></el-table-column>
      <el-table-column prop="date" label="性别"></el-table-column>
      <el-table-column prop="name" label="年龄"></el-table-column>
      <el-table-column prop="address" label="所属城市"></el-table-column>
      <el-table-column prop="date" label="所属网点"></el-table-column>
      <el-table-column prop="name" label="职称"></el-table-column>
      <el-table-column prop="address" label="总报单数 "></el-table-column>
      <el-table-column prop="date" label="总销售额"></el-table-column>
      <el-table-column prop="name" label="余额"></el-table-column>
      <el-table-column prop="address" label="积分"></el-table-column>
      <el-table-column prop="date" label="状态"></el-table-column>
      <el-table-column prop="name" label="操作"></el-table-column>
    </el-table>
    <el-row type="flex" justify="center">
      <el-col class="pageBox" :span="6">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="pageInfo.page"
          :page-size="pageInfo.limit"
          layout="prev, pager, next"
          :total="pageInfo.total"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { setPeoson } from '@/api/dingpc/NetSpot'
export default {
  name: 'index',
  data() {
    return {
      loading: true,
      pageInfo: {
        page: 1,
        limit: 5,
        total: 10
      },
      personData: null
    }
  },
  created() {
    this.netSpotId = this.$route.query.netSpot_id
    this.getPeoson()
  },
  methods: {
    handleCurrentChange(val) {
      this.loading = true
      this.pageInfo.page = val
    },
    getPeoson() {
      setPeoson({ netId: this.netSpotId }).then(res => {
        console.log(res.data)
      })
    }
  }
}
</script>

<style scoped>
</style>
